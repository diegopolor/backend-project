import { Router } from "express";

import { novedades, wherePrioridad } from "../../interfaces";
import { rolAuthentication } from "../middlewares/authUserAdmin";

import { objectToBetween } from "../utils/objectToSql";
import { socketNovedades } from "../../webSocket";
import { createNovedad, listNovedad, listNovedadOrderBy, updateNovedad } from "../services/novedades";
import { today, dateConvert } from "../utils/date";
import { tokenVerify } from "../middlewares/authToken";
import logApi from "../logs/api";


const novRoutes = Router()

// Ruta para dar por terminada la gestión de la novedad
novRoutes.post('/done/:id', rolAuthentication, tokenVerify, async(req, res)=> {    
    const { dateToday, now } =  today()
    const { observacion } = req.body
    const where = {
        id: req.params.id
    }
    const dataUpdate = {
            gestion : 'Si',
            fecha_gestion: dateConvert(dateToday), 
            hora_gestion: now,
            observacion
    }
     const { success, message } =  await updateNovedad(dataUpdate, where)
     if(success){
        res.status(200).json(message).end()
     }else res.status(400).json(message).end()
})

//listar novedades filtradas
novRoutes.post('/filter',rolAuthentication,  tokenVerify, async (req, res)=> {
    const { columns, where } = req.body 
    const { success, data, message }  = await listNovedad(columns, where)
    if(success){
       res.status(200).json(data?.recordset)
    }else res.status(400).json( { message : 'No se pudo realizar el filtro: ' + message } ).end()
})

novRoutes.post('/historico', rolAuthentication,  tokenVerify, async(req, res)=> {
    const destinatario = String(req.body?.destinatario)
    console.log(destinatario);
    
    const { dateToday } = today()
    const fecha_gestion = dateConvert(dateToday)
    const gestion = 'Si'
    const columns = [
        'id', 
        'fecha',
        'hora',
        'unidad',
        'clave',
        'prioridad',
        'gestion',
        'fecha_gestion',
        'hora_gestion',
        'descripcion',
        'observacion'
    ]

    const where = destinatario !== 'Admin'? { gestion, destinatario, fecha_gestion }: { gestion, fecha_gestion }

    const { success, data, message }  = await listNovedadOrderBy(columns, where, ['fecha_gestion', 'hora'], ['DESC', 'DESC'])
    console.log(data?.recordsets);
    
    if(success){
        res.status(200).json(data?.recordset)
     }else res.status(400).json({ message })
})

novRoutes.post('/historicoFilter', rolAuthentication,  tokenVerify, async(req, res)=> {
    const {  fechaInicial, fechaFinal, unidad, destinatario } = req.body  
    const gestion = 'Si'
    const columns = [
        'id', 
        'fecha',
        'hora',
        'unidad',
        'clave',
        'prioridad',
        'gestion',
        'fecha_gestion',
        'hora_gestion',
        'descripcion',
        'observacion'
    ]

    const between = fechaFinal && fechaFinal ? objectToBetween('fecha', fechaInicial, fechaFinal) : ''
    let dataSend: any = {
        gestion
    }

    dataSend = unidad ? { ...dataSend, unidad }: { ...dataSend }
    dataSend = destinatario ? { ...dataSend, destinatario }: { ...dataSend }
    
    const where = {...dataSend}
    const { success, data, message }  = await listNovedadOrderBy(columns, where, ['fecha', 'hora'], ['DESC', 'DESC'], between)
    if(success){
        res.status(200).json(data?.recordset)
     }else res.status(400).json({ message })
})
//listar novedades filtradas
novRoutes.post('/prioridad', rolAuthentication, tokenVerify, async (req, res)=> {
    const { prioridad, destinatario } = req.body
    const columns = ['id', 'fecha', 'hora', 'unidad', 'clave', 'prioridad', 'descripcion', 'gestion']
    let where: wherePrioridad = {
        prioridad,
        gestion: 'No',
    }
    if(destinatario !== 'Admin'){
        where = { ...where, destinatario }
    } 

    const { success, data, message }  = await listNovedadOrderBy(columns, where, ['fecha', 'hora'], ['DESC', 'DESC'])
    if(success){
       res.status(200).json(data?.recordset)
    }else res.status(400).json({ message })
})

// transmite la información por WebSocket
novRoutes.post('/transmitir', rolAuthentication, tokenVerify, async(req, res)=> {
    const { baseUrl } = req
    const  { fecha, hora, unidad, clave, origen, prioridad, descripcion, destinatario } : novedades = req.body
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
            descripcion,
            destinatario
        }
   
        const { success, message } = await createNovedad(dataMessage)
        if(success){
            console.log(dataMessage.destinatario)
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