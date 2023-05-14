import { IModel } from './interfaces'

// GPT Types
export enum GPTModel {
  GPT35_TURBO = 'gpt-3.5-turbo'
}
export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant'
}
export type GPTRequestMessage = {
  role: MessageRole
  content: string
}
export type GPTRequestData = {
  model: GPTModel
  messages: GPTRequestMessage[]
  max_tokens: number
  temperature: number
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
  choices: {
    message: Object[]
    finish_reason: string
    index: number
  }[]
}
export type GPTError = {
  success: boolean
  message: string
  type: string
  param: unknown
  code: unknown
}

class ChatModel implements IModel<GPTRequestData, GPTResponse, GPTError> {
  private static _instance: ChatModel
  private _url: string
  private _apiKey: string

  private constructor(url: string, apiKey: string) {
    this._url = url
    this._apiKey = apiKey
  }

  static getInstance(url: string, apiKey: string) {
    if (!this._instance) {
      this._instance = new ChatModel(url, apiKey)
    }
    return this._instance
  }

  public async requestOpenAI(
    data: GPTRequestData
  ): Promise<GPTResponse | Partial<GPTError>> {
    try {
      const response = await fetch(`${this._url}/v1/chat/completions`, {
        headers: {
          Authorization: `Bearer ${this._apiKey}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      const json = await response.json()
      // GPT error
      if (json.error) {
        const error: GPTError = json.error
        return {
          success: false,
          message: error.message,
          type: error.type,
          param: error.param,
          code: error.code
        }
      }
      return {
        ...json,
        success: true
      }
    } catch {
      return {
        success: false,
        message: 'API error'
      }
    }
  }
}

export default ChatModel
