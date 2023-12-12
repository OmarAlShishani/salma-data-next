import express from 'express';
import {
    createSmallTalks,
    getSmallTalks,
    getSmallTalksById,
} from '../controllers/smallTalks.controller';
const router = express.Router();

router.route('/createSmallTalks').post(createSmallTalks);
router.route('/getSmallTalks/:page').get(getSmallTalks);
router.route('/getSmallTalksById/:id').get(getSmallTalksById);

export default router;
