export const dateConvert = (date: string) =>{ 
    const format = {
        year : date.split('/')[2],
        month : date.split('/')[1],
        day: date.split('/')[0]
    }
    return format['year'] + '-' + format['month'] + '-' + format['day']
}