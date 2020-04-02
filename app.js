import express from 'express';
import bodyParser from 'body-parser';
// import Routes from './routes';
import compress from 'compression'
import SuggestionController from './controller';

const app = express();
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/suggestions/:q?', SuggestionController.suggestion);

app.get('/', (req, res) => {
	res.status(200).send({
		message: 'Welcome to Voopik Backend API',
	});
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Voopik Backend API started on port ${port}`);
});

export default app;