import express, { Router } from 'express';

import { activityCategoryController as controller } from '../controllers';
import { check } from 'express-validator';
import { isManager } from '../middleware';

export const router: Router = express.Router();

router.post(
    '/',
    isManager,
    check('nameLT', 'LT Name is required').exists(),
    check('nameEN', 'EN Name is required').exists(),
    controller.create
);

router.put(
    '/:id',
    isManager,
    check('nameLT', 'LT Name is required').exists(),
    check('nameEN', 'EN Name is required').exists(),
    controller.edit
);

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

router.delete('/:id', isManager, controller.deleteOne);

router.delete('/', isManager, controller.deleteMany);
