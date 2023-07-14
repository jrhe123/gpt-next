import type { Assistant, AssistantList } from './types'

// custom LocalStorage class
import LocalStorage from './storage'
import { ASSISTANT_STORE, ASSISTANT_INIT } from './constant'

export const getAssistantStore = (): AssistantList => {
  const localStorage = LocalStorage.getInstance()
  let list = localStorage.getItem<AssistantList>(ASSISTANT_STORE)
  if (!list) {
    list = ASSISTANT_INIT.map((item, index) => {
      return {
        ...item,
        id: index + Date.now().toString()
      }
    })
    localStorage.setItem(ASSISTANT_STORE, list)
  }
  return list
}

export const getAssistantList = (): AssistantList => {
  const list = getAssistantStore()
  return list || []
}

export const addAssistant = (assistant: Assistant): AssistantList => {
  const list = getAssistantList()
  list.push(assistant)
  //
  const localStorage = LocalStorage.getInstance()
  localStorage.setItem(ASSISTANT_STORE, list)
  return list
}

export const updateAssistant = (
  id: string,
  data: Partial<Omit<Assistant, 'id'>>
): AssistantList => {
  const list = getAssistantList()
  const index = list.findIndex((item) => item.id === id)
  if (index !== -1) {
    list[index] = {
      ...list[index],
      ...data
    }
    const localStorage = LocalStorage.getInstance()
    localStorage.setItem(ASSISTANT_STORE, list)
  }
  return list
}

export const removeAssistant = (id: string): AssistantList => {
  const list = getAssistantList()
  const updatedList = list.filter((item) => item.id !== id)
  //
  const localStorage = LocalStorage.getInstance()
  localStorage.setItem(ASSISTANT_STORE, list)
  return updatedList
}

export const getAssistant = (id: string): Assistant | null => {
  const list = getAssistantList()
  return list.find((item) => item.id === id) || null
}
