import React, { useState, useEffect } from 'react'

import { Session } from '../session'
import { Message } from '../message'

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
      <Session sessionId={sessionId} onChange={setSessionId} />
      <Message sessionId={sessionId} />
    </div>
  )
}
