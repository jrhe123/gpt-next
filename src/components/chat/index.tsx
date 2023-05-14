import { useEffect, useState, KeyboardEvent } from 'react'
// libs
import { Textarea, ActionIcon } from '@mantine/core'
import { IconSend, IconEraser } from '@tabler/icons-react'
import clsx from 'clsx'
// utils
import { getCompletion } from '@/utils/getCompletion'
import { GPTResponseMessage, MessageRole } from '@/utils/types'
// storage
import { setChatLog, getChatLogs, cleanChatLogs } from '@/utils/getChatStorage'

const LOCAL_CHANNEL_KEY = 'demo-channel'

export const Chat = () => {
  const [prompt, setPrompt] = useState<string>('')
  // const [completion, setCompletion] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [chatList, setChatList] = useState<GPTResponseMessage[]>([])

  useEffect(() => {
    setChatList(getChatLogs(LOCAL_CHANNEL_KEY))
  }, [])

  const handleSendMessage = async () => {
    if (!prompt) return
    setIsLoading(true)
    const userChatLog = {
      role: MessageRole.USER,
      content: prompt
    }
    const list = [...chatList, userChatLog]
    setChatList(list)
    setChatLog(LOCAL_CHANNEL_KEY, userChatLog)
    const response = await getCompletion({
      prompt
    })
    if (response) {
      // setCompletion(response.message.content)
      const assistantChatLog = {
        role: MessageRole.ASSISTANT,
        content: response.message.content
      }
      setChatList([...list, assistantChatLog])
      setChatLog(LOCAL_CHANNEL_KEY, assistantChatLog)
    } else {
      const assistantChatLog = {
        role: MessageRole.ASSISTANT,
        content: 'no result..'
      }
      setChatList([...list, assistantChatLog])
      setChatLog(LOCAL_CHANNEL_KEY, assistantChatLog)
    }
    setPrompt('')
    setIsLoading(false)
  }

  const handleClearChatLogs = () => {
    setChatList([])
    cleanChatLogs(LOCAL_CHANNEL_KEY)
  }

  const handleKeyDownTextArea = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key === 'Enter' && !evt.shiftKey) {
      evt.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen flex flex-col items-center">
      {/* chat logs */}
      <div
        className={clsx(
          'flex-col',
          'h-[calc(100vh-10rem)]',
          'overflow-y-auto',
          'rounded-sm',
          'w-full',
          'px-8'
        )}
      >
        {chatList.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={clsx(
              {
                flex: item.role === MessageRole.USER,
                'flex-col': item.role === MessageRole.USER,
                'items-end': item.role === MessageRole.USER
              },
              'mt-4'
            )}
          >
            <div>{item.role}</div>
            <div
              className={clsx(
                'rounded-md',
                'shadow-md',
                'px-4',
                'py-2',
                'mt-1',
                'w-full',
                'max-w-4xl'
              )}
            >
              {item.content}
            </div>
          </div>
        ))}
      </div>
      {/* bottom */}
      <div className="flex items-center w-3/5">
        {/* actions */}
        <ActionIcon
          disabled={isLoading}
          className="mr-2"
          onClick={() => handleClearChatLogs()}
        >
          <IconEraser />
        </ActionIcon>
        {/* input */}
        <Textarea
          placeholder="Please enter your prompt.."
          className="w-full"
          value={prompt}
          disabled={isLoading}
          onChange={(evt) => setPrompt(evt.target.value)}
          onKeyDown={(evt) => handleKeyDownTextArea(evt)}
        ></Textarea>
        <ActionIcon
          loading={isLoading}
          className="ml-2"
          onClick={() => handleSendMessage()}
        >
          <IconSend />
        </ActionIcon>
      </div>
    </div>
  )
}
