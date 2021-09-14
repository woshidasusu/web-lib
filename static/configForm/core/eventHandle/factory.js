import UpdateDisabledEvent from './updateDisabled';
import UpdateHiddenEvent from './updateHidden';
import UpdateModelEvent from './updateModel';
import UpdateOptionsEvent from './updateOptions';
import CallMethodEvent from './callMethod';
import ExecFunctionEvent from './execFunction';
import ResetModelEvent from './resetModel';
import DataServiceEvent from './dataService';

export default function getEventHandle(coreProcessor, eventHandle, eventData, extraArgs = {}) {
  const { type } = eventHandle;
  const Cls = {
    updateDisabled: UpdateDisabledEvent,
    updateHidden: UpdateHiddenEvent,
    updateModel: UpdateModelEvent,
    resetModel: ResetModelEvent,
    updateOptions: UpdateOptionsEvent,
    callMethod: CallMethodEvent,
    execFunction: ExecFunctionEvent,
    dataService: DataServiceEvent
  }[type];
  return new Cls(coreProcessor, eventHandle, eventData, extraArgs);
}
