export const dateConvert = (date: string) =>{ 
    const format = {
        year : date.split('/')[2],
        month : date.split('/')[1],
        day: date.split('/')[0]
    }
    return format['year'] + '-' + format['month'] + '-' + format['day']
}

export const today = () =>{ 
    const objectDate = new Date().toLocaleString('en-GB')
    const dateToday = objectDate.split(',')[0]
    const now = objectDate.split(',')[1].replace(' ', '')
    
    return {
        dateToday,
        now
    }
}