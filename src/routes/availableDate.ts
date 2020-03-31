import express, { Router } from 'express';

import { availableDateController as controller } from '../controllers';
import { check } from 'express-validator';

export const router: Router = express.Router();

router.post(
    '/',
    check('serviceId', 'serviceId is required').exists(),
    check('serviceType', 'serviceType is required').exists(),
    check('dateChunks', 'dateChunks is required').exists(),
    controller.create
);

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

router.delete('/:id', controller.deleteOne);

router.delete('/', controller.deleteMany);
