export default {
  __nameShowInDesigner: '调研 - 触发规则',
  type: 'kf_triggerRule',
  label: '触发规则',
  style: { 'margin-bottom': '8px' },
  value: {
    trigger_rules: []
  },
  required: 1,
  dataSource: {
    type: 'api',
    url: 'customer-survey/auto-trigger/get-trigger-rules',
    dataKey: 'data'
  },
  addTip: '（多个规则只要满足其中任一一个就会触发调研计划）',
  specifiedTimeTemplate: [
    {
      type: 'select',
      style: 'width: 120px',
      placeholder: '请选择',
      options: [
        {
          label: '大于',
          value: '大于'
        },
        {
          label: '小于',
          value: '小于'
        }
      ],
      name: 'operator'
    },
    {
      type: 'input',
      nativeType: 'number',
      style: 'width: 120px',
      name: 'value',
      min: 1
    },
    {
      type: 'select',
      style: 'width: 120px',
      options: [
        {
          label: '小时',
          value: '小时'
        },
        {
          label: '分钟',
          value: '分钟'
        }
      ],
      name: 'unit'
    }
  ]
};
