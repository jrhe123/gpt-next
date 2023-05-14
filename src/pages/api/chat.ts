// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

// utils
import ChatModel, {
  GPTError,
  GPTModel,
  GPTRequestData,
  GPTResponse,
  MessageRole
} from '@/utils/chatModel'
import { APIResponse, Env } from '@/utils/types'

// Controller
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  // check request body data
  const { prompt, history = [], options = {} } = req.body
  // NOTES: use cloudflare to detour the firewall (e.g., China, Italy, etc..)
  const isCountryRestrictGPT = true
  const env = process.env as unknown as Env
  const apiUrl = isCountryRestrictGPT
    ? env.CLOUDFLARE_REDIRECT_URL
    : env.OPEN_API_URL
  // init chat model
  const chatModel = ChatModel.getInstance(apiUrl, env.OPEN_API_KEY)
  // format request data
  const requestData: GPTRequestData = {
    model: GPTModel.GPT35_TURBO,
    messages: [
      {
        role: MessageRole.SYSTEM,
        content: 'you are ai assistant'
      },
      ...history,
      {
        role: MessageRole.USER,
        content: prompt
      }
    ],
    max_tokens: options.maxTokens || 7, // return content token limit
    temperature: options.temperature || 0, // higher -> increase the random [Range 0-2]
    stream: options.stream || false // server sent event
  }
  // call openAI now
  const response = await chatModel.requestOpenAI(requestData)
  if (!response.success) {
    return res.json({
      confirmation: 'fail',
      message: (response as GPTError).message
    })
  }
  return res.json({
    confirmation: 'success',
    data: {
      choices: (response as GPTResponse).choices
    }
  })
}
