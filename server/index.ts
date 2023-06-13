// import express, { Express, Request, Response } from 'express';
// import mysql, { Connection, MysqlError } from 'mysql';
// import dotenv from 'dotenv';
// import cors from 'cors';
const express = require('express');
import { Express, Request, Response } from 'express';
import * as mysql from 'mysql';
const cors = require('cors');
const bcrypt = require('bcrypt');

class DataBase {
    private _connection: mysql.Connection;  
    constructor() {
        this._connection = mysql.createConnection({
            host: 'YOUR_HOST',
            port: 3306, // Provide a valid number for the port
            user: 'YOUR_USER_NAME',
            password: 'YOUR_PASSWORD',
            database: 'YOUR_DATABASE_NAME',
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
        this.app.use(cors({
            origin: 'http://localhost:4200',
          }));

        // this.app.get('/getUser', (req: Request, res: Response) => this.getUser(req, res));
        this.app.get('/getAllUser', (req: Request, res: Response) => this.getAllUser(req, res));
        this.app.post('/adduser', (req: Request, res: Response) => this.addUser(req, res));
        this.app.put('/updateuser', (req: Request, res: Response) => this.updateUser(req, res));
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
        const { username, password } = req.body;
        const saltRounds = 10; 
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        console.log('pas.....',hashedPassword);
        let sql: string = "insert into sign_in_details (username,password) values(?,?)";
        this.dataBase.connection.query(sql, [username, hashedPassword], (err: any, result: any) => {
            if (err) {
                console.log(err);
                res.end();
            } else {
                res.json(result);
            }
        })
    }
    public updateUser(req: Request, res: Response): any {
        const { username, password, id } = req.body;
        let sql: string = "update sign_in_details set username = ?, password = ? where id = ?";
        
        this.dataBase.connection.query(sql, [username, password, id], (err: any, result: any) => {
          if (err) {
            console.log(err);
            res.end();
          } else {
            res.json(result);
          }
        });
      }
      

    public listen() {
        this.app.listen(3000, () => {
            console.log('app running on port:3000');
        })
    }

  
      

}

let app = new ExpressApp();