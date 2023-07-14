import { Assistant } from './types'

export const MESSAGE_STORE = 'ai_assistant_message'
export const SESSION_STORE = 'ai_assistant_session'
export const ASSISTANT_STORE = 'ai_assistant_assistant'

export const ASSISTANT_INIT: Omit<Assistant, 'id'>[] = [
  {
    name: 'AI assistant',
    prompt:
      "You're a smart AI assistant, your job is provide detailed information to your clients",
    temperature: 0.7,
    max_log: 4,
    max_token: 800
  }
]
