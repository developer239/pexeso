import { Flex, Group, NumberInput, Paper, Progress, Space } from '@mantine/core'
import React from 'react'

export const GameOptionsWidget: React.FC = () => (
  <Paper p="md" shadow="xs">
    1:12 total time played
    <Space h="sm" />
    <Progress radius="xs" size="xl" value={30} />
    <Space h="sm" />
    <Group>
      <Flex direction="row" gap={10} style={{ width: '100%' }}>
        <NumberInput
          disabled
          label="Rows"
          value={1}
          min={4}
          max={12}
          step={1}
          style={{ width: '100%' }}
        />
        <NumberInput
          disabled
          label="Columns"
          value={1}
          min={4}
          max={12}
          step={1}
          style={{ width: '100%' }}
        />
      </Flex>
      <NumberInput
        disabled
        label="Time limit per turn [seconds]"
        value={1}
        min={10}
        max={60}
        style={{ width: '100%' }}
      />
      <NumberInput
        disabled
        label="Game time limit [seconds]"
        value={1}
        min={10}
        max={60}
        style={{ width: '100%' }}
      />
    </Group>
  </Paper>
)
