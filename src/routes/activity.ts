import express, { Router } from 'express';

import { activityController as controller } from '../controllers';
import { check } from 'express-validator';
import { isManager } from '../middleware';

export const router: Router = express.Router();

router.post(
    '/',
    check('name', 'Name is required').exists(),
    check('description', 'Description is required').exists(),
    check('price', 'Price is required').exists(),
    check('capacity', 'Capacity is required').exists(),
    isManager,
    controller.create
);

router.put(
    '/:id',
    check('name', 'Name is required').exists(),
    check('description', 'Description is required').exists(),
    check('price', 'Price is required').exists(),
    check('capacity', 'Capacity is required').exists(),
    isManager,
    controller.edit
);

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

router.delete('/:id', isManager, controller.deleteOne);

router.delete('/', isManager, controller.deleteMany);
