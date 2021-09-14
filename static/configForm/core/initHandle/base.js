import CoreProcessor from '../index';
export default class BaseInitHandle {
  coreProcessor = new CoreProcessor();
  handle;
  _id;

  constructor(coreProcessor, handle, _id) {
    this.coreProcessor = coreProcessor;
    this.handle = handle;
    this._id = _id;
  }

  async exec() {}
}
