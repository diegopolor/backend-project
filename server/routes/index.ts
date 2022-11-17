import Router from 'express'
import checkListRoute  from './checklist'

export const apiRoutes = (app: any )=> {
    const routes = Router()
    routes.use('/checklist', checkListRoute)
    app.use('/api/v1', routes)   
}   