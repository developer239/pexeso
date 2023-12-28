import { ValueTransformer } from 'typeorm'

export class GridSizeTransformer implements ValueTransformer {
  to(entityValue: { width: number; height: number }): string {
    return `${entityValue.width}x${entityValue.height}`
  }

  from(databaseValue: string): { width: number; height: number } {
    const [width, height] = databaseValue.split('x').map(Number)
    return { width, height }
  }
}
