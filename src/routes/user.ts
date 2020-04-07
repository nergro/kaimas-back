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

router.post('/createmanager', controller.createManager);

router.get('/one', isAuth, controller.getByToken);

router.get('/', controller.getAllManagers);
router.get('/:id', controller.getOne);

router.put(
    '/edit',
    isAuth,
    check('password', 'Password is required').not().isEmpty(),
    controller.edit
);

router.delete('/:id', controller.deleteOne);

router.delete('/', controller.deleteMany);
