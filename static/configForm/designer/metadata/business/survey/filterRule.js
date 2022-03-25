export default {
  __nameShowInDesigner: '调研 - 筛选规则',
  type: 'kf_filterRule',
  label: '筛选方式',
  style: { 'margin-bottom': '6px' },
  required: 0,
  value: {
    rules: {
      delivery: { show: false },
      room: { show: false },
      sign: { show: false },
      tag: {
        show: false,
        list: []
      }
    }
  },
  options: [
    {
      value: 'customerTag',
      label: '客户标签'
    }
  ]
};
