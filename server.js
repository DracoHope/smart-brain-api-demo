const express = require('express');

// Whenever we need to deal with JSON, weneed to have the Body Parser
const bodyParser = require('body-parser');

// Import bcrypt-nodejs for Password Hash and Compare
const bcrypt = require('bcrypt-nodejs');
//const bcrypt = require('bcrypt-nodejs');

// Import Cors
const cors = require('cors');

// Refer to Lecture 311 - Transfer the register endpoint to the Controller folder
const register = require('./controllers/register_api.js');

const signin = require('./controllers/signin_api.js');

const profile = require('./controllers/profile_api.js');


const image = require('./controllers/image_api.js');

// This is just to clear the console screen whenever we restart the server
console.clear();


const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smart-brain'
  }
});

db.select('*').from('users').then(data => {
	console.log(data);
});

//console.log(postgres.select('*').from('users'));



console.log("Welcome this is my Express Server App")

// Using res.json because Express support this method and it has more function 
// Signin Endpoint is for user to signin into the page
// Therefore we are going to check whatever the user have enter on the front end 
// and all this user info will come back here in this response or in the request
// Then we need to check it with our current list of users to 
// make sure that their userId and password is matched or not
// Therefore we need a Database. 
// Since currently we do not have a database then we can just create a variable for now

const database = {

	users: [

		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: '123',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Serene',
			email: 'serene@gmail.com',
			password: '888',
			entries: 0,
			joined: new Date()
		}
	],

	login: [
		{
			id: '',
			hash: '',
			email: ''
		}
	]

}

const app = express();

// This Body-Paser must be declare only after the Express "app" been declare first
// Because Body Parser is a Middleware therefore we need to implement it with the app.use() keyword
// We can only do this only when the "const app = express();" have been created first else will have error
app.use(bodyParser.json());


app.use(cors());

//Create all the GET, POST, PUT, DELETE ...etc API here

// GET API
// app.get('/', (req, res) => {
// 	res.send(['I am Ming Server!!! This is the Root Directory: http://localhost:2900/', 'Glad to see you here!!!']);
// })

/*
Objective: Designing of our Endpoint and API

1.	Want to have a root route to display Page is Working
	This should be a GET Request API
	We should response with a Display Message that this Server is Working

2. 	Want to have a SignIn Page
	This Should be a POST Request API
	Take note: Whenever Signin is require we can only use POST instead of GETdue to security reason 
	We should response with a Success or Fail staus

3. 	Want to have a Register Page
	This should be a POST Request because we be creating and store new user information into our Express Server
	We should response with the newly created user object to the user for verification

4. 	Want to have a Home screen to allow the user to access their "/profile" of the user
	Ww will include a parameter of userId in order to get the respective user information
	The end point should be something like thid "/profile/:userId"
	This can be a GET Request or POST Request is security is require
	We will response with the user object

5. 	We also want to rank the user by their submission of the images.
	We want the user to submit their photo.
	This should be a PUT Request because the user already exist. 
	The user just need to update their user info with the new submited photo
	We be response with the newly updating user updated object

*/

// *****************************************************************************************
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


 //  db.select('email', 'hash').from('login')
 //    .where('email', '=', req.body.email)
 //    .then(data => {
 //      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
 //      console.log('password Hash: ', data[0].hash);
 //      console.log('isValid', isValid);
 //      if (isValid) {
 //        return db.select('*').from('users')
 //          .where('email', '=', req.body.email)
 //          .then(user => {
 //            res.json(user[0])
 //          })
 //          .catch(err => res.status(400).json('unable to get user'))
 //      } else {
 //        res.status(400).json('wrong credentials')
 //      }
 //    })


	// bcrypt.compare("111", '$2a$10$fdjI2wKpBUxnvnH9r/OFY.aHCqg1qBidfXHLnICZsHLIeNqiykstm', function(err, res) {
	//     // res = false
	//     console.log("Second Password Guess: ", res);
	// });
//**************************************************************************
// This below is Method 1 is working
	//app.post('/signin', (req, res) => { signin.handledSignin(req,res,db, bcrypt) })

// Or Method 2 - this is actually using the currying advance javascript method
// After execting the "handledSignin(db, bcrypt)" function then (req, res) will automatically be called
 	app.post('/signin', signin.handledSignin(db, bcrypt))


