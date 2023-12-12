import express from 'express';
import {
    createIntentsKeywords,
    getIntentsKeywords,
    getIntentsKeywordsById,
    importXlsxFile,
    exportXlsxFile,
    checkPermission,
    getIntentsFlowsForKeywords,
    deleteIntentsKeywords,
    updateIntentsKeywords,
} from '../controllers/intentsKeywords.controller';
const router = express.Router();

router.route('/createIntentsKeywords').post(createIntentsKeywords);
router.route('/getIntentsKeywords/:intentsId/:page').get(getIntentsKeywords);
router.route('/getIntentsKeywordsById/:id').get(getIntentsKeywordsById);
router.route('/importXlsxFile').post(importXlsxFile);
router.route('/exportXlsxFile/:intentsId').get(exportXlsxFile);
router.route('/checkPermission/:intentsId').get(checkPermission);
router
    .route('/getIntentsFlowsForKeywords/:intentsId')
    .get(getIntentsFlowsForKeywords);
router
    .route('/deleteIntentsKeywords/:intentsId/:id')
    .delete(deleteIntentsKeywords);
router
    .route('/updateIntentsKeywords/:intentsId/:id')
    .put(updateIntentsKeywords);

export default router;
