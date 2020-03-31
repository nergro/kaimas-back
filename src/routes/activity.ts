import express, { Router } from 'express';

import { activityController as controller } from '../controllers';
import { check } from 'express-validator';

export const router: Router = express.Router();

router.post(
    '/',
    check('name', 'Name is required').exists(),
    check('category', 'Category is required').exists(),
    check('description', 'Description is required').exists(),
    check('price', 'Price is required').exists(),
    check('capacity', 'Capacity is required').exists(),
    controller.create
);

router.put(
    '/:id',
    check('name', 'Name is required').exists(),
    check('category', 'Category is required').exists(),
    check('description', 'Description is required').exists(),
    check('price', 'Price is required').exists(),
    check('capacity', 'Capacity is required').exists(),
    controller.edit
);

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

router.delete('/:id', controller.deleteOne);

router.delete('/', controller.deleteMany);
