import { Router } from "express";

import { novedades } from "../../interfaces";

import { socketNovedades } from "../../webSocket";
import { createNovedad, listNovedad } from "../services/novedades";
import { dateConvert } from "../utils/date";

const novRoutes = Router()

//listar novedades filtradas
novRoutes.post('/filter', async (req, res)=> {
    const { columns, where } = req.body 
    const { success, data, message }  = await listNovedad(columns, where)
    if(success){
       res.status(200).json(data?.recordset)
    }else res.status(400).json({message : 'No se pudo realizar el filtro: ' + message})
})

//listar novedades filtradas
novRoutes.post('/prioridad', async (req, res)=> {
    const prioridad : 1 | 2 = req.body.prioridad
    const columns = ['id', 'fecha', 'hora', 'unidad', 'clave', 'prioridad'] 
    const where = {
        prioridad,
        gestion: "No"
    }
    const { success, data, message }  = await listNovedad(columns, where)
    if(success){
       res.status(200).json(data?.recordset)
    }else res.status(400).json({message : 'No se pudo realizar el filtro: ' + message})
})

novRoutes.post('/transmitir', async(req, res)=> {
    const  { fecha, hora, unidad, clave, origen, prioridad } : novedades = req.body

    const date = new Date
    const today = date.getFullYear() + '-' + date.getMonth()+1 + '-' +  (date.getDay() + 1)
    const now = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

    const dataMessage : novedades = {
        fecha: dateConvert(fecha) , 
        hora,
        unidad : Number(unidad),
        clave,
        origen,
        prioridad : Number(prioridad),
        fecha_entrega: today,
        hora_entrega: now,
        gestion: 'No'
    }

    const { success, message } = await createNovedad(dataMessage)
    if(success){
        socketNovedades(dataMessage)
        res.status(200).json({message: 'Se ha guardado y transmitido la información con exito.'})
    }else res.status(400).json({message: 'No se ha podido transmitir la novedad. Error: ' + message})
})

export default novRoutes