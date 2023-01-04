"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateConvert = void 0;
const dateConvert = (date) => {
    const format = {
        year: date.split('/')[2],
        month: date.split('/')[1],
        day: date.split('/')[0]
    };
    return format['year'] + '-' + format['month'] + '-' + format['day'];
};
exports.dateConvert = dateConvert;
