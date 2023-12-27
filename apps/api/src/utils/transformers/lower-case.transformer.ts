import { TransformFnParams } from 'class-transformer/types/interfaces'
import { PerhapsType } from 'src/utils/types/perhaps.type'

export const lowerCaseTransformer = (
  params: TransformFnParams
): PerhapsType<string> => params.value?.toLowerCase().trim()
