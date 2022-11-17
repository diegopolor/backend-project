"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./server/routes");
const mongoose_1 = require("./server/config/mongoose");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
(0, mongoose_1.connectDB)();
(0, routes_1.apiRoutes)(app);
app.use((_req, res) => {
    res.status(404).json('Esta ruta no está disponible.');
});
app.listen(PORT, () => console.log(`Server in port ${PORT}`));
