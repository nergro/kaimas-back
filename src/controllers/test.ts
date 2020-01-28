import { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status-codes';

import { logger } from '../logging';

export const get: (req: Request, res: Response) => Promise<void> = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        res.status(OK).send({ msg: 'ok' });
    } catch (err) {
        logger.log('error', (err as Error).message);
        res.status(INTERNAL_SERVER_ERROR).send({
            error: (err as Error).message
        });
    }
};
