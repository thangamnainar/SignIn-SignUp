"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import express, { Express, Request, Response } from 'express';
// import mysql, { Connection, MysqlError } from 'mysql';
// import dotenv from 'dotenv';
// import cors from 'cors';
var express = require('express');
var mysql = require("mysql");
var cors = require('cors');
var bcrypt = require('bcrypt');
var DataBase = /** @class */ (function () {
    function DataBase() {
        this._connection = mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'thangam',
            password: 'Thasan24',
            database: 'test',
        });
        this._connection.connect();
    }
    Object.defineProperty(DataBase.prototype, "connection", {
        get: function () {
            return this._connection;
        },
        enumerable: false,
        configurable: true
    });
    return DataBase;
}());
var ExpressApp = /** @class */ (function () {
    function ExpressApp() {
        var _this = this;
        this.app = express();
        this.app.use(express.json());
        this.dataBase = new DataBase();
        this.app.use(cors({
            origin: 'http://localhost:4200',
        }));
        // this.app.get('/getUser', (req: Request, res: Response) => this.getUser(req, res));
        this.app.get('/getAllUser', function (req, res) { return _this.getAllUser(req, res); });
        this.app.post('/adduser', function (req, res) { return _this.addUser(req, res); });
        this.app.put('/updateuser', function (req, res) { return _this.updateUser(req, res); });
        this.listen();
    }
    ExpressApp.prototype.getUser = function (req, res) {
        var id = req.body.id;
        var sql = "select * from sign_in_details where id = ?";
        this.dataBase.connection.query(sql, [id], function (err, result) {
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
    };
    ExpressApp.prototype.getAllUser = function (req, res) {
        var sql = "select * from sign_in_details";
        this.dataBase.connection.query(sql, function (err, result) {
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
    };
    ExpressApp.prototype.addUser = function (req, res) {
        var _a = req.body, username = _a.username, password = _a.password;
        var saltRounds = 10;
        var hashedPassword = bcrypt.hashSync(password, saltRounds);
        console.log('pas.....', hashedPassword);
        var sql = "insert into sign_in_details (username,password) values(?,?)";
        this.dataBase.connection.query(sql, [username, hashedPassword], function (err, result) {
            if (err) {
                console.log(err);
                res.end();
            }
            else {
                res.json(result);
            }
        });
    };
    ExpressApp.prototype.updateUser = function (req, res) {
        var _a = req.body, username = _a.username, password = _a.password, id = _a.id;
        var sql = "update sign_in_details set username = ?, password = ? where id = ?";
        this.dataBase.connection.query(sql, [username, password, id], function (err, result) {
            if (err) {
                console.log(err);
                res.end();
            }
            else {
                res.json(result);
            }
        });
    };
    ExpressApp.prototype.listen = function () {
        this.app.listen(3000, function () {
            console.log('app running on port:3000');
        });
    };
    return ExpressApp;
}());
var app = new ExpressApp();
