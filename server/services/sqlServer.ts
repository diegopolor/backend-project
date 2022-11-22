import sql from 'mssql'

import configDB from "../config/database";

const connectDB = async ()=> {
    const connection = await sql.connect(configDB)
    return connection
}

export const querySQL = async (sql: string)=> {
        const db = await connectDB()
        const data = await db.query(sql)
        db.close()
        return data
}


