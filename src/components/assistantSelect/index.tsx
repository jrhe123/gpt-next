import React, { useEffect, useState } from 'react'
import { Select } from '@mantine/core'
import { Assistant, AssistantList } from '@/utils/types'
import { getAssistantList } from '@/utils/getAssistantStorage'

type Props = {
  value: string
  loading?: boolean
  onChange: (value: Assistant) => void
}

export const AssistantSelect = ({
  value,
  loading = false,
  onChange
}: Props) => {
  const [list, setList] = useState<AssistantList>([])

  useEffect(() => {
    const assistantList = getAssistantList()
    setList(assistantList)
  }, [])

  const onAssistantChange = (value: string) => {
    const assistant = list.find((item: Assistant) => item.id === value)
    onChange(assistant!)
  }

  return (
    <Select
      size="sm"
      onChange={onAssistantChange}
      value={value}
      className="w-32 mx-2"
      disabled={loading}
      data={list.map((item: Assistant) => ({
        value: item.id,
        label: item.name
      }))}
    ></Select>
  )
}
