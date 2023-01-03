import Express from 'express'
import cors from 'cors'

import { apiRoutes } from './server/routes'
import { setWebSocket, socketNovedades } from './webSocket'

const app = Express()
const PORT = 3001
const corsOptions = {
    origin: "*"
}

// Middlewares iniciales
app.use(cors(corsOptions))
app.use(Express.json())
app.use(Express.static( 'public'))

//Rutas del servidor
apiRoutes(app)

app.post('/prueba', (req, res)=> {
    console.log(req.body)
    const  { fecha, hora, unidad, clave, origen, prioridad } = req.body

    const dataMessage = {
        fecha,
        hora,
        unidad,
        clave,
        origen,
        prioridad
    }
    socketNovedades(dataMessage)

    res.json('Prueba de socket por petición').end()
})

// Ruta no encontrada 404
app.use((_req, res) => {
    res.status(404).json('Esta ruta no existe')
})

const server = app.listen(
    PORT, 
    ()=> console.log(`Servidor corriendo en el puerto: ${PORT}.`)
)

setWebSocket(server)