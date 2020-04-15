import express, { Router } from 'express';

import { cabinController as controller } from '../controllers';
import { check } from 'express-validator';
import { isManager } from '../middleware';

export const router: Router = express.Router();

router.post(
    '/',
    check('nameLT', 'LT Name is required').exists(),
    check('nameEN', 'EN Name is required').exists(),
    check('descriptionLT', 'LT Description is required').exists(),
    check('descriptionEN', 'EN Description is required').exists(),
    check('price', 'Price is required').exists(),
    check('capacity', 'Capacity is required').exists(),
    check('address', 'Address is required').exists(),
    check('thumbnail', 'Thumbnail is required').exists(),
    isManager,
    controller.create
);

router.put(
    '/:id',
    check('nameLT', 'LT Name is required').exists(),
    check('nameEN', 'EN Name is required').exists(),
    check('descriptionLT', 'LT Description is required').exists(),
    check('descriptionEN', 'EN Description is required').exists(),
    check('price', 'Price is required').exists(),
    check('capacity', 'Capacity is required').exists(),
    check('address', 'Address is required').exists(),
    check('thumbnail', 'Thumbnail is required').exists(),
    isManager,
    controller.edit
);

router.get('/', controller.getList);

router.get('/all', controller.getAll);

router.get('/:id', controller.getOne);

router.delete('/:id', isManager, controller.deleteOne);

router.delete('/', isManager, controller.deleteMany);
