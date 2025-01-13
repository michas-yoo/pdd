export const getSignUrl = (id: string) => `https://www.pdd24.com/pdd/img/z${id}.png`;

export const getLineUrl = (id: string) => `https://www.pdd24.com/pdd/img/r${id}.gif`;

export const getRndNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRndArrayIndex = <T>(array: T[]): number => Math.floor(Math.random() * array.length);

export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