// Referring to Lecture 311 - Transfer Signin API to Controller Folder
// Need to fix this Bcrypt anthenication fail problem
// app.post('/signin', (req, res) => {

// 	console.clear();

// 	bcrypt.compare('abc', '$2a$10$A8GQ/cYkwzeLPxALfDWj8eENjgFZAG2UUDDgs4pXtl846Z6DgiD6m', function(err, res) {
// 	    // res = false
// 	    console.log("Harded Password Guess: isValid: ", res);
// 	});

// // bcrypt.compare("222", hash, function(err, res) {
// //     // res == true
// // });

//   db.select('email', 'hash').from('login')
//     .where('email', '=', req.body.email)
//     .then(data => {
//     	//const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
//       const isValid = bcrypt.compareSync('222', data[0].hash);//$2a$10$lDQrfZP4elCyqDEtX2jMVef2E./Ej8sxDi6Mq6C2BCwkfuw/L5dui
//       console.log('password Hash: ', data[0].hash);
//       console.log('isValid', isValid);
//       //if (isValid) {
//       	if (true) {
//         return db.select('*').from('users')
//           .where('email', '=', req.body.email)
//           .then(user => {
//           	console.log(user[0]);
//             res.json(user[0])
//           })
//           .catch(err => { 
//           	console.log('unable to get user');
//           	res.status(400).json('unable to get user')
//           })
//       } else {
//       	console.log('wrong password credentials');
//         res.status(400).json('wrong password credentials')
//       }
//     })
//     .catch(err => res.status(400).json('wrong credentials and error'))
// })
// ***********************************************************************************

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

// 	 //  	if(isValid) {

// 	 //  		db.select('*').from('users')
// 	 //  		  .where('email', '=', req.body.email)
// 		//   	  .then(user => {
// 		//   	  	res.json(user[0])
// 		//   	  })
// 		// .catch(err => res.status(400).json('Unable to get User'))
// 	 //  }

// 	//res.send('You are in Signin Page!!!');
// 	// Built in JSON function in Express Server
// 	// This json() method can send JSON object and any Text as String as well
	
// // 	if(req.body.email === database.users[0].email &&
// // 		req.body.password === database.users[0].password) {
// // 		// Refer to Lecture 285
// // // 		In server.js:
// // // in the signin: After the if statement:
// // // res.json(database.users[0]); instead of res.json("success"). 
// // 		//res.status(200).json('SignIn Successful'); 
// // 		res.json(database.users[0]);
// // 		console.log("SignIn Successful");
// // 	  } else {
// // 	  	res.status(400).json('SignIn Fail!!!');
// // 	  	console.log("SignIn Fail");
// // 	  	}

// 	  	//res.json('JSON Object'); 
// })

// Sigin Endpoint
// app.post('/signin', (req,res) => {

// 	//Comparing Password
// 	// bcrypt.compare("777", '$2a$10$fdjI2wKpBUxnvnH9r/OFY.aHCqg1qBidfXHLnICZsHLIeNqiykstm', function(err, res) {
// 	//     // res == true
// 	//     console.log("First Password Guess: ", res);
// 	// });
// 	// bcrypt.compare("111", '$2a$10$fdjI2wKpBUxnvnH9r/OFY.aHCqg1qBidfXHLnICZsHLIeNqiykstm', function(err, res) {
// 	//     // res = false
// 	//     console.log("Second Password Guess: ", res);
// 	// });


// 	//res.send('You are in Signin Page!!!');
// 	// Built in JSON function in Express Server
// 	// This json() method can send JSON object and any Text as String as well
	
// 	if(req.body.email === database.users[0].email &&
// 		req.body.password === database.users[0].password) {
// 		// Refer to Lecture 285
// // 		In server.js:
// // in the signin: After the if statement:
// // res.json(database.users[0]); instead of res.json("success"). 
// 		//res.status(200).json('SignIn Successful'); 
// 		res.json(database.users[0]);
// 		console.log("SignIn Successful");
// 	  } else {
// 	  	res.status(400).json('SignIn Fail!!!');
// 	  	console.log("SignIn Fail");
// 	  	}

// 	  	//res.json('JSON Object'); 
// })

// *****************************************************************************************
// bcrypt-nodejs Asynchronous - To convert the password into a hash code then save it into the database
// The password is never a readable string anymore. It is in hash code by bcrypt-node-js
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// Register Endpoint

