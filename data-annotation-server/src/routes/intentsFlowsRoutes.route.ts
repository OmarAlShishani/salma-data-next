import express from 'express';
import {
    createIntentsFlows,
    getIntentsFlows,
    getIntentsFlowsById,
    importXlsxFile,
    exportXlsxFile,
    checkPermission
} from '../controllers/intentsFlows.controller';
const router = express.Router();

router.route('/createIntentsFlows').post(createIntentsFlows);
router.route('/getIntentsFlows/:intentsId/:page').get(getIntentsFlows);
router.route('/getIntentsFlowsById/:id').get(getIntentsFlowsById);
router.route('/importXlsxFile').post(importXlsxFile);
router.route('/exportXlsxFile/:intentsId').get(exportXlsxFile);
router.route('/checkPermission/:intentsId').get(checkPermission);

export default router;
