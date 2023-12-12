import express from 'express';
import { createUser,getUsers,updateUser } from '../controllers/user.controller';
const router = express.Router();

router.route('/createUser').post(createUser);
router.route('/getUsers').get(getUsers);
router.route('/updateUser/:id').put(updateUser);

export default router;
