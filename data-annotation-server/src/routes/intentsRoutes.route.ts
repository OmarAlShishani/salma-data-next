import express from 'express';
import {
    createIntents,
    getIntents,
    getIntentsById,
} from '../controllers/intents.controller';
const router = express.Router();

router.route('/createIntents').post(createIntents);
router.route('/getIntents/:page').get(getIntents);
router.route('/getIntentsById/:id').get(getIntentsById);

export default router;
