import Express from 'express'
import cors from 'cors'

import { apiRoutes } from './server/routes'
import { setWebSocket } from './webSocket'

const app = Express()
const PORT = 3001
const corsOptions = {
    origin: "*"
}

// Middlewares iniciales
app.use(cors(corsOptions))
app.use(Express.json({ limit : '1000mb' }))
app.use(Express.static( 'public'))

//Rutas del servidor
apiRoutes(app)

// Ruta no encontrada 404
app.use((_req, res) => {
    res.status(404).json('Esta ruta no existe')
})

const server = app.listen(
    PORT, 
    ()=> console.log(`Servidor corriendo en el puerto: ${PORT}.`)
)

// asigna el socket
setWebSocket(server)