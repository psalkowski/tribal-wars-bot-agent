import moment from 'moment';

export default class Logger {
  private constructor(private readonly name: string) {}

  static getLogger(name: string): Logger {
    return new Logger(name);
  }

  info(...args: any[]) {
    this.print('info', ...args);
  }
  log(...args: any[]) {
    this.print('log', ...args);
  }
  debug(...args: any[]) {
    this.print('debug', ...args);
  }
  warn(...args: any[]) {
    this.print('warn', ...args);
  }
  error(...args: any[]) {
    this.print('error', ...args);
  }

  private print(type: 'log' | 'info' | 'debug' | 'error' | 'warn', ...args: any[]) {
    console[type](
      `[${moment().format('YYYY-MM-DD HH:mm:ss')}][${this.name}][${type}]`,
      ...args,
    );
  }
}
