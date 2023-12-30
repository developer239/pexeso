// TODO: add "j" to id-length exceptions
/* eslint-disable security/detect-object-injection,id-length */
export const shuffleArray = <TItem>(array: TItem[]): TItem[] => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
