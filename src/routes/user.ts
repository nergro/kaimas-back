import express, { Router } from 'express';

import { clientController as controller } from '../controllers';
import { isAuth } from '../middleware/isAuth';
import { check } from 'express-validator';

export const router: Router = express.Router();

router.post('/register', controller.register);

router.post(
    '/login',

    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    controller.login
);

router.get('/one', isAuth, controller.getByToken);

router.get('/', controller.getAll);

router.put(
    '/edit',

    isAuth,
    check('password', 'Password is required')
        .not()
        .isEmpty(),
    controller.edit
);
