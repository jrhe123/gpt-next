import { useEffect, useState, KeyboardEvent, FC } from 'react'
// libs
import { Textarea, ActionIcon } from '@mantine/core'
import { IconSend, IconEraser, IconSendOff } from '@tabler/icons-react'
import clsx from 'clsx'
// utils
import chatService from '@/utils/chatService'
import { GPTResponseMessage, MessageRole } from '@/utils/types'
// local storage
import { updateMessage, getMessage, clearMessage } from '@/utils/getChatStorage'

type MessageComponentProps = {
  sessionId: string
}
export const Message: FC<MessageComponentProps> = ({ sessionId }) => {
  const [prompt, setPrompt] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [messageList, setMessageList] = useState<GPTResponseMessage[]>([])

  useEffect(() => {
    // fetch history from local storage & setState
    setMessageList(getMessage(sessionId))
    // if sessionId is changed, while loading
    // we need to abort the chatService
    if (isLoading) {
      handleStopMessageGeneration()
    }
  }, [sessionId, isLoading])

  /**
   *
   * keep calling while "onCompleting"
   * we keep updating state here
   *
   * @param data
   * @returns
   */
  const setSuggestion = (data: string) => {
    if (data === '') return
    const length = messageList.length
    const lastMessage = length ? messageList[length - 1] : null
    let newList: GPTResponseMessage[] = []
    let assistantChatLog
    if (lastMessage?.role === MessageRole.ASSISTANT) {
      assistantChatLog = {
        ...lastMessage,
        content: data
      }
      newList = [...messageList.slice(0, length - 1), assistantChatLog]
    } else {
      assistantChatLog = {
        role: MessageRole.ASSISTANT,
        content: data
      }
      newList = [...messageList, assistantChatLog]
    }
    // update state
    setMessageList(newList)
  }

  chatService.actions = {
    onCompleting: (result) => setSuggestion(result),
    onCompleted: (result) => {
      setIsLoading(false)
      // only save non-empty response
      if (result) {
        const assistantChatLog = {
          role: MessageRole.ASSISTANT,
          content: result
        }
        // save assistance answer when stream completed
        updateMessage(sessionId, assistantChatLog)
      }
    }
  }

  /**
   * stream version
   */
  const handleSendMessage = async () => {
    if (!prompt.trim()) return
    // before
    setIsLoading(true)
    const userChatLog = {
      role: MessageRole.USER,
      content: prompt
    }
    const list = [...messageList, userChatLog]
    // update state
    setMessageList(list)
    // save user question on submit
    updateMessage(sessionId, userChatLog)
    // call stream now
    chatService.getCompletionStream({
      prompt,
      history: messageList.slice(-4) // reduce the token usage
    })
    // after
    setPrompt('')
  }

  /**
   *
   * stop the stream generation
   *
   */
  const handleStopMessageGeneration = () => {
    chatService.cancel()
  }

  /**
   * json version
   */
  // const handleSendMessage = async () => {
  //   if (!prompt) return
  //   // before
  //   setIsLoading(true)
  //   const userChatLog = {
  //     role: MessageRole.USER,
  //     content: prompt
  //   }
  //   const list = [...messageList, userChatLog]
  //   setMessageList(list)
  //   updateMessage(sessionId, userChatLog)
  //   // call api now
  //   const response = await chatService.getCompletion({
  //     prompt,
  //     history: messageList.slice(-4) // reduce the token usage
  //   })
  //   // response
  //   if (response) {
  //     const assistantChatLog = {
  //       role: MessageRole.ASSISTANT,
  //       content: response.message.content
  //     }
  //     setMessageList([...list, assistantChatLog])
  //     updateMessage(sessionId, assistantChatLog)
  //   } else {
  //     const assistantChatLog = {
  //       role: MessageRole.ASSISTANT,
  //       content: 'no result..'
  //     }
  //     setMessageList([...list, assistantChatLog])
  //     updateMessage(sessionId, assistantChatLog)
  //   }
  //   // after
  //   setPrompt('')
  //   setIsLoading(false)
  // }

  const handleClearChatLogs = () => {
    setMessageList([])
    // clean local storage
    clearMessage(sessionId)
  }

  const handleKeyDownTextArea = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key === 'Enter' && !evt.shiftKey) {
      evt.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen flex flex-col items-center w-full">
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
        {messageList.map((item, index) => (
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
        {/* buttons */}
        {isLoading ? (
          <ActionIcon
            className="ml-2"
            onClick={() => handleStopMessageGeneration()}
          >
            <IconSendOff />
          </ActionIcon>
        ) : (
          <ActionIcon
            loading={isLoading}
            className="ml-2"
            onClick={() => handleSendMessage()}
          >
            <IconSend />
          </ActionIcon>
        )}
      </div>
    </div>
  )
}