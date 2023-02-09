import { Router } from "express";

import { novedades } from "../../interfaces";

import { socketNovedades } from "../../webSocket";
import { createNovedad, listNovedad, listNovedadOrderBy, updateNovedad } from "../services/novedades";
import { today, dateConvert } from "../utils/date";
import { tokenVerify } from "../middlewares/authToken";
import logApi from "../logs/api";

const novRoutes = Router()

// Ruta para dar por terminada la gestión de la novedad
novRoutes.post('/done/:id', async(req, res)=> {
    
    const { dateToday, now } =  today()
    const { observacion } = req.body
    const where = {
        id: req.params.id
    }
    const dataUpdate = {
            gestion : 'Si',
            fecha_gestion: dateToday, 
            hora_gestion: now,
            observacion
    }
     const { success, message } =  await updateNovedad(dataUpdate, where)
     if(success){
        res.status(200).json(message).end()
     }else res.status(400).json(message).end()
})

//listar novedades filtradas
novRoutes.post('/filter', async (req, res)=> {
    const { columns, where } = req.body 
    const { success, data, message }  = await listNovedad(columns, where)
    if(success){
       res.status(200).json(data?.recordset)
    }else res.status(400).json({message : 'No se pudo realizar el filtro: ' + message}).end()
})

//listar novedades filtradas
novRoutes.post('/prioridad', async (req, res)=> {
    const prioridad : 1 | 2 = req.body.prioridad
    const columns = ['id', 'fecha', 'hora', 'unidad', 'clave', 'prioridad', 'descripcion'] 
    const where = {
        prioridad,
        gestion: 'No'
    }
    const { success, data, message }  = await listNovedadOrderBy(columns, where, ['fecha', 'hora'], ['DESC', 'DESC'])
    if(success){
       res.status(200).json(data?.recordset)
    }else res.status(400).json({ message })
})

// transmite la información por WebSocket
novRoutes.post('/transmitir', tokenVerify, async(req, res)=> {
    const { baseUrl } = req
    const  { fecha, hora, unidad, clave, origen, prioridad, descripcion } : novedades = req.body
    const { dateToday, now } = today()
    const isBodyValid = Object.keys(req.body).length !== 0;
    
    if(isBodyValid){
        const dataMessage : novedades = {
            fecha: dateConvert(fecha) , 
            hora,
            unidad : Number(unidad),
            clave,
            origen,
            prioridad : Number(prioridad),
            fecha_entrega: dateConvert(dateToday),
            hora_entrega: now,
            gestion: 'No',
            descripcion
        }
   
        const { success, message } = await createNovedad(dataMessage)
        if(success){
            socketNovedades(dataMessage)
            res.status(200).json({message: 'Se ha guardado y transmitido la información con exito.'})
        }else{ 
            logApi(baseUrl, message, dataMessage)
            res.status(400).json({message: 'No se ha podido transmitir la novedad. Error: ' + message})
        }
    }
    else res.status(400).json({message: 'No se ha encontrado datos en la peticion '})
   
})

export default novRoutes