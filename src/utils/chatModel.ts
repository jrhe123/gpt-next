import { IModel } from './interfaces'
import type { GPTError, GPTRequestData, GPTResponse } from './types'
//
import {
  createParser,
  ParsedEvent,
  ReconnectInterval
} from 'eventsource-parser'

class ChatModel implements IModel<GPTRequestData, GPTResponse, GPTError> {
  private static _instance: ChatModel
  private _url: string
  private _apiKey: string

  private constructor(url: string, apiKey: string) {
    this._url = url
    this._apiKey = apiKey
  }

  static getInstance(url: string, apiKey: string): ChatModel {
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

  public async requestOpenAIStream(data: GPTRequestData) {
    try {
      const response = await fetch(`${this._url}/v1/chat/completions`, {
        headers: {
          Authorization: `Bearer ${this._apiKey}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      if (response.status !== 200) {
        return response.body
      }
      const decoder = new TextDecoder('utf-8')
      const encoder = new TextEncoder()
      let counter = 0
      return new ReadableStream({
        async start(controller) {
          const onParse = (event: ParsedEvent | ReconnectInterval) => {
            if (event.type === 'event') {
              const data = event.data
              if (data === '[DONE]') {
                // openAI stream end with [DONE]
                controller.close()
                return
              }
              try {
                const json = JSON.parse(data)
                if (!json.choices) {
                  throw new Error('No choices available')
                }
                const text = json.choices[0]?.delta?.content || ''
                // gpt return dummy "new line" for the first two line
                // we skipped them
                if (counter < 2 && (text.match(/\n/) || []).length) {
                  return
                }
                console.log('[chatModel.ts] text: ', text)

                // convert back to stream
                const q = encoder.encode(text)
                // save it back to controller
                controller.enqueue(q)
                // next line
                counter++
              } catch (error) {
                console.log('[chatModel.ts] error: ', error)
                return
              }
            }
          }
          const parser = createParser(onParse)

          for await (const chunk of response.body as any) {
            // binary stream -> string
            /**
             * sample data
                {
                  "id":"chatcmpl-7ILwarkloB0DvEHLwXaUfb1UXcRLH",
                  "object":"chat.completion.chunk",
                  "created":1684608612,
                  "model":"gpt-3.5-turbo-0301",
                  "choices":[
                      {
                        "delta":{
                            "content":" you" <- you need !!!
                        },
                        "index":0,
                        "finish_reason":null
                      }
                  ]
                }
             */
            const data = decoder.decode(chunk)
            // use parse chunk data
            parser.feed(data)
          }
        }
      })
    } catch (error) {
      console.log('[chatModel.ts] error: ', error)
      return
    }
  }
}

export default ChatModel
