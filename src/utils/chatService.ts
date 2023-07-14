import type {
  APIResponse,
  GPTOptions,
  GPTRequestMessage,
  GPTResponseChoice
} from './types'

type ParamProps = {
  prompt: string
  history?: GPTRequestMessage[]
  options?: GPTOptions
}

type Actions = {
  onCompleting: (data: string) => void
  onCompleted?: (data: string) => void
}

class ChatService {
  private static _instance: ChatService
  public actions?: Actions
  // stop the stream generation
  private _controller: AbortController

  private constructor() {
    this._controller = new AbortController()
  }

  static getInstance(): ChatService {
    if (!this._instance) {
      this._instance = new ChatService()
    }
    return this._instance
  }

  public cancel() {
    // abort the stream generation
    this._controller.abort()
  }

  // edge api stream
  getCompletionStream = async (params: ParamProps) => {
    let result = ''
    try {
      params.options = {
        ...params.options,
        stream: true
      }
      const response = await fetch('/api/chat', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(params),
        signal: this._controller.signal
      })
      const data: ReadableStream<Uint8Array> | null = response.body
      if (!data) return result

      const reader = data.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false
      while (!done) {
        const { value, done: doneReadingStream } = await reader.read()
        done = doneReadingStream
        const chunkValue = decoder.decode(value)
        result += chunkValue

        console.log('[chatService.ts] onCompleting: ', result)

        // on completing
        this.actions?.onCompleting(result)

        // sleep 0.1 sec, for while loop performance
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.log('[chatService.ts] error: ', error)
    } finally {
      console.log('stream call is completed / aborted')
      if (this.actions?.onCompleted) {
        console.log('[chatService.ts] onCompleted: ', result)

        this.actions.onCompleted(result)
      }
      // since it's singletone class
      // we need to create new abortController at the end of stream call
      this._controller = new AbortController()
    }
  }

  // api json
  getCompletion = async (
    params: ParamProps
  ): Promise<GPTResponseChoice | null> => {
    const response = await fetch('/api/chat', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(params)
    })
    if (!response.ok) {
      // status code: 400 / 403 / 405
      throw new Error(response.statusText)
    }
    const apiResponse = (await response.json()) as APIResponse
    if (apiResponse.confirmation !== 'success') {
      // status code: 200
      throw new Error(apiResponse.message)
    }
    const data = apiResponse.data as {
      choices: GPTResponseChoice[]
    }
    return data.choices.length ? data.choices[0] : null
  }
}

const chatService = ChatService.getInstance()
export default chatService
