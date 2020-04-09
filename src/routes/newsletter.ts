import express, { Router } from 'express';

import { newsletterController as controller } from '../controllers';
import { check } from 'express-validator';
import { isManager } from '../middleware';

export const router: Router = express.Router();

router.post(
    '/',
    check('topic', 'Topic is required').exists(),
    check('content', 'Content is required').exists(),
    isManager,
    controller.send
);

router.get('/', isManager, controller.getAll);

router.get('/:id', isManager, controller.getOne);

router.delete('/:id', isManager, controller.deleteOne);

router.delete('/', isManager, controller.deleteMany);
