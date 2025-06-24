// src/components/newPrompt/NewPrompt.tsx

import { useEffect, useRef, FormEvent } from 'react'
import './newPrompt.css'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useLocation } from 'react-router-dom'


interface ChatMessage {
  _id: string
  role: 'user' | 'assistant'
  content: string
}

const NewPrompt = ()=> {
  const path = useLocation().pathname
  const chatId = path.split('/').pop()

  if (!chatId) {
    return <div>Invalid chat ID</div>
  }

  const queryClient = useQueryClient()

  const endRef = useRef<HTMLDivElement>(null)


  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/prompt`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId, prompt }),
        }
      )
      return response.json()
    },
    
    onSuccess: (data, prompt) => {
      queryClient.setQueryData<ChatMessage[]>(['chat', chatId], (oldData = []) => {
        if (!oldData) return oldData
        return [
          ...oldData,
          {
            _id: data.userMsgData_id,
            role: 'user',
            content: prompt,
          },
          {
            _id: data.assistantMsgData_id,
            role: 'assistant',
            content: data.response,
          }
        ]
      })
    },
    onError: (err) => {
      console.error(err)
    }
  })

  // Trigger mutation if there is a pending message saved in session storage
  useEffect(() => {
    const pendingMessage = sessionStorage.getItem('pendingMessage')
    if (pendingMessage) {
      mutation.mutate(pendingMessage)
      sessionStorage.removeItem('pendingMessage')
    }
  }, [mutation])

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTextareaInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const textarea = form.submitInput as HTMLTextAreaElement
    const message = textarea.value.trim()
    if (!message) return

    mutation.mutate(message)
    textarea.value = ''
    textarea.style.height = 'auto'
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) {
        form.requestSubmit()
      }
    }
  }

  return (
    <>
      <div className='endChat' ref={endRef}></div>
      <div className='newPrompt'>
        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            name='submitInput'
            placeholder='Type a message...'
            rows={1}
            onInput={handleTextareaInput}
            onKeyDown={handleKeyDown}
          />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </>
  )
}

export default NewPrompt