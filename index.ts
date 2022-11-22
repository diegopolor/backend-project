import Express from 'express'
// import  dotenv  from 'dotenv'

import { apiRoutes } from './server/routes'

const app = Express()
const PORT = 3000

app.use(Express.json())

apiRoutes(app)

app.use((_req, res) => {
    res.status(404).json('Esta ruta no está disponible.')
})

app.listen(
    PORT, 
    ()=> console.log(`Servidor corriendo en el puerto ${PORT}.`)
)