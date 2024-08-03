import { CompositeAction } from './composite.action.js';
import { Action } from '../actions/action.js';
import { CaptchaAction } from '../actions/captcha.action.js';
import { CloseChatAction } from '../actions/close-chat.action.js';
import { ErrorBoxAction } from '../actions/error-box.action.js';
import { CloseDailyBonusPopupAction } from '../actions/close-daily-bonus-popup.action.js';

export class CheckAction extends CompositeAction {
  name = 'CheckAction';
  actions: Action[] = [
    new CaptchaAction(),
    new CloseChatAction(),
    new CloseDailyBonusPopupAction(),
    new ErrorBoxAction(),
  ];
}
