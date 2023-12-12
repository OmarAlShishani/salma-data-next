import express from 'express';
import {
    createEntityValues,
    getEntityValues,
    importXlsxFile,
    exportXlsxFile,
    checkPermission,
} from '../controllers/entityValues.controller';
const router = express.Router();

router.route('/createEntityValues').post(createEntityValues);
router.route('/getEntityValues/:entityId/:page').get(getEntityValues);
router.route('/importXlsxFile').post(importXlsxFile);
router.route('/exportXlsxFile/:entityId').get(exportXlsxFile);
router.route('/checkPermission/:entityId').get(checkPermission);

export default router;
