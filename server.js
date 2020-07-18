const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// const register = require('./controllers/register');
// const signin = require('./controllers/signin');
// const profile = require('./controllers/profile');
// const image = require('./controllers/image');

const register = require('./controllers/register_api.js');

const signin = require('./controllers/signin_api.js');

const profile = require('./controllers/profile_api.js');

const image = require('./controllers/image_api.js');



// const db = knex({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : 'aneagoie',
//     password : '',
//     database : 'smart-brain'
//   }
// });

// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     connectionString : process.env.DATABASE_URL,
//     ssl: true,
//   }
// });//postgresql-defined-32131

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: false,
  }
});//postgresql-defined-3213

const app = express();

app.use(cors())
app.use(bodyParser.json());

//app.get('/', (req, res)=> { res.send(db.users) })
app.get('/', (req, res) => {
	//res.send(['I am Ming Server!!! This is the Root Directory: http://localhost:2900/', 'Glad to see you here!!!']);
	//send all user information to the Request Web Browser
	//res.send(database.users);
	res.send("I am Ming Database in HeroKu Server");
})

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
//app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

//handleSignin
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
//app.post('/signin', signin.handleSignin(req, res, db, bcrypt))
//app.post('/signin', signin.handledSignin(db, bcrypt))

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
//app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.put('/image', (req, res) => { image.handleImage(req, res, db)})
//app.put('/image', (req, res) => { image.handledImage(req,res, db) } )

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})
//app.post('/imageurl', (req, res) => { image.handleApiCall(req,res) } )


// app.listen(3000, ()=> {
//   console.log('app is running on port 3000');
// })

app.listen(process.env.PORT || 2900, () => {
	console.log(`App is running on Port: ${process.env.PORT}`)
});
