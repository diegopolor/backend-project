"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const URI = String("mongodb+srv://mongodb:MongoDB2022@cluster0.hqukg.mongodb.net/PruebaCheckList?retryWrites=true&w=majority");
const connectDB = () => {
    mongoose_1.default.connect(URI).then(() => {
        console.log('Conectado a la base de datos ✔');
    }).catch(() => {
        console.log('No se ha podido conectar a la base datos ❌');
    });
};
exports.connectDB = connectDB;
const closeDB = () => {
    mongoose_1.default.connection.close().catch(() => {
        console.log('No se ha podido cerrar la conexión a la base de datos ❌');
    });
};
exports.closeDB = closeDB;
