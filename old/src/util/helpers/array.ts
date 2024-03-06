const getMultipleRandom = (array: any[], num: number) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
}

export {
    getMultipleRandom,
    shuffleArray
}