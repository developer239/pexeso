import { Progress, Space } from '@mantine/core'
import React, { useState, useEffect } from 'react'

// TODO: this needs heavy refactoring
export interface IProps {
  readonly startedAt: string
  readonly timeLimitSeconds: number
  readonly shouldShowProgressBar?: boolean
  readonly text?: string
  readonly shouldCountInReverse?: boolean
  readonly isFull?: boolean
  readonly playerMatchedBothCards?: boolean
  readonly isGameWidget?: boolean
}

export const ElapsedTime: React.FC<IProps> = ({
  startedAt,
  timeLimitSeconds,
  shouldShowProgressBar,
  text,
  shouldCountInReverse,
  isFull,
  playerMatchedBothCards,
  isGameWidget,
}) => {
  const [elapsedTime, setElapsedTime] = useState<string>('')
  const [progressValue, setProgressValue] = useState<number>(0)
  const [timeLeftValue, setTimeLeftValue] = useState<string>('')

  useEffect(() => {
    const startTime = new Date(startedAt).getTime()
    const endTime = startTime + timeLimitSeconds * 1000

    // Calculate the chunk of progress to be moved every second
    const progressChunk = 100 / timeLimitSeconds

    const updateTime = () => {
      const now = new Date().getTime()

      // Calculate elapsed and remaining times
      const elapsed = now - startTime
      const remaining = Math.max(0, endTime - now) + 1000

      // Determine the text to display based on elapsed or remaining time
      const displayTime = shouldCountInReverse ? remaining : elapsed
      const totalMinutes = Math.floor(displayTime / (1000 * 60))
      const seconds = Math.floor((displayTime % (1000 * 60)) / 1000)
      let timeString = `${seconds}s`
      if (totalMinutes > 0) {
        timeString = `${totalMinutes}m ${timeString}`
      }

      shouldCountInReverse
        ? setTimeLeftValue(timeString)
        : setElapsedTime(timeString)

      // Use progressChunk for incrementing progress
      const progress = progressChunk * (elapsed / 1000)

      const roundedProgress =
        Math.round(progress / progressChunk) * progressChunk

      setProgressValue(Math.min(100, Math.max(0, roundedProgress)))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [startedAt, timeLimitSeconds, shouldCountInReverse])

  if (isFull) {
    return (
      <div>
        {!isGameWidget && (
          <>
            <Space h="lg" />
            <span>
              {playerMatchedBothCards
                ? 'Turn has ended. Cards matched. Player gets extra turn.'
                : 'Turn has ended'}
            </span>
            <Space h="lg" />
          </>
        )}
        <Progress radius="xs" size="xl" value={100} />
      </div>
    )
  }

  return (
    <div>
      {Boolean(text) && (
        <>
          <Space h="lg" />
          <span>
            {shouldCountInReverse ? timeLeftValue : elapsedTime} {text}
          </span>
          <Space h="lg" />
        </>
      )}
      {shouldShowProgressBar && timeLimitSeconds && (
        <Progress radius="xs" size="xl" value={progressValue} />
      )}
    </div>
  )
}
