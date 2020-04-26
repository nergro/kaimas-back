import express, { Router } from 'express';

import { availableDateController as controller } from '../controllers';
import { check } from 'express-validator';
import { isManager, isAuth } from '../middleware';

export const router: Router = express.Router();

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

router.get('/:serviceId/service', controller.getByServiceId);

router.post(
    '/',
    check('serviceId', 'serviceId is required').exists(),
    check('serviceType', 'serviceType is required').exists(),
    check('dateChunks', 'dateChunks is required').exists(),
    isManager,
    controller.create
);

router.delete('/:id', isManager, controller.deleteOne);

router.delete('/', isManager, controller.deleteMany);
