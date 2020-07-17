
// // Refer to Lecture 311
// // We can import the bcrypt and Knex same as the server.js here or 
// // The server.js can pass these Knex and Bcrypt into this register_api.js
// const express = require('express');

// // Whenever we need to deal with JSON, weneed to have the Body Parser
// const bodyParser = require('body-parser');

// // Import bcrypt-nodejs for Password Hash and Compare
// const bcrypt = require('bcrypt-nodejs');
// //const bcrypt = require('bcrypt-nodejs');

// // Import Cors
// const cors = require('cors');

// // This is just to clear the console screen whenever we restart the server
// console.clear();


// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : 'postgres',
//     password : 'test',
//     database : 'smart-brain'
//   }
// });

// // This Body-Paser must be declare only after the Express "app" been declare first
// // Because Body Parser is a Middleware therefore we need to implement it with the app.use() keyword
// // We can only do this only when the "const app = express();" have been created first else will have error
// app.use(bodyParser.json());


// app.use(cors());

// Referring to Lecture 309 for Knex Transaction for multiple database opertion
// This is very important 

const handledRegister = (req, res, db, bcrypt) => {
	//res.send('You are in Register Page!!!');
	// Using destructuring
	const {name, email, password} = req.body;

	// Lecture 313 - Validation of registeration user data
	// This is to check all email, name ans password is not empty or null
	if(!email || !name || !password) {
		return res.status(400).json('Invalid Register Data');
	}


	// Below is the Asynchronous Bcrypt Method
	// Encrypt the password by bcrypt cinvert the password into a hascode
	// bcrypt.hash(password, null, null, function(err, hash) {
	// 	// The password has been converted into hascode and save in variable "hash"
	// 	console.log("Registered Password in Hascode: ", hash);
	// });
	// This Array "push()" method is to add in new object into the Array
	// https://www.w3schools.com/php/func_array_push.asp
	// Syntax: array_push(array, value1, value2, ...)
	// database.users.push(
	// 	{
	// 		id: '125',
	// 		name: name,
	// 		email: email,
	// 		password: password,
	// 		entries: 0,
	// 		joined: new Date()
	// 	})

	// We be using the Knex to connect to the Postgres Database
	//knex('books').insert({title: 'Slaughterhouse Five'})

	// We be using the Bcrypt Synchronous Method for our demo
	// This hash password will be save nto the Database Login Table
	// smart-brain=# select * from login;
	//  id | hash | email
	// ----+------+-------
	// The "id" is of serial datatype so it is auto incremented 
	// We only need to insert hash password and the email into the login table

	const hash = bcrypt.hashSync("password");

	// We want to insert the registered user into the users database table and
	// also into the login table. 
	// We must have a way to make sure both table have been inserted
	// How to do that?
	// We be using the transaction. 
	// This s a code block when we doing multiple operation, when one fail then all other operation will also fail
	// This mean when user info fail to insert into users table then login insertion will also fail. This is to be consistencies.

	// We be using the Knex Transaction function
	// http://knexjs.org/#Builder-increment
	// 	Transactions are an important feature of relational databases, as they allow correct recovery from failures and keep a database consistent even in cases of system failure. 
	// 	All queries within a transaction are executed on the same database connection, and run the entire set of queries as a single unit of work. Any failure will mean the database will rollback any queries executed on that connection to the pre-transaction state.
	// Transactions are handled by passing a handler function into knex.transaction. The handler function accepts a single argument, an object which may be used in two ways:
	// As the "promise aware" knex connection
	// As an object passed into a query with and eventually call commit or rollback.
	// Example Code:
	// Using trx as a query builder:
	// knex.transaction(function(trx) {

	// Using trx as a transaction object:
	// knex.transaction(function(trx) {

	//   const books = [
	//     {title: 'Canterbury Tales'},
	//     {title: 'Moby Dick'},
	//     {title: 'Hamlet'}
	//   ];

	//   knex.insert({name: 'Old Books'}, 'id')
	//     .into('catalogues')
	//     .transacting(trx)
	//     .then(function(ids) {
	//       books.forEach((book) => book.catalogue_id = ids[0]);
	//       return knex('books').insert(books).transacting(trx);
	//     })
	//     .then(trx.commit)
	//     .catch(trx.rollback);
	// })
	// .then(function(inserts) {
	//   console.log(inserts.length + ' new books saved.');
	// })
	// .catch(function(error) {
	//   // If we get here, that means that neither the 'Old Books' catalogues insert,
	//   // nor any of the books inserts will have taken place.
	//   console.error(error);
	// });

	// Using Knex Transaction
	// The 'trx' is a parameter represent the transaction
	db.transaction(trx => {
		// The first transaction we want to insert into the login table
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')	// this 'returning' is the feature for Knex
		.then(loginEmail => {	// using the returning 'email' to insert into the users table
			 return trx('users')
					.returning('*')
					.insert({
						name: name,
						//email: loginEmail,	// The return 'loginEmail is an Array so we need to specified
											// loginEmail[0] else we will get this '{"April@yahoo.com"} 
											// instead of just "April@yahoo.com"
						email: loginEmail[0],
						joined: new Date()
				  }).then(user => {
					res.json(user[0]);
					})
		})
		 .then(trx.commit)
	    .catch(trx.rollback);
	})
	.catch(err => res.status(400).json('Create User Unsuccessful!!!'))

				// return db('users')
				// .returning('*')
				// .insert({
				// 	name: name,
				// 	email: email,
				// 	joined: new Date()
				// }).then(user => {
				// 	res.json(user[0]);
				// })
				// .catch(err => res.status(400).json('Create User Unsuccessful!!!'))

		// This code is actually better such that it contain more info of the Error
		// But we do not want to user at the Web Browser end to know the structure of our database
		//.catch(err => res.status(400).json(err))
}

// Refer to Lecture 311
// We are actually exporting this code as a function declare as handledRegister here

module.exports = {
	handledRegister: handledRegister
};