// We be using the Bcrypt Synchronous Method to Hash the password
// This mean the password will be Hash completed before any other command will be executed
// This a simplier and easier
// Synchronous
// var hash = bcrypt.hashSync("bacon");
// bcrypt.compareSync("bacon", hash); // true
// bcrypt.compareSync("veggies", hash); // false 

// *********************************************************************************
// Working code Lecture 311 - code review moved this function to "register_api.js"

// Referring to Lecture 309 for Knex Transaction for multiple database opertion
// This is very important 

// Referring to Lecture 311 - We can pass in the Knex, bcrypt, req and res to the handledRegister function in the controller folder
// This is known as Dependencies Injection
//app.post('/register', register_api.handledRegister)
app.post('/register', (req, res) => { register.handledRegister(req, res, db, bcrypt) })

// app.post('/register', (req,res) => {
// 	//res.send('You are in Register Page!!!');
// 	// Using destructuring
// 	const {name, email, password} = req.body;


// 	// Below is the Asynchronous Bcrypt Method
// 	// Encrypt the password by bcrypt cinvert the password into a hascode
// 	// bcrypt.hash(password, null, null, function(err, hash) {
// 	// 	// The password has been converted into hascode and save in variable "hash"
// 	// 	console.log("Registered Password in Hascode: ", hash);
// 	// });
// 	// This Array "push()" method is to add in new object into the Array
// 	// https://www.w3schools.com/php/func_array_push.asp
// 	// Syntax: array_push(array, value1, value2, ...)
// 	// database.users.push(
// 	// 	{
// 	// 		id: '125',
// 	// 		name: name,
// 	// 		email: email,
// 	// 		password: password,
// 	// 		entries: 0,
// 	// 		joined: new Date()
// 	// 	})

// 	// We be using the Knex to connect to the Postgres Database
// 	//knex('books').insert({title: 'Slaughterhouse Five'})

// 	// We be using the Bcrypt Synchronous Method for our demo
// 	// This hash password will be save nto the Database Login Table
// 	// smart-brain=# select * from login;
// 	//  id | hash | email
// 	// ----+------+-------
// 	// The "id" is of serial datatype so it is auto incremented 
// 	// We only need to insert hash password and the email into the login table

// 	const hash = bcrypt.hashSync("password");

// 	// We want to insert the registered user into the users database table and
// 	// also into the login table. 
// 	// We must have a way to make sure both table have been inserted
// 	// How to do that?
// 	// We be using the transaction. 
// 	// This s a code block when we doing multiple operation, when one fail then all other operation will also fail
// 	// This mean when user info fail to insert into users table then login insertion will also fail. This is to be consistencies.

// 	// We be using the Knex Transaction function
// 	// http://knexjs.org/#Builder-increment
// 	// 	Transactions are an important feature of relational databases, as they allow correct recovery from failures and keep a database consistent even in cases of system failure. 
// 	// 	All queries within a transaction are executed on the same database connection, and run the entire set of queries as a single unit of work. Any failure will mean the database will rollback any queries executed on that connection to the pre-transaction state.
// 	// Transactions are handled by passing a handler function into knex.transaction. The handler function accepts a single argument, an object which may be used in two ways:
// 	// As the "promise aware" knex connection
// 	// As an object passed into a query with and eventually call commit or rollback.
// 	// Example Code:
// 	// Using trx as a query builder:
// 	// knex.transaction(function(trx) {

// 	// Using trx as a transaction object:
// 	// knex.transaction(function(trx) {

// 	//   const books = [
// 	//     {title: 'Canterbury Tales'},
// 	//     {title: 'Moby Dick'},
// 	//     {title: 'Hamlet'}
// 	//   ];

// 	//   knex.insert({name: 'Old Books'}, 'id')
// 	//     .into('catalogues')
// 	//     .transacting(trx)
// 	//     .then(function(ids) {
// 	//       books.forEach((book) => book.catalogue_id = ids[0]);
// 	//       return knex('books').insert(books).transacting(trx);
// 	//     })
// 	//     .then(trx.commit)
// 	//     .catch(trx.rollback);
// 	// })
// 	// .then(function(inserts) {
// 	//   console.log(inserts.length + ' new books saved.');
// 	// })
// 	// .catch(function(error) {
// 	//   // If we get here, that means that neither the 'Old Books' catalogues insert,
// 	//   // nor any of the books inserts will have taken place.
// 	//   console.error(error);
// 	// });

