import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatMessageI } from '../types/ChatMessageI';
import {fetchStreamResponse , generateChatTitle} from '../utils/api';

interface StreamResponseData {
  prompt : string;
  userMsgId: string;
  assistantMsgId: string;
  streamingResponse: string;

}



export const useChatStream = (chatId: string, isStreaming: boolean, setIsStreaming: (isStreaming: boolean) => void) => {
    const queryClient = useQueryClient();
    
    const updateChatCache = (streamingResponse: string) => {
      queryClient.setQueryData<ChatMessageI[]>(['chat', chatId], (oldData = []) => {
        if (!oldData || oldData.length === 0) {
          console.log('No existing messages in cache');
          return oldData;
        }
        
        const newData = [...oldData];
        console.log('Current messages in cache:', newData);
        
        const lastIndex = newData.length - 1;
        if (newData[lastIndex]?.role === 'assistant') {
          console.log('Updating assistant message at index:', lastIndex);
          newData[lastIndex] = {
            ...newData[lastIndex],
            content: streamingResponse
          };
        } else {
          console.log('Could not find assistant message to update');
        }
        
        return newData;
      });
    };
  
  const mutation = useMutation({
    mutationFn: async (newPrompt: string): Promise<StreamResponseData> => {
      try {
        setIsStreaming(true);
        console.log('Starting stream request for prompt:', newPrompt);
        
        const url = `${import.meta.env.VITE_API_URL}/api/v1/prompt-stream`;
        console.log('Streaming endpoint URL:', url);
        let resData = { 
          prompt: newPrompt,
          userMsgId: '', 
          assistantMsgId: '', 
          streamingResponse: '' 
        };

        await fetchStreamResponse(
            url,
            { chatId, prompt: newPrompt },
            (streamingResponse: any) => {
                updateChatCache(streamingResponse);
              },
            (finalData: any) => {
                resData.userMsgId = finalData.userMsgId;
                resData.assistantMsgId = finalData.assistantMsgId;
                resData.streamingResponse = finalData.streamingResponse;
              },
            
         )


        return resData;
      } catch (error) {
        console.error('Streaming error:', error);
        throw error;
      }
    },
    onMutate: async (newPrompt: string) => {
      await queryClient.cancelQueries({queryKey: ['chat', chatId]});
      
      const previousMessages = queryClient.getQueryData<ChatMessageI[]>(['chat', chatId]);

      queryClient.setQueryData<ChatMessageI[]>(['chat', chatId], (old = []) => [
        ...old,
        {
          _id: 'temp-user-id',
          role: 'user',
          content: newPrompt
        },
        {
          _id: 'temp-assistant-id',
          role: 'assistant',
          content: ''
        }
      ]);

      
      return { previousMessages };
    },

    onError: (error, _, context) => {
      console.error('Mutation error:', error);
      if (context?.previousMessages) {
        console.log('Reverting to previous messages:', context);
        queryClient.setQueryData<ChatMessageI[]>(['chat', chatId], context.previousMessages);

      }
      setIsStreaming(false);
    },

    onSuccess: async (data) => {
      console.log('Mutation succeeded with data:', data);
      queryClient.setQueryData<ChatMessageI[]>(['chat', chatId], (oldData = []) => 
        oldData.map(msg => {
          if (msg._id === 'temp-user-id') {
            return { ...msg, _id: data.userMsgId };
          }
          if (msg._id === 'temp-assistant-id') {
            return { ...msg, _id: data.assistantMsgId };
          }
          return msg;
        })
      );

      setIsStreaming(false);

      const previousMessages = queryClient.getQueryData<ChatMessageI[]>(['chat', chatId]);
      console.log("previousMessages")
      const previousMessagesLength = !previousMessages ? 0 : (previousMessages.length -2 )/ 2
      console.log({previousMessagesLength})

      // if previousMessagesLength === 0, 4, 8, 16, or 32 then do something
      if(previousMessagesLength % 4 === 0){
        const newTitle = await generateChatTitle( chatId);

  
        // Update the title directly with the available queryClient
        queryClient.setQueryData(['userChats'], (oldData: any) => {
          if (!oldData) return oldData;
          return oldData.map((chat: any) => {
            if (chat._id === chatId) {
              return { ...chat, title: newTitle };
            }
            return chat;
          });
        
        });
      }
    },
  });


  const checkPendingPrompt = () => {
    const pendingPrompt = queryClient.getQueryData(['pendingPrompt', chatId]);
    if (pendingPrompt && !isStreaming) {
      console.log('Found pending prompt:', pendingPrompt);
      mutation.mutate(pendingPrompt as string);
      queryClient.removeQueries({queryKey: ['pendingPrompt', chatId]});
    }
  };

  return {
    mutation,
    
    checkPendingPrompt
  };
};