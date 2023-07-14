// Types
export type APIResponse = {
  confirmation: 'success' | 'fail'
  data?: Record<string, unknown>
  message?: string
}

export type Env = Record<string, unknown> & {
  OPEN_API_KEY: string
  OPEN_API_URL: string
  CLOUDFLARE_REDIRECT_URL: string
}

// GPT Types
export type GPTOptions = {
  // doc reference:
  // https://platform.openai.com/docs/api-reference/completions/create
  maxTokens?: number
  temperature?: number // [-2,2] (default 0)
  topP?: number // alternative temperature (default 1)
  frequencyPenalty?: number // [-2,2] (default 0)
  presencePenalty?: number // [-2,2] (default 0)
  stream?: boolean
}
export enum GPTModel {
  GPT35_TURBO = 'gpt-3.5-turbo'
}

// Role
export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
}
export type GPTRequestMessage = {
  role: MessageRole
  content: string
}

// GPT request
export type GPTRequestData = {
  model: GPTModel
  messages: GPTRequestMessage[]
  max_tokens: number
  temperature: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  stream: boolean
}
export type GPTResponse = {
  success: boolean
  id: string
  object: string
  created: number
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  choices: GPTResponseChoice[]
}
export type GPTResponseMessage = {
  role: MessageRole
  content: string
}
export type GPTResponseChoice = {
  message: GPTResponseMessage
  finish_reason: string
  index: number
}
export type GPTError = {
  success: boolean
  message: string
  type: string
  param: unknown
  code: unknown
}

// Storage Types
export type MessageStorageType = {
  [key: string]: GPTResponseMessage[]
}

// Session
export type Session = {
  name: string
  id: string
}
export type SessionList = Session[]

// Assistant
export type Assistant = {
  id: string
  name: string
  description?: string
  prompt: string
  temperature?: number
  max_log: number
  max_tokens: number
}
export type AssistantList = Assistant[]
export type EditAssistant = Omit<Assistant, 'id'> &
  Partial<Pick<Assistant, 'id'>>
