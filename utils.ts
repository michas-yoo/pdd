export const getSignUrl = (id: string) => `https://www.pdd24.com/pdd/img/z${id}.png`;

export const getLineUrl = (id: string) => `https://www.pdd24.com/pdd/img/r${id}.gif`;

export const getRndNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRndArrayElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
