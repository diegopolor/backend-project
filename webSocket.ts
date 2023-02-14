import { novedades } from './interfaces'

import socketIO, {Server} from 'socket.io'

let io: Server

const setWebSocket = (server: any) => {
    io = new socketIO.Server(server)

    io.on('connect', (socket)=> {
        const room = socket.handshake.query.nameRoom
        console.log('Se ha conectado del grupo: '+ room)
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
    prioridad,
    destinatario
} : novedades)=>{
    const socketIO = getWebSocket()
    console.log('destinatario')
    socketIO.to(destinatario).emit('novedades', {
        fecha,
        hora,
        unidad,
        clave,
        origen,
        prioridad,
    })
}

export {
    setWebSocket,
    socketNovedades
}

