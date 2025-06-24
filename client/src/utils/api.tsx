// src/utils/api.tsx

import supabase from './supabase';
import axios from 'axios';


export const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : `http://${window.location.hostname}:3000`);

    // src/services/keepAliveService.ts

class KeepAliveService {
  private interval: NodeJS.Timeout | null = null;
  private timeInterval = 10 * 60 * 1000; // 10 minutes

  start(): void {
    if (this.interval) return; // Already running

    console.log("Keep-alive service started", '\n Interval:', this.timeInterval/1000/60, 'minutes');
    
    this.interval = setInterval(() => {
      fetch(`${API_BASE}/api/v1/alive`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text(); 
        })
        .then(data => {
          console.log("Alive check success:", data);
        })
        .catch(error => {
          console.error("Alive check failed:", error);
        });
    }, this.timeInterval); // 10 minutes
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('Keep-alive service stopped');
    }
  }
}

// Export singleton instance
export const keepAliveService = new KeepAliveService();

export const updateMessageReaction = async (chatId: string, messageId: string, reaction: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }
  return fetch(`${API_BASE}/api/v1/reaction`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${session.access_token}`, // Add the JWT token
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chatId,
      messageId,
      reaction
    })
  })
}

export const generateChatTitle = async ( chatId: string ) : Promise<string> =>{
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }
  const response = await fetch(`${API_BASE}/api/v1/generate-title`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${session.access_token}`, // Add the JWT token
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
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

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${session.access_token}`, // Add the JWT token
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

export const getProjects = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }
  const response = await fetch(`${API_BASE}/api/v1/projects`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${session.access_token}`, // Add the JWT token
      'Content-Type': 'application/json',

    },
  })
  const projects = await response.json()
  console.log("projects")
  console.log(projects)
  return projects
}

// v1/projects-files?project_id=${projectId}
export const getProjectFiles = async (projectId: string) => {
  console.log('getProjectFiles', projectId)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }
  const res = await fetch(`${API_BASE}/api/v1/project-files?project_id=${projectId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${session.access_token}`, // Add the JWT token
      'Content-Type': 'application/json',

    },
  })
  // console.log(res.ok)
  if (!res.ok){
    throw new Error(`${API_BASE}/api/v1/project-files?project_id=${projectId}: ${res.status}`);
  }
  // return await response.json()
  const files = await res.json()
  console.log("files")
  console.log(files)
  return files 
}
export const getProjectFile = async (fileId: string) => {
  console.log('getProjectFile', fileId)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }
  const url = `${API_BASE}/api/v1/project-files?file_id=${fileId}`
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${session.access_token}`, // Add the JWT token
      'Content-Type': 'application/json',

    },
  })
  // console.log(res.ok)
  if (!res.ok){
    throw new Error(`${url}: ${res.status}`);
  }
  // return await response.json()
  const file = await res.json()
  console.log("file")
  console.log(file)
  return file
}

export const createNewProject = async (name: string) => {
  console.log('createNewProject', name)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }
  const url = `${API_BASE}/api/v1/project`
    try {
    const response = await axios.post(
      url,
      { name },
      {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )

    return response.data // this is the parsed JSON
  } catch (error) {
    console.error('Error creating project:', error)
    throw error // rethrow if you want calling code to handle it
  }

}
// Add this function to your utils/api.ts file

export const getProjectChats = async (project_id: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }
  
  const endpoint = `${API_BASE}/api/v1/chats`
  const params = {project_id}
  const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      }
  try{
    const res = await axios.get(endpoint, { params, headers })
    return res.data
  } catch(error){
        console.error('Error fetching chats:', error);
    throw error;
  }
};

// create  a new chat in a project
export const createNewChat = async (project_id: string, title: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }  
  const endpoint = '/api/v1/chat'
  const url = API_BASE+endpoint
  const body = { project_id, title }
  const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      }
  const res = await axios.post(url, body, { headers })
  return res.data
  
}