import express, { Router } from 'express';

import { reviewController as controller } from '../controllers';
import { check } from 'express-validator';
import { isAuth } from '../middleware';

export const router: Router = express.Router();

router.post(
    '/',
    check('serviceId', 'serviceId is required').exists(),
    check('serviceType', 'serviceType is required').exists(),
    check('date', 'date is required').exists(),
    check('rating', 'rating is required').exists(),
    check('comment', 'comment is required').exists(),
    check('recommend', 'recommend is required').exists(),
    isAuth,
    controller.create
);

router.get('/:serviceId', controller.getAll);
