import express, { Router } from 'express';

import { testController as controller } from '../controllers';

export const router: Router = express.Router();

router.get('/test', controller.get);
