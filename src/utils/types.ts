// Types
export type APIResponse = {
  confirmation: 'success' | 'fail'
  data?: Record<string, unknown>
  message?: string
}

export type Env = Record<string, unknown> & {
  OPEN_API_KEY: string
  OPEN_API_URL: string
  CLOUDFLARE_REDIRECT_URL: string
}
