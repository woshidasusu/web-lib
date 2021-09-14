import ModelHandle from './model';
import DisableHandle from './disabled';
import HiddenHandle from './hidden';
import OptionsHandle from './options';
import DataServiceHandle from './dataService';

export default function getInitHandle(coreProcessor, handle, _id, extraArgs = {}) {
  const { type } = handle;
  const Cls = {
    model: ModelHandle,
    disabled: DisableHandle,
    hidden: HiddenHandle,
    options: OptionsHandle,
    dataService: DataServiceHandle
  }[type];
  return new Cls(coreProcessor, handle, _id, extraArgs);
}
