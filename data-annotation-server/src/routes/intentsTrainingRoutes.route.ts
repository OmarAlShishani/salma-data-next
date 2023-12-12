import express from 'express';
import {
    createIntentsTraining,
    getIntentsTraining,
    getIntentsTrainingById,
    importXlsxFile,
    exportXlsxFile,
    checkPermission,
    deleteIntentsTraining,
    updateIntentsTraining,
} from '../controllers/intentsTraining.controller';
const router = express.Router();

router.route('/createIntentsTraining').post(createIntentsTraining);
router.route('/getIntentsTraining/:intentsId/:page').get(getIntentsTraining);
router.route('/getIntentsTrainingById/:id').get(getIntentsTrainingById);
router
    .route('/deleteIntentsTraining/:intentsId/:id')
    .delete(deleteIntentsTraining);
router
    .route('/updateIntentsTraining/:intentsId/:id')
    .put(updateIntentsTraining);
router.route('/importXlsxFile').post(importXlsxFile);
router.route('/exportXlsxFile/:intentsId').get(exportXlsxFile);
router.route('/checkPermission/:intentsId').get(checkPermission);

export default router;
