import { MessageRole } from '@/utils/types'
// libs
import { z } from 'zod' // https://morioh.com/p/cc9d89e8a10b

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

export const chatFormSchema = z.object({
  prompt: z
    .string({
      required_error: 'prompt is required',
      invalid_type_error: 'prompt must be a string'
    })
    .min(1, 'prompt at least 1 characters'),
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
      topP: z
        .number({
          invalid_type_error: 'topP must be a number'
        })
        .positive('topP must be positive')
        .lte(2, 'topP must be in range of [0,2]')
        .optional(),
      frequencyPenalty: z
        .number({
          invalid_type_error: 'frequencyPenalty must be a number'
        })
        .gte(-2, 'frequencyPenalty must be in range of [-2,2]')
        .lte(2, 'frequencyPenalty must be in range of [-2,2]')
        .optional(),
      presencePenalty: z
        .number({
          invalid_type_error: 'presencePenalty must be a number'
        })
        .gte(-2, 'presencePenalty must be in range of [-2,2]')
        .lte(2, 'presencePenalty must be in range of [-2,2]')
        .optional(),
      stream: z
        .boolean({
          invalid_type_error: 'temperature must be a boolean'
        })
        .optional()
    })
    .optional()
})
