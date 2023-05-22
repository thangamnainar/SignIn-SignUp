"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
// import dotenv from 'dotenv';
// import cors from 'cors';
class DataBase {
    constructor() {
        this._connection = mysql_1.default.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'thangam',
            password: 'Thasan24',
            database: 'test',
        });
        this._connection.connect();
    }
    get connection() {
        return this._connection;
    }
}
class ExpressApp {
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.dataBase = new DataBase();
        this.app.get('/getUser', (req, res) => this.getUser(req, res));
        this.app.get('/getAllUser', (req, res) => this.getAllUser(req, res));
        // this.app.post('/adduser', (req: Request, res: Response) => this.addUser(req, res));
        this.listen();
    }
    getUser(req, res) {
        const { id } = req.body;
        let sql = `select * from sign_in_details where id = ?`;
        this.dataBase.connection.query(sql, [id], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                if (result.length > 0) {
                    res.json(result);
                }
                else {
                    res.json({ message: "No User Found" });
                }
            }
        });
    }
    getAllUser(req, res) {
        let sql = "select * from sign_in_details";
        this.dataBase.connection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                if (result.length > 0) {
                    res.json(result);
                }
                else {
                    res.json({ message: "No User Found" });
                }
            }
        });
    }
    addUser(req, res) {
        const { name, email, password } = req.body;
        let sql = "insert into users (name,mail,password) values(?, ?, ?)";
        this.dataBase.connection.query(sql, [name, email, password], (err, result) => {
            if (err) {
                console.log(err);
                res.end();
            }
            else {
                res.json(result);
            }
        });
    }
    listen() {
        this.app.listen(3000, () => {
            console.log('app running on port:3000');
        });
    }
}
let app = new ExpressApp();
