"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.today = exports.dateConvert = void 0;
const dateConvert = (date) => {
    const format = {
        year: date.split('/')[2],
        month: date.split('/')[1],
        day: date.split('/')[0]
    };
    return format['year'] + '-' + format['month'] + '-' + format['day'];
};
exports.dateConvert = dateConvert;
const today = () => {
    const date = new Date;
    const dateToday = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + (date.getDay() + 1);
    const now = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return {
        dateToday,
        now
    };
};
exports.today = today;
