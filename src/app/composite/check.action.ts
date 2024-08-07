import { CompositeAction } from './composite.action.js';
import { Action } from '../actions/action.js';
import { CaptchaAction } from '../actions/captcha.action.js';
import { CloseChatAction } from '../actions/close-chat.action.js';
import { ErrorBoxAction } from '../actions/error-box.action.js';
import { CloseDailyBonusPopupAction } from '../actions/close-daily-bonus-popup.action.js';
import { Container, Service } from 'typedi';

@Service()
export class CheckAction extends CompositeAction {
  name = 'CheckAction';

  constructor(
    private readonly captcha: CaptchaAction,
    private readonly closeChat: CloseChatAction,
    private readonly closeDailyBonus: CloseDailyBonusPopupAction,
    private readonly errorBox: ErrorBoxAction,
  ) {
    super();

    this.actions = [this.captcha, this.closeChat, this.closeDailyBonus, this.errorBox];
  }
}
