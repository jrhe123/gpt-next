import { GPTResponseMessage, MessageStorageType } from './types'
// custom LocalStorage class
import LocalStorage from './storage'

const CHAT_LOGS_KEY = 'ai_chat_logs'

/**
 * MessageStorageType
 *
 * {
 *    chinese: GPTResponseMessage[]
 *    japanese: GPTResponseMessage[]
 *    python: GPTResponseMessage[]
 * }
 *
 */

export const getChatLogsContainer = (): MessageStorageType => {
  const localStorage = LocalStorage.getInstance()
  let hash = localStorage.getItem<MessageStorageType>(CHAT_LOGS_KEY)
  if (!hash) {
    hash = {}
    localStorage.setItem(CHAT_LOGS_KEY, hash)
  }
  return hash
}

export const getChatLogs = (id: string): GPTResponseMessage[] => {
  const logs = getChatLogsContainer()
  return logs[id] || []
}

export const setChatLog = (id: string, log: GPTResponseMessage): void => {
  const logs = getChatLogsContainer()
  if (!logs[id]) logs[id] = []
  logs[id].push(log)
  // save
  const localStorage = LocalStorage.getInstance()
  localStorage.setItem(CHAT_LOGS_KEY, logs)
}

export const cleanChatLogs = (id: string): void => {
  const logs = getChatLogsContainer()
  if (logs[id]) {
    logs[id] = []
    // save
    const localStorage = LocalStorage.getInstance()
    localStorage.setItem(CHAT_LOGS_KEY, logs)
  }
}
