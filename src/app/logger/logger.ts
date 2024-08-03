import moment from 'moment';

export const log = (...args: any[]) => print('log', ...args);
export const debug = (...args: any[]) => print('debug', ...args);
export const warn = (...args: any[]) => print('warn', ...args);
export const error = (...args: any[]) => print('error', ...args);

const print = (type: 'log' | 'debug' | 'warn' | 'error', ...args: any[]) =>
  console[type](`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`, ...args);
