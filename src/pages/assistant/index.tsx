import { AssistantList, Assistant, EditAssistant } from '@/utils/types'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

import { NextPage } from 'next'
import Link from 'next/link'

import { ActionIcon, Card, Text, Group, Drawer, Badge } from '@mantine/core'
import { IconChevronLeft, IconUserPlus, IconPencil } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { ASSISTANT_INIT } from '../../utils/constant'

// local storage
import {
  getAssistantList,
  addAssistant,
  updateAssistant,
  removeAssistant
} from '@/utils/getAssistantStorage'
import { AssistantConfig } from '@/components/assistantConfig'

const showNotification = (message: string) => {
  notifications.show({
    id: 'Success',
    title: 'Success',
    message,
    color: 'green',
    autoClose: 3000
  })
}

const AssistantPage: NextPage = () => {
  const [assistantList, setAssistantList] = useState<AssistantList>([])
  const [opened, drawerHandler] = useDisclosure(false)
  const [editAssistant, setEditAssistant] = useState<EditAssistant>()

  useEffect(() => {
    const list = getAssistantList()
    setAssistantList(list)
  }, [])

  const saveAssistant = (data: EditAssistant) => {
    if (data.id) {
      let newAssistantList = updateAssistant(data.id, data)
      setAssistantList(newAssistantList)
    } else {
      const newAssistant = {
        ...data,
        id: Date.now().toString()
      }
      let newAssistantList = addAssistant(newAssistant)
      setAssistantList(newAssistantList)
    }
    // notification
    showNotification('Success, assistant has been created')
    // close the drawer
    drawerHandler.close()
  }

  const deleteAssistant = (id: string) => {
    const newAssistantList = removeAssistant(id)
    setAssistantList(newAssistantList)
    // notification
    showNotification('Success, assistant has been deleted')
    // close the drawer
    drawerHandler.close()
  }

  const onEditAssistant = (data: EditAssistant) => {
    setEditAssistant(data)
    drawerHandler.open()
  }

  const onAddAssistant = () => {
    const newAssistant = {
      ...ASSISTANT_INIT[0],
      name: `Assistant_${assistantList.length + 1}`
    }
    setEditAssistant(newAssistant)
    drawerHandler.open()
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between p-4 shadow-sm">
        <Link href="/">
          <ActionIcon>
            <IconChevronLeft />
          </ActionIcon>
        </Link>
        <Text weight={500} size="lg">
          Assistant
        </Text>
        <ActionIcon onClick={() => onAddAssistant()}>
          <IconUserPlus></IconUserPlus>
        </ActionIcon>
      </div>

      <div className="flex gap-8 flex-wrap p-4 overflow-y-auto">
        {assistantList.map((item) => (
          <Card
            key={item.id}
            shadow="sm"
            padding="lg"
            radius="md"
            className="w-full max-w-sm group transition-all duration-300"
          >
            <Text weight={500} className="line-clamp-1">
              {item.name}
            </Text>
            <Text size="sm" color="dimmed" className="line-clamp-3 mt-2">
              {item.prompt}
            </Text>
            <Group className="mt-4 flex items-center">
              <Group>
                <Badge size="md" color="green" radius="sm">
                  TOKEN: {item.max_tokens}
                </Badge>
                <Badge size="md" color="blue" radius="sm">
                  TEMP: {item.temperature}
                </Badge>{' '}
                <Badge size="md" color="cyan" radius="sm">
                  LOGS: {item.max_log}
                </Badge>
              </Group>
              <Group className="w-full flex justify-end items-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                <ActionIcon size="sm" onClick={() => onEditAssistant(item)}>
                  <IconPencil />
                </ActionIcon>
              </Group>
            </Group>
          </Card>
        ))}
      </div>
      <Drawer
        opened={opened}
        onClose={drawerHandler.close}
        size="lg"
        position="right"
      >
        <AssistantConfig
          assistant={editAssistant!}
          save={saveAssistant}
          remove={deleteAssistant}
        />
      </Drawer>
    </div>
  )
}

export default AssistantPage
