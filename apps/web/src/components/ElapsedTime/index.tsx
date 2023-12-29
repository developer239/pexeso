import { Progress } from '@mantine/core'
import React, { useState, useEffect } from 'react'

export interface IProps {
  readonly startedAt: string
  readonly timeLimitSeconds?: number
  readonly showProgressBar?: boolean
  readonly showText?: boolean
}

export const ElapsedTime: React.FC<IProps> = ({
  startedAt,
  timeLimitSeconds,
  showProgressBar,
  showText,
}) => {
  const [elapsedTime, setElapsedTime] = useState<string>('')
  const [progressValue, setProgressValue] = useState<number>(0)

  useEffect(() => {
    const startTime = new Date(startedAt).getTime()
    const endTime = timeLimitSeconds
      ? startTime + timeLimitSeconds * 1000
      : null

    const updateElapsedTime = () => {
      const now = new Date().getTime()
      const elapsed = now - startTime
      const totalMinutes = Math.floor(elapsed / (1000 * 60))
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)

      let timeString = `${seconds}s`
      if (totalMinutes > 0) {
        timeString = `${totalMinutes}m ${timeString}`
      }

      setElapsedTime(timeString)

      if (endTime) {
        const elapsedRatio = (elapsed / (endTime - startTime)) * 100
        const progress = Math.min(100, Math.max(1, elapsedRatio))

        setProgressValue(progress)
      }
    }

    updateElapsedTime()
    const interval = setInterval(updateElapsedTime, 1000)

    return () => clearInterval(interval)
  }, [startedAt, timeLimitSeconds])

  return (
    <div>
      {showText && <span>{elapsedTime}</span>}
      {showProgressBar && timeLimitSeconds && (
        <Progress radius="xs" size="xl" value={progressValue} />
      )}
    </div>
  )
}
