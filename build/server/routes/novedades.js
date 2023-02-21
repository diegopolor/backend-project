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
const express_1 = require("express");
const authUserAdmin_1 = require("../middlewares/authUserAdmin");
const webSocket_1 = require("../../webSocket");
const novedades_1 = require("../services/novedades");
const date_1 = require("../utils/date");
const authToken_1 = require("../middlewares/authToken");
const api_1 = __importDefault(require("../logs/api"));
const novRoutes = (0, express_1.Router)();
// Ruta para dar por terminada la gestión de la novedad
novRoutes.post('/done/:id', authUserAdmin_1.rolAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dateToday, now } = (0, date_1.today)();
    const { observacion } = req.body;
    const where = {
        id: req.params.id
    };
    const dataUpdate = {
        gestion: 'Si',
        fecha_gestion: (0, date_1.dateConvert)(dateToday),
        hora_gestion: now,
        observacion
    };
    const { success, message } = yield (0, novedades_1.updateNovedad)(dataUpdate, where);
    if (success) {
        res.status(200).json(message).end();
    }
    else
        res.status(400).json(message).end();
}));
//listar novedades filtradas
novRoutes.post('/filter', authUserAdmin_1.rolAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { columns, where } = req.body;
    const { success, data, message } = yield (0, novedades_1.listNovedad)(columns, where);
    if (success) {
        res.status(200).json(data === null || data === void 0 ? void 0 : data.recordset);
    }
    else
        res.status(400).json({ message: 'No se pudo realizar el filtro: ' + message }).end();
}));
//listar novedades filtradas
novRoutes.post('/prioridad', authUserAdmin_1.rolAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prioridad, destinatario } = req.body;
    const columns = ['id', 'fecha', 'hora', 'unidad', 'clave', 'prioridad', 'descripcion'];
    let where = {
        prioridad,
        gestion: 'No',
    };
    if (destinatario !== 'Admin') {
        where = Object.assign(Object.assign({}, where), { destinatario });
    }
    const { success, data, message } = yield (0, novedades_1.listNovedadOrderBy)(columns, where, ['fecha', 'hora'], ['DESC', 'DESC']);
    if (success) {
        res.status(200).json(data === null || data === void 0 ? void 0 : data.recordset);
    }
    else
        res.status(400).json({ message });
}));
// transmite la información por WebSocket
novRoutes.post('/transmitir', authUserAdmin_1.rolAuthentication, authToken_1.tokenVerify, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { baseUrl } = req;
    const { fecha, hora, unidad, clave, origen, prioridad, descripcion, destinatario } = req.body;
    const { dateToday, now } = (0, date_1.today)();
    const isBodyValid = Object.keys(req.body).length !== 0;
    if (isBodyValid) {
        const dataMessage = {
            fecha: (0, date_1.dateConvert)(fecha),
            hora,
            unidad: Number(unidad),
            clave,
            origen,
            prioridad: Number(prioridad),
            fecha_entrega: (0, date_1.dateConvert)(dateToday),
            hora_entrega: now,
            gestion: 'No',
            descripcion,
            destinatario
        };
        const { success, message } = yield (0, novedades_1.createNovedad)(dataMessage);
        if (success) {
            console.log(dataMessage.destinatario);
            (0, webSocket_1.socketNovedades)(dataMessage);
            res.status(200).json({ message: 'Se ha guardado y transmitido la información con exito.' });
        }
        else {
            (0, api_1.default)(baseUrl, message, dataMessage);
            res.status(400).json({ message: 'No se ha podido transmitir la novedad. Error: ' + message });
        }
    }
    else
        res.status(400).json({ message: 'No se ha encontrado datos en la peticion ' });
}));
exports.default = novRoutes;
