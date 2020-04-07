import express, { Router } from 'express';

import { activityCategoryController as controller } from '../controllers';
import { check } from 'express-validator';

export const router: Router = express.Router();

router.post('/', check('name', 'Name is required').exists(), controller.create);

router.put('/:id', check('name', 'Name is required').exists(), controller.edit);

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

router.delete('/:id', controller.deleteOne);

router.delete('/', controller.deleteMany);
