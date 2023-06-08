"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var bcrypt_1 = require("bcrypt");
// import cors from 'cors';
var cors = require('cors');
var express = require('express');
var nodemailer = require("nodemailer");
var uuid_1 = require("uuid");
var verificationToken = (0, uuid_1.v4)();
console.log(verificationToken);
var DataBase = /** @class */ (function () {
    function DataBase() {
        this._connection = mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'thangam',
            password: 'Thasan24',
            database: 'test',
        });
        this._connection.connect(function (err) {
            if (err) {
                console.log('Error connecting to Db');
                return;
            }
            else {
                console.log('Connection established');
            }
        });
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
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.express = express();
        this.express.use(express.json());
        this._db = new DataBase();
        this.express.use(cors());
        this.express.post('/adduser', function (req, res) {
            return _this.addUser(req, res);
        });
        this.listen(3000);
    }
    App.prototype.addUser = function (req, res) {
        var _a = req.body, email = _a.email, password = _a.password;
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        var saltRounds = 10;
        console.log('password:', password);
        console.log('saltRounds:', saltRounds);
        var hashedPassword = bcrypt_1.default.hashSync(password, saltRounds);
        console.log('hashedPassword:', hashedPassword);
        var sql = "INSERT INTO sign_up (email, password) VALUES (?, ?)";
        this._db.connection.query(sql, [email, hashedPassword], function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'An error occurred' });
            }
            else {
                res.json(result);
            }
        });
    };
    App.prototype.listen = function (port) {
        this.express.listen(port, function () {
            console.log("Server listening on port ".concat(port));
        });
    };
    return App;
}());
var app = new App();
var sendEmail = /** @class */ (function () {
    function sendEmail() {
        this.emailMessage = {
            from: 'Your Mail',
            to: 'User Mail',
            subject: 'Email Verification',
            html: "\n      <p>Please click the following link to verify your email:</p>\n      <a href=\"https://yourwebsite.com/verify?token=".concat(verificationToken, "\">Verify Email</a>\n    "),
        };
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'Your Mail',
                pass: 'Your Password',
            },
        });
        this.sendEmail();
    }
    sendEmail.prototype.sendEmail = function () {
        this.transporter.sendMail(this.emailMessage, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent:', info.response);
            }
        });
    };
    return sendEmail;
}());
var sendemail = new sendEmail();
// Create a nodemailer transporter with your email provider's configuration
// Compose the email message
// Send the email
// this.express.get('/verify', (req: Request, res: Response) => {
//   const { token } = req.query;
//   // Retrieve the user record from the database using the verification token
//   // Compare the token with the one stored in the database
//   // If they match, update the user record to mark the email as verified
//   // Example implementation
//   const sql = 'UPDATE sign_up SET email_verified = true WHERE verification_token = ?';
//   this._db.connection.query(sql, [token], (err: any, result: any) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json({ error: 'An error occurred' });
//     } else {
//       res.send('Email verified successfully!');
//     }
//   });
// });
