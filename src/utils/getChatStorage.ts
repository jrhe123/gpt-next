import type {
  GPTResponseMessage,
  MessageStorageType,
  Session,
  SessionList
} from './types'

// custom LocalStorage class
import LocalStorage from './storage'
import { MESSAGE_STORE, SESSION_STORE } from './constant'

/**
 * MessageStorageType
 * {
 *    chinese: GPTResponseMessage[]
 *    japanese: GPTResponseMessage[]
 *    python: GPTResponseMessage[]
 * }
 */
export const getMessage = (id: string): GPTResponseMessage[] => {
  const logs = getMessageStore()
  return logs[id] || []
}

export const getMessageStore = (): MessageStorageType => {
  const localStorage = LocalStorage.getInstance()
  let hash = localStorage.getItem<MessageStorageType>(MESSAGE_STORE)
  if (!hash) {
    hash = {}
    localStorage.setItem(MESSAGE_STORE, hash)
  }
  return hash
}

export const updateMessage = (id: string, log?: GPTResponseMessage): void => {
  const logs = getMessageStore()
  if (!logs[id]) logs[id] = []
  if (log) logs[id].push(log)
  // save
  const localStorage = LocalStorage.getInstance()
  localStorage.setItem(MESSAGE_STORE, logs)
}

export const clearMessage = (id: string): void => {
  const logs = getMessageStore()
  if (logs[id]) {
    logs[id] = []
    // save
    const localStorage = LocalStorage.getInstance()
    localStorage.setItem(MESSAGE_STORE, logs)
  }
}

/**
 * Session
 */
export const getSessionStore = (): SessionList => {
  const localStorage = LocalStorage.getInstance()
  let list = localStorage.getItem<SessionList>(SESSION_STORE)
  if (!list || !list.length) {
    // if there's no session
    const session: Session = {
      name: 'chat',
      id: Date.now().toString()
    }
    list = [session]
    localStorage.setItem(SESSION_STORE, list)
    // add default message (empty message list []) with session id
    updateMessage(session.id)
  }
  return list
}

export const updateSessionStore = (list: SessionList) => {
  const localStorage = LocalStorage.getInstance()
  localStorage.setItem(SESSION_STORE, list)
}

export const addSession = (session: Session): SessionList => {
  const list = getSessionStore()
  list.push(session)
  updateSessionStore(list)
  return list
}

export const getSession = (id: string) => {
  const list = getSessionStore()
  return list.find((session) => session.id === id) || {}
}

export const updateSession = (
  id: string,
  data: Partial<Omit<Session, 'id'>>
): SessionList => {
  const list = getSessionStore()
  const index = list.findIndex((session) => session.id === id)
  if (index !== -1) {
    // update
    const session = list[index]
    list[index] = {
      ...session,
      ...data
    }
    updateSessionStore(list)
  }
  return list
}

export const removeSession = (id: string): SessionList => {
  const list = getSessionStore()
  const updatedList = list.filter((session) => session.id !== id)
  updateSessionStore(updatedList)
  return updatedList
}
