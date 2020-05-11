import express, { Router } from 'express';

import { orderController as controller } from '../controllers';
import { check } from 'express-validator';
import { isAuth } from '../middleware';

export const router: Router = express.Router();

router.post(
    '/',
    check('datesIds', 'datesIds is required').exists(),
    check('date', 'date is required').exists(),
    check('onModel', 'onModel is required').exists(),
    check('serviceId', 'serviceId is required').exists(),
    check('price', 'price is required').exists(),
    isAuth,
    controller.create
);

router.get('/', isAuth, controller.get);

router.post('/:token', controller.cancel);
