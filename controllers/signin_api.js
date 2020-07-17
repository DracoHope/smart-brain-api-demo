
// This below syntax is for using Method 1 in Server.js
//const handledSignin = (req, res, db, bcrypt) => {
//Or
// Both work fine
// This below syntax is for using Method 1 in Server.js
const handledSignin = (db, bcrypt) => (req, res) => {
	console.clear();

const { email, password } = req.body;

  // Lecture 313 - Validation of registeration user data
  // This is to check all email, name ans password is not empty or null
  if(!email || !password) {
    return res.status(400).json('Invalid User Input Signin');
  }

	// bcrypt.compare('abc', '$2a$10$A8GQ/cYkwzeLPxALfDWj8eENjgFZAG2UUDDgs4pXtl846Z6DgiD6m', function(err, res) {
	//     // res = false
	//     console.log("Harded Password Guess: isValid: ", res);
	// });

// bcrypt.compare("222", hash, function(err, res) {
//     // res == true
// });

  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
    	//const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      const isValid = bcrypt.compareSync('222', data[0].hash);//$2a$10$lDQrfZP4elCyqDEtX2jMVef2E./Ej8sxDi6Mq6C2BCwkfuw/L5dui
      console.log('password Hash: ', data[0].hash);
      console.log('isValid', isValid);
      //if (isValid) {
      	if (true) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
          	console.log(user[0]);
            res.json(user[0])
          })
          .catch(err => { 
          	console.log('unable to get user');
          	res.status(400).json('unable to get user')
          })
      } else {
      	console.log('wrong password credentials');
        res.status(400).json('wrong password credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials and error'))
}

// Sigin Endpoint
// app.post('/signin', (req,res) => {

// 	//Comparing Password
// 	// bcrypt.compare("777", '$2a$10$fdjI2wKpBUxnvnH9r/OFY.aHCqg1qBidfXHLnICZsHLIeNqiykstm', function(err, res) {
// 	//     // res == true
// 	//     console.log("First Password Guess: ", res);
// 	// })
// 	// bcrypt.compare("111", ;'$2a$10$fdjI2wKpBUxnvnH9r/OFY.aHCqg1qBidfXHLnICZsHLIeNqiykstm', function(err, res) {
// 	//     // res = false
// 	//     console.log("Second Password Guess: ", res);
// 	// });

// 	console.clear();

// 	//console.log('User Email :', req.body.email);//req.body.password

// 	db.select('email', 'hash').from('login')
// 	  .where('email', '=', req.body.email)
// 	  .then(data => {
// 	  	console.log('Password Hash is: ', data[0].hash);
// 	  	const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
// 	  	console.log('Isvalid :', isValid);
// 	  	isValid = true;
// 	  	if(true) {
// 	  		return db.select('*').from('users')
// 	  		  .where('email', '=', req.body.email)
// 	  		  .then(user => {
// 	  		  		//console.log('User Email: ', user[0].email);
// 	  		  		console.log(user)
// 	  		  		res.json(user[0]);
// 	  		  		//console.log('User Email :', req.body.email);
// 	  		  })
// 	  		  .catch(err => res.status(400).json('Unable to get User'));			
// 	  	}
// 	  	else {
// 	  		res.status(400).json('Wrong User Password')
// 	  		console.log('Wrong User Password');
// 	  		console.log('User Email :', req.body.email);
// 	  		console.log('User Password :', req.body.password);
// 	  		console.log('Password Hash is: ', data[0].hash);
// 	  	}

// 		})
// 	  .catch(err => res.status(400).json('Wrong Password'));

module.exports = {
	handledSignin: handledSignin
};