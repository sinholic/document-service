import { Router } from 'express';
import ServiceController from '../controller/ServiceController';
import authorization from '../middleware/Auth';

const route = Router();
route.use(authorization);
route.get('/document-service', ServiceController.getAll);
route.post('/document-service/folder', ServiceController.setFolder);
route.delete('/document-service/folder', ServiceController.deleteFolder);
route.get('/document-service/folder/:folder_id', ServiceController.getListFile);
route.post('/document-service/document', ServiceController.setDocument);
route.get(
	'/document-service/document/:document_id',
	ServiceController.getDetailDocument,
);
route.delete('/document-service/document', ServiceController.deleteDocument);

export default route;
