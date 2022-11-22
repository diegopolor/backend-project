"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqlServer_1 = require("../services/sqlServer");
const objectToSql_1 = require("../utils/objectToSql");
const table = 'InspeccionUnidad';
const querySelect = `SELECT * FROM ${table}`;
const checkListRoute = (0, express_1.default)();
// Petición GET con todos los datos
checkListRoute.get('/', (_req, res) => {
    (0, sqlServer_1.querySQL)(querySelect).then((data) => {
        res.status(200).json(data.recordset);
    }).catch(() => {
        res.status(500).json('Ha ocurrido un error en el servidor. CODIGO: 500');
    });
});
//Petición POST para guardar 
checkListRoute.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataCheckList = req.body;
    try {
        for (let itemObject of dataCheckList) {
            const query = (0, objectToSql_1.getInsertInto)(table, itemObject);
            const response = yield (0, sqlServer_1.querySQL)(query);
            console.log(response);
        }
        res.status(200).json({ success: 'Datos guardados con exito' });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: 'No se han podido guardar los datos' });
    }
    /*dataCheckList.map(async(data)=>{
      
   })*/
}));
exports.default = checkListRoute;
