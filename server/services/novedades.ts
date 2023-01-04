import dotenv from 'dotenv'

import { novedades } from "../../interfaces"

import { saveField, listFilds } from "./sqlServer"
 
dotenv.config()

const TABLE = `[${process.env.DBNAME}].[dbo].[NovClasificadas]`

//crea una novedad
export const createNovedad = async (novedad : novedades)=> {
    const { success, message }  = await saveField(TABLE, novedad)
    if(success){
        return { 
            success: true,
            message: 'Novedad creada con exito'
        }
    }
    else return{
        success: false,
        message : 'No se pudo guardar la novedad: ' + message
    }
}

// Lista las novedades de forma filtrada.
export const listNovedad = async (columns: string[], where: object ) => {
    const { data, success, message } = await listFilds(TABLE, columns, where)
    if(success){
        return {
            data,
            message: 'datos listados exitosamente',
            success
        }
    }else return{
        message,
        success
    }
}
