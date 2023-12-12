import express from 'express';
import {
    createEntitiesSynonym,
    getEntitiesSynonym,
    importXlsxFile,
    exportXlsxFile,
    checkPermission,
    deleteEntitiesSynonym,
    updateEntitiesSynonym
} from '../controllers/entitiesSynonym.controller';
const router = express.Router();

router.route('/createEntitiesSynonym').post(createEntitiesSynonym);
router.route('/getEntitiesSynonym/:entityId/:entityValueId/:page').get(getEntitiesSynonym);
router
    .route('/deleteEntitiesSynonym/:entityId/:id')
    .delete(deleteEntitiesSynonym);
router
    .route('/updateEntitiesSynonym/:entityId/:id')
    .put(updateEntitiesSynonym);
router.route('/importXlsxFile').post(importXlsxFile);
router.route('/exportXlsxFile/:entityId/:entityValueId').get(exportXlsxFile);
router.route('/checkPermission/:entityId').get(checkPermission);

export default router;
