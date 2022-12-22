import Router from 'express'
import checkListRoute  from './checklist'
import authRoute from './autentication'

export const apiRoutes = (app: any )=> {
    const routes = Router()
    routes.use('/auth',authRoute )
    routes.use('/checklist', checkListRoute)
    app.use('/api/v1', routes)  
}