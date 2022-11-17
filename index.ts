import Express from 'express'
import { apiRoutes } from './server/routes'
import { connectDB } from './server/config/mongoose'

const app = Express()
const PORT = 82

app.use(Express.json())

connectDB()
apiRoutes(app)

app.use((_req, res) => {
    res.status(404).json('Esta ruta no está disponible.')
})

app.listen(PORT, ()=> console.log(`Server in port ${PORT}`))