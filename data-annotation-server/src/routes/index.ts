import express, { Request, Response } from 'express';
import { login } from '../controllers/login.controller';
import usersRoutes from './usersRoutes.route';
import intentsRoutes from './intentsRoutes.route';
import smallTalksRoutes from './smallTalksRoutes.route';
import smalltalkTrainingRoutes from './smalltalkTrainingRoutes.route';
import smallTalkTestingRoutes from './smallTalkTestingRoutes.route';
import smallTalkRolesRoutes from './smallTalkRolesRoutes.route';
import intentsRolesRoutes from './intentsRolesRoutes.route';
import intentsFlowsRoutes from './intentsFlowsRoutes.route';
import intentsKeywordsRoutes from './intentsKeywordsRoutes.route';
import intentsTrainingRoutes from './intentsTrainingRoutes.route';
import entitiesRoutes from './entitiesRoutes.route';
import entitiesRolesRoutes from './entitiesRolesRoutes.route';
import entitiesWithIntents from './entitiesWithIntents.route';
import entityValuesRoutes from './entityValuesRoutes';
import entitiesSynonymRoutes from './entitiesSynonymRoutes.route';
import intentsTestingRoutes from './intentsTestingRoutes.route';
import { authentication } from '../middleware/authentication';

const router = express.Router();

export default function routes() {
    router.post('/login', login);
    router.use('/users', authentication, usersRoutes);
    router.use('/intents', authentication, intentsRoutes);
    router.use('/smallTalks', authentication, smallTalksRoutes);
    router.use('/smalltalkTraining', authentication, smalltalkTrainingRoutes);
    router.use('/smallTalkTesting', authentication, smallTalkTestingRoutes);
    router.use('/smallTalkRoles', authentication, smallTalkRolesRoutes);
    router.use('/intentsRoles', authentication, intentsRolesRoutes);
    router.use('/intentsFlows', authentication, intentsFlowsRoutes);
    router.use('/intentsKeywords', authentication, intentsKeywordsRoutes);
    router.use('/intentsTraining', authentication, intentsTrainingRoutes);
    router.use('/entities', authentication, entitiesRoutes);
    router.use('/entitiesRoles', authentication, entitiesRolesRoutes);
    router.use('/entitiesIntentsRelation', authentication, entitiesWithIntents);
    router.use('/entityValues', authentication, entityValuesRoutes);
    router.use('/entitiesSynonym', authentication, entitiesSynonymRoutes);
    router.use('/intentsTesting', authentication, intentsTestingRoutes);
    return router;
}
