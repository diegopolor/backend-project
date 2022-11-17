import Router from 'express'
import { checklistModel } from '../models/checklist'
import { checklist } from '../../types'

const checkListRoute = Router()

checkListRoute.get('/', async (_req, res)=> {
    const data = await checklistModel.find()
    res.json(data)

})

checkListRoute.post('/', async (req, res)=> {
    let data : Array<checklist> = []
    data = req.body?.data
    
    data.map(async(dataObject) => {
        const model = new checklistModel(dataObject)
        const savedData = await model.save()
        console.log(savedData)
    })

    res.json('se han guardado los datos')
})

export default checkListRoute