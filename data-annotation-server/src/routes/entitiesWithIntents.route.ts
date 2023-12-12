import express from 'express';
import {
    createEntitiesIntentsRelation,
    getIntentsByEntityRolesId,
    deleteEntitiesIntentsRelation,
    getIntentsForEntitiesIntentsRelation
} from '../controllers/entitiesWithIntents.controller';
const router = express.Router();

router.route('/createEntitiesIntentsRelation').post(createEntitiesIntentsRelation);
router.route('/getIntentsByEntityRolesId/:intentsId').get(getIntentsByEntityRolesId);
router.route('/getIntentsForEntitiesIntentsRelation').get(getIntentsForEntitiesIntentsRelation);
router.route('/deleteEntitiesIntentsRelation/:id/:intentsId').delete(deleteEntitiesIntentsRelation);

export default router;