// 	// Using Knex Transaction
// 	// The 'trx' is a parameter represent the transaction
// 	db.transaction(trx => {
// 		// The first transaction we want to insert into the login table
// 		trx.insert({
// 			hash: hash,
// 			email: email
// 		})
// 		.into('login')
// 		.returning('email')	// this 'returning' is the feature for Knex
// 		.then(loginEmail => {	// using the returning 'email' to insert into the users table
// 			 return trx('users')
// 					.returning('*')
// 					.insert({
// 						name: name,
// 						//email: loginEmail,	// The return 'loginEmail is an Array so we need to specified
// 											// loginEmail[0] else we will get this '{"April@yahoo.com"} 
// 											// instead of just "April@yahoo.com"
// 						email: loginEmail[0],
// 						joined: new Date()
// 				  }).then(user => {
// 					res.json(user[0]);
// 					})
// 		})
// 		 .then(trx.commit)
// 	    .catch(trx.rollback);
// 	})
// 	.catch(err => res.status(400).json('Create User Unsuccessful!!!'))

// 				// return db('users')
// 				// .returning('*')
// 				// .insert({
// 				// 	name: name,
// 				// 	email: email,
// 				// 	joined: new Date()
// 				// }).then(user => {
// 				// 	res.json(user[0]);
// 				// })
// 				// .catch(err => res.status(400).json('Create User Unsuccessful!!!'))

// 		// This code is actually better such that it contain more info of the Error
// 		// But we do not want to user at the Web Browser end to know the structure of our database
// 		//.catch(err => res.status(400).json(err))
// })
// ***************** End of working Code Lecture 311 ********************
// *********************************************************************************

// app.post('/register', (req,res) => { 
// 	//res.send('You are in Register Page!!!');
// 	// Using destructuring
// 	const {name, email, password} = req.body;


// 	// Below is the Asynchronous Bcrypt Method
// 	// Encrypt the password by bcrypt cinvert the password into a hascode
// 	// bcrypt.hash(password, null, null, function(err, hash) {
// 	// 	// The password has been converted into hascode and save in variable "hash"
// 	// 	console.log("Registered Password in Hascode: ", hash);
// 	// });
// 	// This Array "push()" method is to add in new object into the Array
// 	// https://www.w3schools.com/php/func_array_push.asp
// 	// Syntax: array_push(array, value1, value2, ...)
// 	// database.users.push(
// 	// 	{
// 	// 		id: '125',
// 	// 		name: name,
// 	// 		email: email,
// 	// 		password: password,
// 	// 		entries: 0,
// 	// 		joined: new Date()
// 	// 	})

// 	// We be using the Knex to connect to the Postgres Database
// 	//knex('books').insert({title: 'Slaughterhouse Five'})

// 	// We be using the Bcrypt Synchronous Method for our demo
// 	// This hash password will be save nto the Database Login Table
// 	// smart-brain=# select * from login;
// 	//  id | hash | email
// 	// ----+------+-------
// 	// The "id" is of serial datatype so it is auto incremented 
// 	// We only need to insert hash password and the email into the login table

// 	const hash = bcrypt.hashSync("password");



// 		return db('users')
// 		.returning('*')
// 		.insert({
// 			name: name,
// 			email: email,
// 			joined: new Date()
// 		}).then(user => {
// 			res.json(user[0]);
// 		})
// 		.catch(err => res.status(400).json('Create User Unsuccessful!!!'))

// 		// This code is actually better such that it contain more info of the Error
// 		// But we do not want to user at the Web Browser end to know the structure of our database
// 		//.catch(err => res.status(400).json(err))
// })


// app.post('/register', (req,res) => {
// 	//res.send('You are in Register Page!!!');
// 	// Using destructuring
// 	const {name, email, password} = req.body;

// 	// Encrypt the password by bcrypt cinvert the password into a hascode
// 	bcrypt.hash(password, null, null, function(err, hash) {
// 		// The password has been converted into hascode and save in variable "hash"
// 		console.log("Registered Password in Hascode: ", hash);
// 	});
// 	// This Array "push()" method is to add in new object into the Array
// 	// https://www.w3schools.com/php/func_array_push.asp
// 	// Syntax: array_push(array, value1, value2, ...)
// 	// database.users.push(
// 	// 	{
// 	// 		id: '125',
// 	// 		name: name,
// 	// 		email: email,
// 	// 		password: password,
// 	// 		entries: 0,
// 	// 		joined: new Date()
// 	// 	})

