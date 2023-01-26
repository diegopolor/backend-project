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
const users_1 = require("../services/users");
const authRoute = (0, express_1.Router)();
authRoute.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAdmin = req.header('userAdmin');
    const claveAdmin = req.header('claveAdmin');
    const dataSave = req.body;
    const dataSaved = yield (0, users_1.createUser)(userAdmin, claveAdmin, dataSave);
    if (dataSaved.success) {
        res.status(200).json({ message: dataSaved.message });
    }
    else {
        res.status(400).json({ message: dataSaved.message });
    }
}));
authRoute.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield (0, users_1.userAuthentication)(req.body);
    if (auth.success) {
        res.status(200).json({ token: auth === null || auth === void 0 ? void 0 : auth.token, rol: String(auth === null || auth === void 0 ? void 0 : auth.rol) });
    }
    else
        res.status(400).json({ error: auth === null || auth === void 0 ? void 0 : auth.message });
}));
exports.default = authRoute;
