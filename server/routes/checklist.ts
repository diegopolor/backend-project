import Router from 'express'
import { querySQL } from '../services/sqlServer'
import { getInsertInto } from '../utils/objectToSql'

import { checklist } from '../../types'

const table = 'InspeccionUnidad'
const querySelect = `SELECT * FROM ${table}`

const checkListRoute = Router()

// Petición GET con todos los datos
checkListRoute.get('/', (_req, res)=>{ 
    querySQL(querySelect).then((data)=> {
            res.status(200).json(data.recordset)
    }).catch(()=>{
        res.status(500).json('Ha ocurrido un error en el servidor. CODIGO: 500')
    })  
})

//Petición POST para guardar 
checkListRoute.post('/', async(req, res)=> {
    const dataCheckList: Array<checklist> = req.body
    try{
        for(let itemObject of dataCheckList ){
            const query = getInsertInto(table, itemObject)
            await querySQL(query)
        }
        res.status(200).json({success :'Datos guardados con exito'})
    }catch(e){
        console.log(e)
        res.status(500).json({error: 'No se han podido guardar los datos'})
    }
})

export default checkListRoute