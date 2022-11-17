let prueba : string[] = []

const setPrueba = (value: string) => {
    prueba.push(value)
}

const getPrueba = (): string[] => {
    return prueba
}

export {
    setPrueba,
    getPrueba
}