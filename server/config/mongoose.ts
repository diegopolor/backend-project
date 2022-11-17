import mongoose from 'mongoose'

const URI = String("mongodb+srv://mongodb:MongoDB2022@cluster0.hqukg.mongodb.net/PruebaCheckList?retryWrites=true&w=majority")

export const connectDB = (): void => {
  mongoose.connect(URI).then(() => {
    console.log(
      'Conectado a la base de datos ✔'
    )
  }).catch(() => {
    console.log(
      'No se ha podido conectar a la base datos ❌'
    )
  })
}

export const closeDB = (): void => {
  mongoose.connection.close().catch(() => {
    console.log(
      'No se ha podido cerrar la conexión a la base de datos ❌'
    )
  })
}