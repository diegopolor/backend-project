import { novedades } from './interfaces'

import socketIO, {Server} from 'socket.io'

let io: Server

const setWebSocket = (server: any) => {
    io = new socketIO.Server(server)
}

const getWebSocket = ()=> {
    return io
}

const socketNovedades = ({ 
    fecha, 
    hora, 
    unidad, 
    clave, 
    origen, 
    prioridad  
} : novedades)=>{
   const socketIO = getWebSocket()
    socketIO.emit('novedades', {
        fecha,
        hora,
        unidad,
        clave,
        origen,
        prioridad
    })
}

export {
    setWebSocket,
    socketNovedades
}

