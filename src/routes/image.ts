import express, { Router } from 'express';

import { imageController as controller } from '../controllers';

export const router: Router = express.Router();

router.post('/', controller.create);

router.delete('/:id', controller.remove);
