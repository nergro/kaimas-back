import express, { Router } from 'express';

import { benefitController as controller } from '../controllers';
import { check } from 'express-validator';

export const router: Router = express.Router();

router.post(
    '/',
    check('description', 'Description is required').exists(),
    controller.create
);

router.put(
    '/:id',
    check('description', 'Description is required').exists(),
    controller.edit
);

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

router.delete('/:id', controller.deleteOne);

router.delete('/', controller.deleteMany);
