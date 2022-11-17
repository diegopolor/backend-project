"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrueba = exports.setPrueba = void 0;
let prueba = [];
const setPrueba = (value) => {
    prueba.push(value);
};
exports.setPrueba = setPrueba;
const getPrueba = () => {
    return prueba;
};
exports.getPrueba = getPrueba;
