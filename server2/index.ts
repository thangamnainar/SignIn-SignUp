import express, { Express, Request, Response } from 'express';
import mysql, { Connection, MysqlError } from 'mysql';
// import dotenv from 'dotenv';
// import cors from 'cors';

class DataBase {
    private _connection: mysql.Connection;  
    constructor() {
        this._connection = mysql.createConnection({
            host: '127.0.0.1',
            port: 3306, // Provide a valid number for the port
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
    public app: Express;
    public dataBase: DataBase;
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.dataBase = new DataBase();
        this.app.get('/getUser', (req: Request, res: Response) => this.getUser(req, res));
        this.app.get('/getAllUser', (req: Request, res: Response) => this.getAllUser(req, res));
        // this.app.post('/adduser', (req: Request, res: Response) => this.addUser(req, res));
        this.listen();
    }

    public getUser(req: Request, res: Response): any {
        const  {id}  = req.body;
        let sql = `select * from sign_in_details where id = ?`
        this.dataBase.connection.query(sql, [id],(err: any, result: any) => {
            if (err) {
                console.log(err);
            } else {
                if (result.length > 0){
                    res.json(result);
                }else{
                    res.json({message:"No User Found"});
                }
            }
        })
    }
    public getAllUser(req: Request, res: Response): any {
        let sql = "select * from sign_in_details"
        this.dataBase.connection.query(sql, (err: any, result: any) => {
            if (err) {
                console.log(err);
            } else {
                if (result.length > 0){
                    res.json(result);
                }else{
                    res.json({message:"No User Found"});
                }
            }
        })
    }
    public addUser(req: Request, res: Response): any {
        const { name, email, password } = req.body;
        let sql: string = "insert into users (name,mail,password) values(?, ?, ?)";
        this.dataBase.connection.query(sql, [name, email, password], (err: any, result: any) => {
            if (err) {
                console.log(err);
                res.end();
            } else {
                res.json(result);
            }
        })
    }

    public listen() {
        this.app.listen(3000, () => {
            console.log('app running on port:3000');
        })
    }

}

let app = new ExpressApp();