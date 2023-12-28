import { Avatar, Flex, Paper, Progress, Space } from '@mantine/core'
import React from 'react'

export const GameInfoWidget = () => (
  <Paper p="md" shadow="xs">
    <Flex align="center">
      <Avatar key={1} mr={8} />
      Jane Doe's turn
    </Flex>
    <Space h="sm" />
    1:12 second left
    <Space h="sm" />
    <Progress radius="xs" size="xl" value={30} />
  </Paper>
)
