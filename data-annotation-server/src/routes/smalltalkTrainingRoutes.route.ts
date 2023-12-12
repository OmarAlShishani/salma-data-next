import express from 'express';
import {
    createSmalltalkTraining,
    getSmalltalkTraining,
    getSmalltalkTrainingById,
    importXlsxFile,
    exportXlsxFile,
    checkPermission,
    deleteSmalltalkTraining,
    updateSmalltalkTraining
} from '../controllers/smalltalkTraining.controller';
const router = express.Router();

router.route('/createSmalltalkTraining').post(createSmalltalkTraining);
router
    .route('/getSmalltalkTraining/:smalltalkId/:page')
    .get(getSmalltalkTraining);
router.route('/getSmalltalkTrainingById/:id').get(getSmalltalkTrainingById);
router
    .route('/deleteSmalltalkTraining/:smalltalkId/:id')
    .delete(deleteSmalltalkTraining);
router
    .route('/updateSmalltalkTraining/:smalltalkId/:id')
    .put(updateSmalltalkTraining);
router.route('/importXlsxFile').post(importXlsxFile);
router.route('/exportXlsxFile/:smalltalkId').get(exportXlsxFile);
router.route('/checkPermission/:smalltalkId').get(checkPermission);

export default router;
