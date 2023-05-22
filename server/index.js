let express=require('express');
let mysql=require('mysql');
let cors=require('cors');
const bcrypt = require('bcrypt');
const { log } = require('console');
const app=express();
app.use(express.json());
app.use(cors());


var connection=mysql.createConnection({
    host:'127.0.0.1',
    port:'3306',
    user:'thangam',
    password:'Thasan24',
    database:'test'
});

connection.connect();

app.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    // Generate a salt for the hash
    const saltRounds = 10; 
  
    // Hash the password using the salt
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    console.log('pas.....',hashedPassword);
  
    connection.query('INSERT INTO sign_in_details (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error storing user in MySQL database: ', err);
        res.sendStatus(500);
      } else {
        console.log('User stored in MySQL database!',result);
        res.send(JSON.stringify(result));

      }
    });
  });
  
  app.post('/signin',  (req, res) => {
    const { username, password } = req.body;
    console.log(password);

    // Retrieve the user from the database
    connection.query('SELECT * FROM sign_in_details WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Error retrieving user:', err);
        return res.sendStatus(500);
      }
  
      if (results.length === 0) {
        // User not found
        console.log('User not found');
        return res.sendStatus(401);
      }
  
      const user = results[0];
      console.log('user..',user.password);
  
      // Compare the provided password with the hashed password
      // let isMatch= bcrypt.compareSync(password, user.password);
      // console.log('isMatch',isMatch);

      function comparePassword(password, userpassword) {
        let com = bcrypt.compareSync(password, userpassword);
        console.log('Password:.........', password);
        console.log('User Password:', userpassword);
        console.log('Comparison Result:', com);
        return com;
      }
      
      const isMatch = comparePassword(String(password), String(user.password));

      
      console.log('Password match:', isMatch);
      

      // bcrypt.compareSync(password, user.password, (bcryptErr, match) => {
        // console.log('pas,,,,,,,,,',password);
        // console.log('pas,,,,,,,,,',user.password);
        // if (bcryptErr) {
        //   console.error('Error comparing passwords:', bcryptErr);
        //   return res.sendStatus(500);
        // }
       
        if (!isMatch) {
          // Passwords do not match
          console.log('Invalid password');
          return res.status(401).json({ message: 'Invalid password' });
        }
  
        // Successful sign-in
        console.log('Sign-in successful');
        return res.status(200).json({ success: true, message: 'Sign-in successful' });
      });
    // });
  });
  
  app.listen(3000, () => {  
    console.log('Express app listening on port 3000!');
  });