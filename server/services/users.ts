import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { querySQL, saveField } from './sqlServer'
import { updateField, listFilds } from './sqlServer'


import { errorHandler, userCreate, userAuth } from '../../types'

const table = '[CHECKLIST].[dbo].[UserToken]'

const getUserToken =  async (isCorrect: boolean, usuario: string) => {
    if(isCorrect){
        const generedToken =  jwt.sign({ foo: 'bar' }, 'shhhhh');
        const resultUpdate = await updateField(table, {token: generedToken}, {usuario})
        if(resultUpdate.success){
            return { success: true,  token: generedToken, message: resultUpdate.message }
        } else return { success: false, token: undefined, message: resultUpdate.message }
    } else return { success: false, token: undefined, message: 'Credenciales incorrectas' }
}

export const userAuthentication = async({usuario, clave}: userAuth) =>{
    const queryClave = await listFilds(table, ['clave', 'rol'], {usuario})
    const errorText = 'Credenciales incorrectas'
    if(queryClave.success){
        const rowsQuery =  queryClave?.data?.rowsAffected[0]
        if(Number(rowsQuery) > 0){
            const userPass = queryClave?.data?.recordset[0]?.clave 
            const rol = queryClave?.data?.recordset[0]?.rol
            const isCorrect = await bcrypt.compare(clave, String(userPass))
            const { success, token, message  } = await getUserToken(isCorrect, usuario)
            return { success, token, message, rol }
        }else return { success: false, rol :undefined, token: undefined, message: errorText }
    }else return { success: false, rol :undefined, token: undefined, message: queryClave.message } 
 }

export const adminAuthentication =  async (
    userAdmin: string | undefined, 
    claveAdmin: string | undefined
    ): Promise<errorHandler> =>{  

    const queryAdmin = `SELECT clave, rol FROM ${table} WHERE usuario = '${userAdmin}';`
    const {data, message} = await querySQL(queryAdmin)
    const rowsResult = data?.rowsAffected[0] 

    if(Number(rowsResult) > 0){
        const passAdmin = data?.recordset[0]?.clave
        const rolAdmin = data?.recordset[0]?.rol
        const isAdminPass = await bcrypt.compare(String(claveAdmin), passAdmin)

        if(isAdminPass && rolAdmin == "Admin"){   
            return { 
                success: true, 
                message: 'Usuario admnistrador' 
            }
        } else return { 
            success : false, 
            message: 'Contraseña incorrecta o usuario sin rol administrador.'
        }
    }
    else
        return { 
            success : false, 
            message: 'No se ha encontrado el usuario. Error: ' + message
        }
}

export const createUser = async (
    userAdmin: string | undefined, 
    claveAdmin: string | undefined, 
    {
        usuario,
        clave,
        rol
    }: userCreate
    ) => {
        const admin = await adminAuthentication(userAdmin, claveAdmin)
        if(admin.success){
            const userHashPass = await bcrypt.hash(clave, 10)
            const data = {
                usuario,
                clave: userHashPass,
                rol
            }
            const dataSaved = await saveField(table, data)     
            if(dataSaved.success){
                return { 
                    success: dataSaved.success, 
                    message: 'Usuario creado satisfactoriamente'
                }
            }else return { 
                    success: dataSaved.success, 
                    message: 'No se ha podido guardar la información. Error: ' + dataSaved.message 
                }           
        }else return { message : admin.message }
}

export const updateUser = async(objectValues: any, objectWhere: any)=> {
   const updatedData = await updateField(table, objectValues, objectWhere)
   if(updatedData.success){
    return { success: true, message: 'Usuario actualizado con exito' }
   }else return { success: false, message: 'Error al actualizar el usuario' }
} 

