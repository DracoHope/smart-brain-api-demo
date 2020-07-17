

const handleProfileGet = (req, res, db) => {
	const {id} = req.params;
	let found = false;

	// This is similar to SQL
	// Select * from users where ID = id
	// Where ID is the Database Column
	// The id is the input parameter
	db.select('*').from('users').where({
		id: id
	})
	.then(user => {
		console.log(user);

		if(user.length) { // If not an empty array then return the user object
			// The response is an Array so we just grab the first element
			res.json(user[0])
		}	else {
			res.status(400).json('User with ID: ' + id + ' not Found');
			console.log('User with ID: ' + id + ' not Found');
		}

	})
	.catch(err => res.status(400).json('Error Getting User Info!!!'))

	// In Javascript - an Empty Array will not create an error therefore the '.catch()' did not catch any error
	// Boolean([]) -> this result in True in Javascript therefore an empty array not consider a Error

	// db.select('*').from('users').then(user => {
	// 	console.log(user);
	// })

	// This condition must be out of the forEach Loop else it willalways be executed
	// if(!found) {
	// 	res.status(404).json('User Not Found!!!')
	// }
}

module.exports = {
	handleProfileGet: handleProfileGet
};