export const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : `http://${window.location.hostname}:3000`);

export const updateMessageReaction = async (messageId: string, reaction: string) => {
  return fetch(`${API_BASE}/api/v1/reaction`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messageId,
      reaction
    })
  })
}
export const generateChatTitle = async (newPrompt: string, chatId: string ) : Promise<string> =>{
  const response = await fetch(`${API_BASE}/api/v1/generate-title`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      newPrompt,
      chatId
    })
  })
  const data = await response.json();
  return data.newTitle
}
export const fetchStreamResponse = async (
  url: string, 
  body: any, 
  onData: (streamingResponse: any) => void,
  onDone: (finalData: any) => void
) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  console.log('Stream response status:', response.status);
  console.log('Stream response headers:', [...response.headers.entries()]);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error('Response body is null - streaming not supported');
  }

  const reader = response.body.getReader();
  let streamingResponse = '';
  const decoder = new TextDecoder();
  console.log('Starting to read stream...');

  let chunkCounter = 0;
  while (true) {
    const { value, done } = await reader.read();

    if (done) {
        console.log('Stream complete, total chunks:', chunkCounter);

      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    console.log(`Received chunk #${chunkCounter}:`, chunk);
    chunkCounter++;

    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      if (line.startsWith('data: ')) {
        try {
            
            const jsonStr = line.slice(6);
            console.log('Parsing JSON from chunk:', jsonStr);
            
            const data = JSON.parse(jsonStr);
            console.log('Parsed data object:', data);
          
          if (data.done) {
            onDone({
              userMsgId: data.userMsgId,
              assistantMsgId: data.assistantMsgId,
              streamingResponse
            });
          } else if (data.content) {
            streamingResponse += data.content;
            onData(streamingResponse);
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error, line);
        }
      }
    }
  }
};