import express from 'express';
import SuggestionController from '../controller'

const router = express.Router();

router.get('suggestions/:q', SuggestionController.suggestion);

export default router;