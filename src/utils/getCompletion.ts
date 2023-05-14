import {
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
export const getCompletion = async (
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
