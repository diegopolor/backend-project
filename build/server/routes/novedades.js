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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webSocket_1 = require("../../webSocket");
const novedades_1 = require("../services/novedades");
const date_1 = require("../utils/date");
const novRoutes = (0, express_1.Router)();
//listar novedades filtradas
novRoutes.post('/filter', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { columns, where } = req.body;
    const { success, data, message } = yield (0, novedades_1.listNovedad)(columns, where);
    if (success) {
        res.status(200).json(data === null || data === void 0 ? void 0 : data.recordset);
    }
    else
        res.status(400).json({ message: 'No se pudo realizar el filtro: ' + message });
}));
//listar novedades filtradas
novRoutes.post('/prioridad', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prioridad = req.body.prioridad;
    const columns = ['id', 'fecha', 'hora', 'unidad', 'clave', 'prioridad'];
    const where = {
        prioridad,
        gestion: "No"
    };
    const { success, data, message } = yield (0, novedades_1.listNovedad)(columns, where);
    if (success) {
        res.status(200).json(data === null || data === void 0 ? void 0 : data.recordset);
    }
    else
        res.status(400).json({ message: 'No se pudo realizar el filtro: ' + message });
}));
novRoutes.post('/transmitir', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fecha, hora, unidad, clave, origen, prioridad } = req.body;
    const date = new Date;
    const today = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + (date.getDay() + 1);
    const now = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    const dataMessage = {
        fecha: (0, date_1.dateConvert)(fecha),
        hora,
        unidad: Number(unidad),
        clave,
        origen,
        prioridad: Number(prioridad),
        fecha_entrega: today,
        hora_entrega: now,
        gestion: 'No'
    };
    const { success, message } = yield (0, novedades_1.createNovedad)(dataMessage);
    if (success) {
        (0, webSocket_1.socketNovedades)(dataMessage);
        res.status(200).json({ message: 'Se ha guardado y transmitido la información con exito.' });
    }
    else
        res.status(400).json({ message: 'No se ha podido transmitir la novedad. Error: ' + message });
}));
exports.default = novRoutes;
