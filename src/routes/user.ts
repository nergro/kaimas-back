import express, { Router } from 'express';

import { clientController as controller } from '../controllers';
import { isAdmin, isAuth } from '../middleware';
import { check } from 'express-validator';

export const router: Router = express.Router();

router.post(
    '/register',
    check('name', 'Name is required').exists(),
    check('lastName', 'Last name is required').exists(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    check('phone', 'Phone is required').exists(),
    controller.register
);

router.post(
    '/login',
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    controller.login
);

router.post(
    '/createmanager',
    check('name', 'Name is required').exists(),
    check('lastName', 'Last name is required').exists(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    check('phone', 'Phone is required').exists(),
    controller.createManager
);

router.get('/verify', isAuth, controller.getByToken);

router.get('/', isAdmin, controller.getAllManagers);

router.get('/:id', controller.getOne);

router.put(
    '/edit',
    isAuth,
    check('password', 'Password is required').not().isEmpty(),
    controller.edit
);

router.delete('/:id', isAdmin, controller.deleteOne);

router.delete('/', isAdmin, controller.deleteMany);
