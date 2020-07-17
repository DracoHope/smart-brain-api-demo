
const Clarifai = require('clarifai');


	// Clarifai API Key
	const app = new Clarifai.App({
	 apiKey: '85f1845f69774c169740eb3ee05016fb'
	});

const handleApiCall = (req, res) => {
	// Clarifai API Call
	// There is a problem here.
	// We do not have the "this.state.input"
    app.models
    	.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    	.then(data => {
    		// We must make sure we will responding with a '.then' data
    		res.json(data);
    		console.log('Face Detection from Image Successful!!!');
    		})
    	.catch(err => {
    		res.status(400).json('Unable to Detect Face from Image!!!')
    		console.log('Unable to Detect Face from Image!!!');
    	})
	}




const handledImage = (req, res, db) => {
	// Whenever a POST Request API is use we can only retrieve the parameter from the body
	// For this case we will get the user ID from the Body 
	// instead from the query string attached to the uRL
	const {id} = req.body;

	//knex('books')
	  db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			console.log(entries);
			res.json(entries[0]);
		})
		.catch(err => {
			console.log(err);
			res.status(400).json(err);
		})

}

module.exports = {
	handledImage: handledImage,
	handleApiCall: handleApiCall
};