export {
  PageDirection,
  waku_message,
  WakuMessage,
} from '../../node_modules/js-waku'

export class Waku {
  static async create() {
    return globalThis.waku
  }
}
