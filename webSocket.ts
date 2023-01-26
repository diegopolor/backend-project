import { novedades } from './interfaces'

import socketIO, {Server} from 'socket.io'

let io: Server

const setWebSocket = (server: any) => {
    io = new socketIO.Server(server)

    io.on('connect', (socket)=> {

        const room = socket.handshake.query.nameRoom
        socket.join(String(room))

        socket.on('doneNovedad', (id)=> {
            io.emit('doneNovedad', id)
        })
    } )
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

