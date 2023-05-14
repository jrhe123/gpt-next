// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

// utils
import ChatModel from '@/utils/chatModel'
import {
  GPTOptions,
  GPTError,
  GPTModel,
  GPTRequestData,
  GPTResponse,
  MessageRole
} from '@/utils/types'
import { APIResponse, Env } from '@/utils/types'
// dto
import { chatFormSchema } from './dto/chatForm'

// Controller
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  if (req.method !== 'POST')
    return res
      .status(405)
      .json({ confirmation: 'fail', message: 'Method Not Allowed' })
  // zod validate
  const validated = chatFormSchema.safeParse(req.body)
  if (!validated.success) {
    const { errors } = validated.error
    console.log('errors: ', errors)
    return res.status(400).json({
      confirmation: 'fail',
      message: 'Invalid request: ' + errors.map((e) => e.message).join(' | ')
    })
  }
  // check request body data
  const { prompt, history = [], options = {} } = validated.data
  // NOTES: use cloudflare to detour the firewall (e.g., China, Italy, etc..)
  const isCountryRestrictGPT = true
  const env = process.env as unknown as Env
  const apiUrl = isCountryRestrictGPT
    ? env.CLOUDFLARE_REDIRECT_URL
    : env.OPEN_API_URL
  // init chat model
  const chatModel = ChatModel.getInstance(apiUrl, env.OPEN_API_KEY)
  // format request data
  const formattedOptions = options as GPTOptions
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
    max_tokens: formattedOptions.maxTokens || 7, // return content token limit
    temperature: formattedOptions.temperature || 0, // higher -> increase the random [Range 0-2]
    top_p: formattedOptions.topP || 1,
    frequency_penalty: formattedOptions.frequencyPenalty || 0,
    presence_penalty: formattedOptions.presencePenalty || 0,
    stream: formattedOptions.stream || false // server sent event
  }
  // call openAI now
  const response = await chatModel.requestOpenAI(requestData)
  if (!response.success) {
    return res.status(403).json({
      confirmation: 'fail',
      message: (response as GPTError).message
    })
  }
  return res.status(200).json({
    confirmation: 'success',
    data: {
      choices: (response as GPTResponse).choices
    }
  })
}
