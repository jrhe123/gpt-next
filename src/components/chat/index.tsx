import { useState } from 'react'
// libs
import { Textarea, Button } from '@mantine/core'
// utils
import { getCompletion } from '@/utils/getCompletion'

export const Chat = () => {
  const [prompt, setPrompt] = useState<string>('')
  const [completion, setCompletion] = useState<string>('')

  const getAiResponse = async () => {
    if (!prompt) return
    const response = await getCompletion({
      prompt
    })
    console.log('$$$$$$$$')
    console.log('$$$$$$$$')
    console.log('$$$$$$$$')
    console.log('response: ', response)
    if (response) {
      setCompletion(response.message.content)
    }
  }

  return (
    <div className="h-screen flex flex-col items-center">
      {/* completion */}
      <div>{completion}</div>
      {/* text input */}
      <div className="flex items-center w-3/5">
        <Textarea
          placeholder="Please enter your prompt.."
          className="w-full"
          value={prompt}
          onChange={(evt) => setPrompt(evt.target.value)}
        ></Textarea>
        <Button onClick={() => getAiResponse()}>Send</Button>
      </div>
    </div>
  )
}
