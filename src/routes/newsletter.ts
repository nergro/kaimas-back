import express, { Router } from 'express';

import { newsletterController as controller } from '../controllers';
import { check } from 'express-validator';

export const router: Router = express.Router();

router.post(
    '/',
    check('topic', 'Topic is required').exists(),
    check('content', 'Content is required').exists(),
    controller.send
);

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

router.delete('/:id', controller.deleteOne);

router.delete('/', controller.deleteMany);
