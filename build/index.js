"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./server/routes");
const webSocket_1 = require("./webSocket");
const app = (0, express_1.default)();
const PORT = 3001;
const corsOptions = {
    origin: "*"
};
// Middlewares iniciales
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
//Rutas del servidor
(0, routes_1.apiRoutes)(app);
app.post('/prueba', (req, res) => {
    console.log(req.body);
    const { fecha, hora, unidad, clave, origen, prioridad } = req.body;
    const dataMessage = {
        fecha,
        hora,
        unidad,
        clave,
        origen,
        prioridad
    };
    (0, webSocket_1.socketNovedades)(dataMessage);
    res.json('Prueba de socket por petición').end();
});
// Ruta no encontrada 404
app.use((_req, res) => {
    res.status(404).json('Esta ruta no existe');
});
const server = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto: ${PORT}.`));
(0, webSocket_1.setWebSocket)(server);
