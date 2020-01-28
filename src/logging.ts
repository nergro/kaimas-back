// tslint:disable-next-line: no-implicit-dependencies
import { Format, TransformableInfo } from 'logform';
import { createLogger, format, Logger, transports } from 'winston';
const { combine, timestamp, printf } = format;

const myFormat: Format = printf(
  (info: TransformableInfo) =>
    `${info.timestamp} ${info.level}: ${info.message}`,
);

export const logger: Logger = createLogger({
  defaultMeta: { service: 'user-service' },
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.File({ filename: 'logs.log' }),
    new transports.Console()
  ]
});
