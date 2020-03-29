import express, { Router } from 'express';

import { availableDateController as controller } from '../controllers';
import { check } from 'express-validator';

export const router: Router = express.Router();

router.post(
    '/',
    check('serviceId', 'ServiceId is required').exists(),
    check('date', 'date is required').exists(),
    controller.create
);

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

router.delete('/:id', controller.deleteOne);

router.delete('/', controller.deleteMany);
