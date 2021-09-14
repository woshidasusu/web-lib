import CoreProcessor from '../index';
export default class BaseEventHandle {
  coreProcessor = new CoreProcessor();
  eventHandle;
  eventData;

  constructor(coreProcessor, eventHandle, eventData) {
    this.coreProcessor = coreProcessor;
    this.eventHandle = eventHandle;
    this.eventData = eventData;
  }

  async exec() {}
}
