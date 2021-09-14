import CoreProcessor from '../index';

export default class BaseDataSource {
  coreProcessor = new CoreProcessor();
  dataSource;

  constructor(coreProcessor, dataSource) {
    this.coreProcessor = coreProcessor;
    this.dataSource = dataSource;
  }

  async exec() {}
}
