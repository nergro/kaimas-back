import express, { Router } from 'express';

import { subscribeController as controller } from '../controllers';
import { check } from 'express-validator';

export const router: Router = express.Router();

router.post(
    '/',
    check('email', 'Please include a valid email').isEmail(),
    controller.subscribe
);

router.post('/:token', controller.cancel);
