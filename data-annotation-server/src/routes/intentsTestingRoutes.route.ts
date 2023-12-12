import express from 'express';
import {
    createIntentsTesting,
    getIntentsTesting,
    getIntentsTestingById,
    importXlsxFile,
    exportXlsxFile,
    checkPermission,
    deleteIntentsTesting,
    getAllEntities,
    getEntityValuesByEntityId,
    updateIntentsTesting
} from '../controllers/intentsTesting.controller';
const router = express.Router();

router.route('/createIntentsTesting').post(createIntentsTesting);
router.route('/getIntentsTesting/:intentsId/:page').get(getIntentsTesting);
router.route('/getIntentsTestingById/:id').get(getIntentsTestingById);
router
    .route('/deleteIntentsTesting/:intentsId/:id')
    .delete(deleteIntentsTesting);
router
    .route('/updateIntentsTesting/:intentsId/:id')
    .put(updateIntentsTesting);
router.route('/importXlsxFile').post(importXlsxFile);
router.route('/exportXlsxFile/:intentsId').get(exportXlsxFile);
router.route('/checkPermission/:intentsId').get(checkPermission);
router.route('/getAllEntities/:intentsId').get(getAllEntities);
router.route('/getEntityValuesByEntityId/:entityId').get(getEntityValuesByEntityId);

export default router;
