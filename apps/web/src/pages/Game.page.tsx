import {
  Group,
  Grid,
  NumberInput,
  Flex,
  Avatar,
  Space,
  TableData,
  Table,
  Paper,
  Progress,
  Modal,
} from '@mantine/core'
import React from 'react'
import { GameBoard } from 'src/components/GameBoard'

export const GameOptions: React.FC = () => (
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

const Players = () => {
  const tableData: TableData = {
    head: ['', 'Name'],
    body: [
      [<Avatar key={0} />, 'John Doe'],
      [<Avatar key={1} />, 'Jane Doe'],
      [<Avatar key={2} />, 'Jane Doe'],
    ],
  }

  return (
    <Paper p="md" shadow="xs">
      <Table data={tableData} />
    </Paper>
  )
}

const GameInfo = () => (
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

export const GamePage = () => (
  <>
    <Grid>
      <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, md: 1 }}>
        <GameBoard rowsCount={4} columnsCount={4} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }} order={{ base: 1, md: 2 }}>
        <GameOptions />
        <Space h="lg" />
        <GameInfo />
        <Space h="lg" />
        <Players />
      </Grid.Col>
    </Grid>
    <Modal
      opened={false}
      onClose={() => {
        // navigate to /lobby
        window.location.href = '/lobby'
      }}
      centered
    >
      Player XY won!
    </Modal>
  </>
)
