import express, { Express, Request, Response } from 'express';
import * as mysql from 'mysql';
import bcrypt from 'bcrypt';
// import cors from 'cors';
const cors = require('cors');
const express = require('express');
import * as nodemailer from 'nodemailer';



import { v4 as uuidv4 } from 'uuid';
const verificationToken = uuidv4();
console.log(verificationToken);

class DataBase {
  private _connection: mysql.Connection;

  constructor() {
    this._connection = mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'thangam',
      password: 'Thasan24',
      database: 'test',
    });

    this._connection.connect((err) => {
      if (err) {
        console.log('Error connecting to Db');
        return;
      } else {
        console.log('Connection established');
      }
    }); 
}

  get connection() {
  return this._connection;
}
}

class App {
  public express: Express;
  private _db: DataBase;

  constructor() {
    this.express = express();
    this.express.use(express.json());
    this._db = new DataBase();
    this.express.use(cors());

    this.express.post('/adduser', (req: Request, res: Response) =>
      this.addUser(req, res)
    );
    this.listen(3000);
  }

  public addUser(req: Request, res: Response): any {
    const { email, password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const saltRounds = 10;
    console.log('password:', password);
    console.log('saltRounds:', saltRounds);

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    console.log('hashedPassword:', hashedPassword);

    let sql: string = "INSERT INTO sign_up (email, password) VALUES (?, ?)";
    this._db.connection.query(sql, [email, hashedPassword], (err: any, result: any) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.json(result);
      }
    });
  }

  public listen(port: number) {
    this.express.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}

const app = new App();


class sendEmail {
  transporter: any;
  constructor() {
    this.transporter =nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Your Mail',
        pass: 'Your Password',
      },
    });
    this.sendEmail();
  }
   
  emailMessage = {
    from: 'Your Mail',
    to: 'User Mail',
    subject: 'Email Verification',
    html: `
      <p>Please click the following link to verify your email:</p>
      <a href="https://yourwebsite.com/verify?token=${verificationToken}">Verify Email</a>
    `,
  };
  sendEmail() {
    this.transporter.sendMail(this.emailMessage, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
  
}
let sendemail = new sendEmail();


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


