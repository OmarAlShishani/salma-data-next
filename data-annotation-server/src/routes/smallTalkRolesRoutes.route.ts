import express from 'express';
import {
    createRoles,
    getRoles,
    getRolesById,
    deleteRoles,
    getRolesBySmallTalksId,
} from '../controllers/smallTalkRoles.controller';
const router = express.Router();

router.route('/createRoles').post(createRoles);
router.route('/getRoles').get(getRoles);
router.route('/getRolesById/:id').get(getRolesById);
router.route('/getRolesBySmallTalksId/:smallTalksId').get(getRolesBySmallTalksId);
router.route('/deleteRoles/:id').delete(deleteRoles);

export default router;
