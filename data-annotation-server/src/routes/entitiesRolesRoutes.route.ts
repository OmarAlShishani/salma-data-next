import express from 'express';
import {
    createRoles,
    getRoles,
    getRolesById,
    deleteRoles,
    getRolesByEntityRolesId,
} from '../controllers/entitiesRoles.controller';
const router = express.Router();

router.route('/createRoles').post(createRoles);
router.route('/getRoles').get(getRoles);
router.route('/getRolesById/:id').get(getRolesById);
router.route('/getRolesByEntityRolesId/:entityId').get(getRolesByEntityRolesId);
router.route('/deleteRoles/:id').delete(deleteRoles);

export default router;
