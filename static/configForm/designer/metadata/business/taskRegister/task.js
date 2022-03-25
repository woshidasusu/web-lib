export default {
  __nameShowInDesigner: '工单 - 批量任务',
  type: 'kf_task',
  name: 'tasks',
  width: '',
  style: '',
  value: [],
  dataSource: [
    {
      type: 'window',
      symbol: 'data',
      saveKey: 'globalData'
    },
    {
      type: 'window',
      symbol: 'task_deadline_flag',
      saveKey: 'globalData.task_deadline_flag'
    },
    {
      type: 'window',
      symbol: 'canEditRepairDuration',
      saveKey: 'globalData.canEditRepairDuration'
    },
    {
      type: 'window',
      symbol: 'serviceDate',
      saveKey: 'globalData.serviceDate'
    },
    {
      type: 'window',
      symbol: 'reportOvertimeConfig',
      saveKey: 'globalData.reportOvertimeConfig'
    }
  ]
};
