import express from 'express';
import {webhookController} from '../controllers/webhookController.js';

const webhookRouter = express.Router();

// The route definition that points to the controller function
webhookRouter.post('/whatsapp', webhookController);

export default webhookRouter;
