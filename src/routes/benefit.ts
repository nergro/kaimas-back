import express, { Router } from 'express';

import { benefitController as controller } from '../controllers';
import { check } from 'express-validator';
import { isManager } from '../middleware';

export const router: Router = express.Router();

router.post(
    '/',
    check('descriptionLT', 'LT Description is required').exists(),
    check('descriptionEN', 'EN Description is required').exists(),
    isManager,
    controller.create
);

router.put(
    '/:id',
    check('descriptionLT', 'LT Description is required').exists(),
    check('descriptionEN', 'EN Description is required').exists(),
    isManager,
    controller.edit
);

router.get('/all', controller.getAll);

router.get('/', controller.getList);

router.get('/:id', controller.getOne);

router.delete('/:id', isManager, controller.deleteOne);

router.delete('/', isManager, controller.deleteMany);
