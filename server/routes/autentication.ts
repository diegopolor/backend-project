import { Router } from "express";

import { createUser, userAuthentication } from "../services/users";

const authRoute = Router()

authRoute.post('/create', async (req, res)=> {
    const userAdmin = req.header('userAdmin')
    const claveAdmin = req.header('claveAdmin')
    const dataSave = req.body

    const dataSaved = await createUser(userAdmin, claveAdmin, dataSave)

    if(dataSaved.success){
        res.status(200).json({ message: dataSaved.message })
    }else {
        res.status(400).json({ message: dataSaved.message })
    }
})

authRoute.post('/login', async (req, res)=>{
    const auth = await userAuthentication(req.body)
    if(auth.success){
        res.status(200).json({token: auth?.token, rol: String(auth?.rol) })
    }else res.status(400).json({error: auth?.message})
})

export default authRoute