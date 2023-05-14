// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

// libs
import { z } from 'zod' // https://morioh.com/p/cc9d89e8a10b

// utils
import ChatModel, {
  GPTError,
  GPTModel,
  GPTRequestData,
  GPTResponse,
  MessageRole
} from '@/utils/chatModel'
import { APIResponse, Env } from '@/utils/types'

// Validate form
const zRoleEnum = z.nativeEnum(MessageRole, {
  errorMap: (issue, ctx) => {
    return { message: 'please select message role [system,user,assistant]' }
  }
})
const zGPTRequestMessage = z.object({
  role: zRoleEnum,
  content: z.string({
    required_error: 'content is required',
    invalid_type_error: 'content must be a string'
  })
})
const schema = z.object({
  prompt: z
    .string({
      required_error: 'prompt is required',
      invalid_type_error: 'prompt must be a string'
    })
    .min(10, 'prompt at least 10 characters'),
  history: z.array(zGPTRequestMessage).optional(),
  options: z
    .object({
      maxTokens: z
        .number({
          invalid_type_error: 'maxTokens must be a number'
        })
        .positive('maxTokens must be positive')
        .int('maxTokens must be a integer')
        .lte(100, 'maxTokens must not greater than 100')
        .optional(),
      temperature: z
        .number({
          invalid_type_error: 'temperature must be a number'
        })
        .positive('temperature must be positive')
        .lte(2, 'temperature must be in range of [0,2]')
        .optional(),
      stream: z
        .boolean({
          invalid_type_error: 'temperature must be a boolean'
        })
        .optional()
    })
    .optional()
})

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
  const validated = schema.safeParse(req.body)
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
