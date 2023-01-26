export const dateConvert = (date: string) =>{ 
    const format = {
        year : date.split('/')[2],
        month : date.split('/')[1],
        day: date.split('/')[0]
    }
    return format['year'] + '-' + format['month'] + '-' + format['day']
}

export const today = () =>{ 
    const date = new Date
    const dateToday = date.getFullYear() + '-' + date.getMonth()+1 + '-' +  (date.getDay() + 1)
    const now = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

    return {
        dateToday,
        now
    }
}