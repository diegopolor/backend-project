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
exports.updateUser = exports.createUser = exports.adminAuthentication = exports.userAuthentication = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sqlServer_1 = require("./sqlServer");
const sqlServer_2 = require("./sqlServer");
const table = 'UserToken';
const getUserToken = (isCorrect, usuario) => __awaiter(void 0, void 0, void 0, function* () {
    if (isCorrect) {
        const generedToken = jsonwebtoken_1.default.sign({ foo: 'bar' }, 'shhhhh');
        const resultUpdate = yield (0, sqlServer_2.updateField)(table, { token: generedToken }, { usuario });
        if (resultUpdate.success) {
            return { success: true, token: generedToken, message: resultUpdate.message };
        }
        else
            return { success: false, token: undefined, message: resultUpdate.message };
    }
    else
        return { success: false, token: undefined, message: 'Credenciales incorrectas' };
});
const userAuthentication = ({ usuario, clave }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const queryClave = yield (0, sqlServer_2.listFilds)(table, ['clave'], { usuario });
    const errorText = 'Credenciales incorrectas';
    if (queryClave.success) {
        const rowsQuery = (_a = queryClave === null || queryClave === void 0 ? void 0 : queryClave.data) === null || _a === void 0 ? void 0 : _a.rowsAffected[0];
        if (Number(rowsQuery) > 0) {
            const userPass = (_c = (_b = queryClave === null || queryClave === void 0 ? void 0 : queryClave.data) === null || _b === void 0 ? void 0 : _b.recordset[0]) === null || _c === void 0 ? void 0 : _c.clave;
            const isCorrect = yield bcrypt_1.default.compare(clave, String(userPass));
            return getUserToken(isCorrect, usuario);
        }
        else
            return { success: false, token: undefined, message: errorText };
    }
    else
        return { success: false, token: undefined, message: queryClave.message };
});
exports.userAuthentication = userAuthentication;
const adminAuthentication = (userAdmin, claveAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h;
    const queryAdmin = `SELECT clave, rol FROM ${table} WHERE usuario = '${userAdmin}';`;
    const resultAdmin = yield (0, sqlServer_1.querySQL)(queryAdmin);
    const rowsResult = (_d = resultAdmin === null || resultAdmin === void 0 ? void 0 : resultAdmin.data) === null || _d === void 0 ? void 0 : _d.rowsAffected[0];
    if (Number(rowsResult) > 0) {
        const passAdmin = (_f = (_e = resultAdmin === null || resultAdmin === void 0 ? void 0 : resultAdmin.data) === null || _e === void 0 ? void 0 : _e.recordset[0]) === null || _f === void 0 ? void 0 : _f.clave;
        const rolAdmin = (_h = (_g = resultAdmin === null || resultAdmin === void 0 ? void 0 : resultAdmin.data) === null || _g === void 0 ? void 0 : _g.recordset[0]) === null || _h === void 0 ? void 0 : _h.rol;
        const isAdminPass = yield bcrypt_1.default.compare(String(claveAdmin), passAdmin);
        if (isAdminPass && rolAdmin == "Admin") {
            return {
                success: true,
                message: 'Usuario admnistrador'
            };
        }
        else
            return {
                success: false,
                message: 'Contraseña incorrecta o usuario sin rol administrador.'
            };
    }
    else
        return {
            success: false,
            message: 'No se ha encontrado el usuario.'
        };
});
exports.adminAuthentication = adminAuthentication;
const createUser = (userAdmin, claveAdmin, { usuario, clave, rol }) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield (0, exports.adminAuthentication)(userAdmin, claveAdmin);
    if (admin.success) {
        const userHashPass = yield bcrypt_1.default.hash(clave, 10);
        const data = {
            usuario,
            clave: userHashPass,
            rol
        };
        const dataSaved = yield (0, sqlServer_1.saveField)(table, data);
        if (dataSaved.success) {
            return {
                success: dataSaved.success,
                message: 'Usuario creado satisfactoriamente'
            };
        }
        else
            return {
                success: dataSaved.success,
                message: 'No se ha podido guardar la información. Error: ' + dataSaved.message
            };
    }
    else
        return { message: admin.message };
});
exports.createUser = createUser;
const updateUser = (objectValues, objectWhere) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedData = yield (0, sqlServer_2.updateField)(table, objectValues, objectWhere);
    if (updatedData.success) {
        return { success: true, message: 'Usuario actualizado con exito' };
    }
    else
        return { success: false, message: 'Error al actualizar el usuario' };
});
exports.updateUser = updateUser;
