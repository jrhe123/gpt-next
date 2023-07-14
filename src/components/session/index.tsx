import type { Session as SessionType, SessionList } from '@/utils/types'
import React, { FC, useState, useEffect } from 'react'
import { IconTrash, IconMessagePlus } from '@tabler/icons-react'
// local storage
import {
  getSessionStore,
  addSession,
  updateSession as updateSessionFunc,
  removeSession
} from '@/utils/getChatStorage'
//
import clsx from 'clsx'
import { useMantineColorScheme, ActionIcon } from '@mantine/core'
import { EditableText } from '../editableText'
import { getAssistantList } from '@/utils/getAssistantStorage'

const itemBaseClasses =
  'flex cursor-pointer h-[2.4rem] items-center justify-around group px-4 rounded-md'

const generateItemClasses = (
  id: string,
  sessionId: string,
  colorScheme: string
) => {
  return clsx([
    itemBaseClasses,
    {
      'hover:bg-gray-300/60': colorScheme === 'light',
      'bg-gray-200/60': id !== sessionId && colorScheme === 'light',
      'bg-gray-300': id === sessionId && colorScheme === 'light',
      'hover:bg-zinc-800/50': colorScheme === 'dark',
      'bg-zinc-800/20': id !== sessionId && colorScheme === 'dark',
      'bg-zinc-800/90': id === sessionId && colorScheme === 'dark'
    }
  ])
}

type SessionComponentProps = {
  sessionId: string
  onChange: (sessionId: string) => void
  className?: string
}
export const Session: FC<SessionComponentProps> = ({
  sessionId,
  className,
  onChange
}) => {
  const [sessionList, setSessionList] = useState<SessionList>([])
  const { colorScheme } = useMantineColorScheme()

  useEffect(() => {
    const list = getSessionStore()
    setSessionList(list)
  }, [])

  const createSession = () => {
    const assistantList = getAssistantList()
    const newSession: SessionType = {
      name: `session-${sessionList.length + 1}`,
      id: Date.now().toString(),
      assistant: assistantList[0].id
    }
    onChange(newSession.id)
    const updatedSessionList = addSession(newSession)
    setSessionList(updatedSessionList)
  }

  const deleteSession = (deleteSessionId: string) => {
    const updatedSessionList = removeSession(deleteSessionId)
    setSessionList(updatedSessionList)
    if (deleteSessionId === sessionId) {
      onChange(updatedSessionList[0].id)
    }
  }

  const updateSession = (name: string) => {
    let newSessionList = updateSessionFunc(sessionId, {
      name
    })
    setSessionList(newSessionList)
  }

  return (
    <div
      className={clsx(
        {
          'bg-black/10': colorScheme === 'dark',
          'bg-gray-100': colorScheme === 'light'
        },
        'h-screen',
        'w-64',
        'flex',
        'flex-col',
        'px-2',
        className
      )}
    >
      <div className="flex justify-between py-2 w-full">
        <ActionIcon
          onClick={() => {
            createSession()
          }}
          color="green"
          size="sm"
        >
          <IconMessagePlus size="1rem" />
        </ActionIcon>
      </div>

      <div
        className={clsx([
          'pb-4',
          'overflow-y-auto',
          'scrollbar-none',
          'flex',
          'flex-col',
          'gap-y-2'
        ])}
      >
        {sessionList.map((session) => (
          <div
            key={session.id}
            className={generateItemClasses(session.id, sessionId, colorScheme)}
            onClick={() => {
              onChange(session.id)
            }}
          >
            <EditableText
              text={session.name}
              onSave={(name: string) => updateSession(name)}
            ></EditableText>
            {sessionList.length > 1 ? (
              <IconTrash
                size=".8rem"
                color="gray"
                onClick={(evt) => {
                  evt.stopPropagation()
                  deleteSession(session.id)
                }}
                className="mx-1 invisible group-hover:visible"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