// 	// We be using the Knex to connect to the Postgres Database
// 	//knex('books').insert({title: 'Slaughterhouse Five'})
// 	db('users').insert({
// 			name: name,
// 			email: email,
// 			joined: new Date()
// 		}).then(console.log)

// 	res.json(database.users[database.users.length -1]);
// })


// app.post('/register', (req,res) => {
// 	//res.send('You are in Register Page!!!');
// 	// Using destructuring
// 	const {name, email, password} = req.body;

// 	// Encrypt the password by bcrypt cinvert the password into a hascode
// 	bcrypt.hash(password, null, null, function(err, hash) {
// 		// The password has been converted into hascode and save in variable "hash"
// 		console.log("Registered Password in Hascode: ", hash);
// 	});
// 	// This Array "push()" method is to add in new object into the Array
// 	// https://www.w3schools.com/php/func_array_push.asp
// 	// Syntax: array_push(array, value1, value2, ...)
// 	database.users.push(
// 		{
// 			id: '125',
// 			name: name,
// 			email: email,
// 			password: password,
// 			entries: 0,
// 			joined: new Date()
// 		})
// 	res.json(database.users[database.users.length -1]);
// })

// *****************************************************************************************

// Root Endpoint
// GET API
app.get('/', (req, res) => {
	//res.send(['I am Ming Server!!! This is the Root Directory: http://localhost:2900/', 'Glad to see you here!!!']);
	// send all user information to the Request Web Browser
	res.send(database.users);
})

// Profile Endpoint - get user info by it id
// Example of Knex SQL
// knex('users').where({
//   first_name: 'Test',
//   last_name:  'User'
// }).select('id')



// *********************************************************************************
// Referring to Lecture 311 - Transfer this Profile api to the controllers folder

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

// Include checking of empty array
// app.get('/profile/:id', (req, res) => {
// 	const {id} = req.params;
// 	let found = false;

// 	// This is similar to SQL
// 	// Select * from users where ID = id
// 	// Where ID is the Database Column
// 	// The id is the input parameter
// 	db.select('*').from('users').where({
// 		id: id
// 	})
// 	.then(user => {
// 		console.log(user);

// 		if(user.length) { // If not an empty array then return the user object
// 			// The response is an Array so we just grab the first element
// 			res.json(user[0])
// 		}	else {
// 			res.status(400).json('User with ID: ' + id + ' not Found');
// 			console.log('User with ID: ' + id + ' not Found');
// 		}

// 	})
// 	.catch(err => res.status(400).json('Error Getting User Info!!!'))

// 	// In Javascript - an Empty Array will not create an error therefore the '.catch()' did not catch any error
// 	// Boolean([]) -> this result in True in Javascript therefore an empty array not consider a Error

// 	// db.select('*').from('users').then(user => {
// 	// 	console.log(user);
// 	// })

// 	// This condition must be out of the forEach Loop else it willalways be executed
// 	// if(!found) {
// 	// 	res.status(404).json('User Not Found!!!')
// 	// }
// })
// *********************************************************************************




// app.get('/profile/:id', (req, res) => {
// 	const {id} = req.params;
// 	let found = false;

// 	// This is similar to SQL
// 	// Select * from users where ID = id
// 	// Where ID is the Database Column
// 	// The id is the input parameter
// 	db.select('*').from('users').where({
// 		id: id
// 	})
// 	.then(user => {
// 		console.log(user);
// 		// The response is an Array so we just grab the first element
// 		res.json(user[0])
// 	})
// 	.catch(err => res.status(400).json('User with ID: ' + id + ' not Found'))

// 	// In Javascript - an Empty Array will not create an error therefore the '.catch()' did not catch any error
// 	// Boolean([]) -> this result in True in Javascript therefore an empty array not consider a Error

// 	// db.select('*').from('users').then(user => {
// 	// 	console.log(user);
// 	// })

// 	// This condition must be out of the forEach Loop else it willalways be executed
// 	// if(!found) {
// 	// 	res.status(404).json('User Not Found!!!')
// 	// }
// })


