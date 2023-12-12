import express from 'express';
import {
    createSmalltalkTesting,
    getSmalltalkTesting,
    getSmalltalkTestingById,
    importXlsxFile,
    exportXlsxFile,
    checkPermission,
    deleteSmalltalkTesting,
    updateSmalltalkTesting
} from '../controllers/smalltalkTesting.controller';
const router = express.Router();

router.route('/createSmalltalkTesting').post(createSmalltalkTesting);
router.route('/getSmalltalkTesting/:smalltalkId/:page').get(getSmalltalkTesting);
router.route('/getSmalltalkTestingById/:id').get(getSmalltalkTestingById);
router
    .route('/deleteSmalltalkTesting/:smalltalkId/:id')
    .delete(deleteSmalltalkTesting);
router
    .route('/updateSmalltalkTesting/:smalltalkId/:id')
    .put(updateSmalltalkTesting);
router.route('/importXlsxFile').post(importXlsxFile);
router.route('/exportXlsxFile/:smalltalkId').get(exportXlsxFile);
router.route('/checkPermission/:smalltalkId').get(checkPermission);

export default router;
