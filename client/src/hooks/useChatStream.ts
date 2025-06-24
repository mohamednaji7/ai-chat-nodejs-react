import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatMessageI } from '../types/ChatMessageI';
import { fetchStreamResponse, generateChatTitle } from '../utils/api';
import { useProjectContext } from '../contexts/ProjectContext';
import { useFileMentionProcessor } from '../components/MessageList/FileMentionProcessor';
import {fileMentionRegex} from '../components/MessageList/FileMentionProcessor';

interface StreamResponseData {
  prompt: string;
  userMsgId: string;
  assistantMsgId: string;
  streamingResponse: string;
}

interface ProjectFile {
  _id: string;
  name: string;
  content: string;
  content_format: string;
  tokens: number | null;
  created_at: string;
}

export const useChatStream = (chatId: string, isStreaming: boolean, setIsStreaming: (isStreaming: boolean) => void) => {
  const queryClient = useQueryClient();
  const { selectedProjectId } = useProjectContext();
  const { preprocessContent, fetchFileForMention } = useFileMentionProcessor();

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
        const processedContent = preprocessContent(streamingResponse);
        
        newData[lastIndex] = {
          ...newData[lastIndex],
          content: processedContent
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
        );

        return resData;
      } catch (error) {
        console.error('Streaming error:', error);
        throw error;
      }
    },
    onMutate: async (newPrompt: string) => {
      await queryClient.cancelQueries({ queryKey: ['chat', chatId] });
      
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
            return { ...msg, _id: data.assistantMsgId, content: preprocessContent(data.streamingResponse) };
          }
          return msg;
        })
      );

      // Process file mentions in the final response
      const processedContent = preprocessContent(data.streamingResponse);
      const fileIds: string[] = [];
      let match;
      while ((match = fileMentionRegex.exec(processedContent)) !== null) {
        const fileId = match[1];
        if (!fileIds.includes(fileId)) {
          fileIds.push(fileId);
          console.log('Found file mention in final response, fetching file:', fileId);
          
          try {
            const file = await fetchFileForMention(fileId);
            queryClient.setQueryData<ProjectFile[]>([selectedProjectId, 'projectFiles'], (oldFiles = []) => {
              if (oldFiles.some(existingFile => existingFile._id === file._id)) {
                return oldFiles;
              }
              return [...oldFiles, file];
            });
          } catch (error) {
            console.error('Error appending file to cache:', error);
          }
        }
      }

      setIsStreaming(false);

      const previousMessages = queryClient.getQueryData<ChatMessageI[]>(['chat', chatId]);
      console.log("previousMessages");
      const previousMessagesLength = !previousMessages ? 0 : (previousMessages.length - 2) / 2;
      console.log({ previousMessagesLength });

      if (previousMessagesLength % 4 === 0) {
        const newTitle = await generateChatTitle(chatId);

        queryClient.setQueryData([selectedProjectId, 'userChats'], (oldData: any) => {
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
      queryClient.removeQueries({ queryKey: ['pendingPrompt', chatId] });
    }
  };

  return {
    mutation,
    checkPendingPrompt
  };
};