// app.get('/profile/:id', (req, res) => {
// 	const {id} = req.params;
// 	let found = false;
// 	database.users.forEach(user => {
// 		if(user.id === id) {
// 			found = true;
// 			return res.json(user);
// 		} 
// 	})//End of forEach Loop

// 	// This condition must be out of the forEach Loop else it willalways be executed
// 	if(!found) {
// 		res.status(404).json('User Not Found!!!')
// 	}
// })

// *****************************************************************************************

// We be updatig the ertries state of the user object
// Using the Knex update syntax
// knex('books')
//   .where('published_date', '<', 2000)
//   .update({
//     status: 'archived',
//     thisKeyIsSkipped: undefined
//   })
// And the Knex Increment Command
// increment — .increment(column, amount)
// Increments a column value by the specified amount. Object syntax is supported for column.


//*********************************************************************************************
// Referring to Lecture 311 - Transfer this Image Enpoint API to Controller Folder
// Update the user entries. This entries will be incremented when a new image in been uploaded
app.put('/image', (req, res) => { image.handledImage(req,res, db) } )

// Referring to Lecture 313 - To encapsulate the Clarifai API Key
// This is to move the Clarifai Key and its Clarifai Call to the Backend End Server Here
// instead of doing a Clarifai Call from the front end.
// This is because by call the Clarifai API Call from the Front End, the Clarifai API Key 
// is expose and can be read from the web browser console.
// We be doing a POST Request from the web browser because we will add the data in the '.req.body' 
// and the Web Browser will call the imageUrl end point then will execute the handleApiCall 
// We must ensure the 'handleApiCall' will receive the 'req.body' from the Frontend because the server need the input text
// We must check and ensure this at the Frontend Add.js
app.post('/imageurl', (req, res) => { image.handleApiCall(req,res) } )
// app.put('/image', (req, res) => {
// 	// Whenever a POST Request API is use we can only retrieve the parameter from the body
// 	// For this case we will get the user ID from the Body 
// 	// instead from the query string attached to the uRL
// 	const {id} = req.body;

// 	//knex('books')
// 	  db('users').where('id', '=', id)
// 		.increment('entries', 1)
// 		.returning('entries')
// 		.then(entries => {
// 			console.log(entries);
// 			res.json(entries[0]);
// 		})
// 		.catch(err => {
// 			console.log(err);
// 			res.status(400).json(err);
// 		})

// })

// ************************************************************************************

// app.put('/image', (req, res) => {
// 	// Whenever a POST Request API is use we can only retrieve the parameter from the body
// 	// For this case we will get the user ID from the Body 
// 	// instead from the query string attached to the uRL
// 	const {id} = req.body;
// 	let found = false;
// 	database.users.forEach(user => {
// 		if(user.id === id) {
// 			found = true;
// 			user.entries++;
// 			return res.json(user.entries);
// 		} 
// 	})//End of forEach Loop

// 	// This condition must be out of the forEach Loop else it willalways be executed
// 	if(!found) {
// 		res.status(404).json('User Not Found!!!')
// 	}
// })

// *****************************************************************************************

// bcrypt-nodejs Asynchronous
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


// Referring to Lec 281 article this is the sample code for bcrypt
// $ npm install bcrypt
// /*
// * You can copy and run the code below to play around with bcrypt
// * However this is for demonstration purposes only. Use these concepts
// * to adapt to your own project needs.
// */
 
// import bcrypt from'bcrypt'
// const saltRounds = 10 // increase this if you want more iterations  
// const userPassword = 'supersecretpassword'  
// const randomPassword = 'fakepassword'
 
// const storeUserPassword = (password, salt) =>  
//   bcrypt.hash(password, salt).then(storeHashInDatabase)
 
// const storeHashInDatabase = (hash) => {  
//    // Store the hash in your password DB
//    return hash // For now we are returning the hash for testing at the bottom
// }
 
// // Returns true if user password is correct, returns false otherwise
// const checkUserPassword = (enteredPassword, storedPasswordHash) =>  
//   bcrypt.compare(enteredPassword, storedPasswordHash)
 
 
// // This is for demonstration purposes only.
// storeUserPassword(userPassword, saltRounds)  
//   .then(hash =>
//     // change param userPassword to randomPassword to get false
//     checkUserPassword(userPassword, hash)
//   )
//   .then(console.log)
//   .catch(console.error)



app.listen(2900, () => {
	console.log('App is running on Port: 2900!!!')
});