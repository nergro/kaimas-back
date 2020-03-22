import express, { Router } from 'express';

import { clientController as controller } from '../controllers';
import { isAuth } from '../middleware/isAuth';
export const router: Router = express.Router();

router.post('/register', controller.register);

router.get('/', isAuth, controller.getByToken);
