const bcrypt = require('bcrypt');
// const bcrypt = require('bcrypt');

const saltRounds = 10; // Number of salt rounds for hashing

// // Function to generate a bcrypt hash from a password
function generateHash(password) {
  let passhash= bcrypt.hashSync(password, saltRounds);
console.log('passhash',passhash);

  return passhash
}

// Function to compare a password with a bcrypt hash
function comparePassword(password, hash) {
   let com= bcrypt.compareSync(password, hash);
  console.log('passsssssss',password);
  return com

}

// // Example usage
const password1 = '123';

// // Generate a hash from the password
const hash = generateHash(password1);

console.log('Hash:', hash);

// Compare a password with the hash
const isMatch = comparePassword(password1, hash);

console.log('Password match:', isMatch);


// function comparePassword(password, storedHash) {
//   return bcrypt.compareSync(password, storedHash);
// }

// const userpassword = '$2b$10$pOqCAxmn2glWp.fNbT8Ux.2giRrWz.ItE38nrt2XqzTy3k8dXBLpu';
// const password = '123';

// const isMatch = comparePassword(password, userpassword);

// console.log('Password match:', isMatch);
;