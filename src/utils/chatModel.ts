import { IModel } from './interfaces'
//
import { GPTError, GPTRequestData, GPTResponse } from './types'

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
