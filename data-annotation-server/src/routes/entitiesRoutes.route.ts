import express from 'express';
import {
    createEntities,
    getEntities,
    getEntitiesById,
} from '../controllers/entities.controller';
const router = express.Router();

router.route('/createEntities').post(createEntities);
router.route('/getEntities/:page').get(getEntities);
router.route('/getEntitiesById/:id').get(getEntitiesById);

export default router;
