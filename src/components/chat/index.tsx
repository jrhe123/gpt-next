import React, { useState, useEffect } from 'react'

import { Session } from '../session'
import { Message } from '../message'

//
import { MediaQuery } from '@mantine/core'

// local storage
import { getSessionStore } from '@/utils/getChatStorage'

export const Chat = () => {
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    const init = () => {
      const list = getSessionStore()
      const id = list[0].id
      setSessionId(id)
    }
    init()
  }, [])

  return (
    <div className="h-screen flex w-screen">
      <MediaQuery
        smallerThan="md"
        styles={{
          width: '0 !important',
          padding: '0 !important',
          overflow: 'hidden'
        }}
      >
        <Session sessionId={sessionId} onChange={setSessionId}></Session>
      </MediaQuery>
      <Message sessionId={sessionId} />
    </div>
  )
}
