"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketNovedades = exports.setWebSocket = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
let io;
const setWebSocket = (server) => {
    io = new socket_io_1.default.Server(server);
};
exports.setWebSocket = setWebSocket;
const getWebSocket = () => {
    return io;
};
const socketNovedades = ({ fecha, hora, unidad, clave, origen, prioridad }) => {
    const socketIO = getWebSocket();
    socketIO.emit('novedades', {
        fecha,
        hora,
        unidad,
        clave,
        origen,
        prioridad
    });
};
exports.socketNovedades = socketNovedades;
