import { Action } from '../actions/action.js';

export class Queue {
  actions: Action[] = [];

  private static instance: Queue;

  public static getInstance(): Queue {
    if (!Queue.instance) {
      Queue.instance = new Queue();
    }

    return Queue.instance;
  }

  add(action: Action) {
    this.actions.push(action);
  }

  remove(action: Action) {
    this.actions = this.actions.filter((a) => a !== action);
  }

  run() {
    const date = new Date();
    const timestamp = date.getTime();
    const actions = [...this.actions];

    actions
      .filter((action) => action.runAt < timestamp)
      .forEach((action) => {
        // action.handle(null);

        this.remove(action);
      });
  }
}
