import { Button, Paper, Progress, Space } from '@mantine/core'
import React from 'react'

export const GameOptionsWidget: React.FC = () => (
  <Paper p="md" shadow="xs">
    0:00 total time played
    <Space h="sm" />
    <Progress radius="xs" size="xl" value={30} />
    <Space h="md" />
    <Button fullWidth>Start Game</Button>
  </Paper>
)
