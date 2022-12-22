import Express from 'express'
import cors from 'cors'

import { apiRoutes } from './server/routes'

const app = Express()
const PORT = 3000

app.options('*', cors())
app.use(cors())
app.use(Express.json())

apiRoutes(app)

app.use((_req, res) => {
    res.status(404).json('Esta ruta no existe')
})

app.listen(
    PORT, 
    ()=> console.log(`Servidor corriendo en el puerto: ${PORT}.`)
)