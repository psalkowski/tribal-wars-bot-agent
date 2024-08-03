import { Service } from 'typedi';
import Logger from './logger.js';

@Service()
export class Api {
  private readonly logger = Logger.getLogger('Api');

  post<T>(path: string, payload?: any): Promise<T> {
    return this.call('post', path, { body: payload }).then(this.toJson).then(this.debug);
  }

  get<T>(path: string, payload = {}): Promise<T> {
    return this.getRaw(path, payload).then(this.toJson).then(this.debug);
  }

  getRaw(path: string, payload = {}): Promise<Response> {
    return this.call('get', path, { query: payload });
  }

  toJson(response: Response) {
    return response && response.json();
  }

  debug = <T>(data: T) => {
    // this.logger.debug('Response', data);

    return data;
  };

  private call(
    method: 'post' | 'get',
    path: string,
    options: {
      body?: any;
      query?: any;
    } = { body: {}, query: {} },
  ) {
    if (!process.env.BACKEND_API) {
      return Promise.resolve(undefined);
    }

    const params = new URLSearchParams(options.query);
    const url = `${process.env.BACKEND_API}/api${path}${params}`;
    const body = JSON.stringify(options.body);

    // this.logger.log(`[${method}] ${url}`, options.body);

    return fetch(url, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json',
        'X-Agent': process.env.AGENT_ID,
      },
    });
  }
}
