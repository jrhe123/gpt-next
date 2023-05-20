// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextRequest } from 'next/server'

// utils
import ChatModel from '@/utils/chatModel'
import {
  type GPTOptions,
  type GPTError,
  type GPTRequestData,
  type GPTResponse,
  GPTModel,
  MessageRole
} from '@/utils/types'
import type { APIResponse, Env } from '@/utils/types'
// dto
import { chatFormSchema } from './dto/chatForm'
// NOTES: use cloudflare to detour the firewall (e.g., China, Italy, etc..)
const IS_COUNTRY_RESTRICT_GPT = true

/**
 * api json version
 */
// Controller
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<APIResponse>
// ) {
//   // method validate
//   if (req.method !== 'POST')
//     return res
//       .status(405)
//       .json({ confirmation: 'fail', message: 'Method Not Allowed' })
//   // zod validate
//   const validated = chatFormSchema.safeParse(req.body)
//   if (!validated.success) {
//     const { errors } = validated.error
//     console.log('errors: ', errors)
//     return res.status(400).json({
//       confirmation: 'fail',
//       message: 'Invalid request: ' + errors.map((e) => e.message).join(' | ')
//     })
//   }
//   // check request body data
//   const { prompt, history = [], options = {} } = validated.data
//   const env = process.env as unknown as Env
//   const apiUrl = IS_COUNTRY_RESTRICT_GPT
//     ? env.CLOUDFLARE_REDIRECT_URL
//     : env.OPEN_API_URL
//   // init chat model
//   const chatModel = ChatModel.getInstance(apiUrl, env.OPEN_API_KEY)
//   // format request data
//   const requestData = formatRequestData(prompt, history, options as GPTOptions)
//   // call openAI now
//   const response = await chatModel.requestOpenAI(requestData)
//   // response
//   if (!response.success) {
//     return res.status(403).json({
//       confirmation: 'fail',
//       message: (response as GPTError).message
//     })
//   }
//   return res.status(200).json({
//     confirmation: 'success',
//     data: {
//       choices: (response as GPTResponse).choices
//     }
//   })
// }

/**
 * stream version
 * enable ReadableStream as return
 */
export default async function handler(req: NextRequest) {
  // check request body data
  const { prompt, history = [], options = {} } = await req.json()
  const env = process.env as unknown as Env
  const apiUrl = IS_COUNTRY_RESTRICT_GPT
    ? env.CLOUDFLARE_REDIRECT_URL
    : env.OPEN_API_URL
  // init chat model
  const chatModel = ChatModel.getInstance(apiUrl, env.OPEN_API_KEY)
  // format request data
  const formattedOptions = options as GPTOptions
  const requestData = formatRequestData(prompt, history, formattedOptions)
  // call openAI now
  const stream = await chatModel.requestOpenAIStream(requestData)
  // response
  return new Response(stream)
}

const formatRequestData = (
  prompt: string,
  history: {
    role: MessageRole
    content: string
  }[],
  options: GPTOptions
) => {
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
    max_tokens: options.maxTokens || 30, // return content token limit
    temperature: options.temperature || 0, // higher -> increase the random [Range 0-2]
    top_p: options.topP || 1,
    frequency_penalty: options.frequencyPenalty || 0,
    presence_penalty: options.presencePenalty || 0,
    stream: options.stream || false // server sent event
  }
  return requestData
}

export const config = {
  runtime: 'edge'
}
