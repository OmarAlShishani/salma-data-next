import express from 'express';
import {
    createRoles,
    getRoles,
    getRolesById,
    deleteRoles,
    getRolesByIntentsId,
} from '../controllers/intentsRoles.controller';
const router = express.Router();

router.route('/createRoles').post(createRoles);
router.route('/getRoles').get(getRoles);
router.route('/getRolesById/:id').get(getRolesById);
router.route('/getRolesByIntentsId/:intentsId').get(getRolesByIntentsId);
router.route('/deleteRoles/:id').delete(deleteRoles);

export default router;
