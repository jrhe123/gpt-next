import { SessionList } from '@/utils/types'
import React, { FC, useState, useEffect } from 'react'
import { IconTrash, IconMessagePlus } from '@tabler/icons-react'
// local storage
import {
  getSessionStore,
  addSession,
  removeSession
} from '@/utils/getChatStorage'
//
import clsx from 'clsx'
import { useMantineColorScheme, ActionIcon } from '@mantine/core'

type SessionComponentProps = {
  sessionId: string
  onChange: (sessionId: string) => void
}
export const Session: FC<SessionComponentProps> = ({ sessionId, onChange }) => {
  const [sessionList, setSessionList] = useState<SessionList>([])
  const { colorScheme } = useMantineColorScheme()

  useEffect(() => {
    const list = getSessionStore()
    setSessionList(list)
  }, [])

  const createSession = () => {
    const newSession = {
      name: `session-${sessionList.length + 1}`,
      id: Date.now().toString()
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
        'px-2'
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
          <div key={session.id}>
            <div>{session.name}</div>
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
