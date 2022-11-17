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
const checklist_1 = require("../models/checklist");
const checkListRoute = (0, express_1.default)();
checkListRoute.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield checklist_1.checklistModel.find();
    res.json(data);
}));
checkListRoute.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let data = [];
    data = (_a = req.body) === null || _a === void 0 ? void 0 : _a.data;
    data.map((dataObject) => __awaiter(void 0, void 0, void 0, function* () {
        const model = new checklist_1.checklistModel(dataObject);
        const savedData = yield model.save();
        console.log(savedData);
    }));
    res.json('se han guardado los datos');
}));
exports.default = checkListRoute;
