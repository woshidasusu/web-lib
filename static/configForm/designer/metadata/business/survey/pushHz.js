export default {
  __nameShowInDesigner: '调研 - 推送频率',
  type: 'kf_pushHz',
  label: '触点频率',
  value: {
    extract_mode: '一次性',
    auto_push_time: '08:00'
  },
  required: 1,
  style: { 'margin-bottom': '0px' },
  validateRules: [{ required: true, message: '触点频率不能为空' }],
  options: [
    {
      label: '仅发布时推送一次',
      desc: '（发布时推送符合条件的对象，后续业主一旦满足触发规则则直接推送调研）',
      value: '一次性'
    },
    {
      type: 'period',
      label: '发布时推送一次，且后续每天',
      subLabel: '自动推送一次',
      desc: '（发布时推送，且后续满足规则的业主会统一在固定时间推送）',
      value: '周期性',
      options: [
        {
          label: '08:00',
          value: '08:00'
        },
        {
          label: '09:00',
          value: '09:00'
        },
        {
          label: '10:00',
          value: '10:00'
        },
        {
          label: '11:00',
          value: '11:00'
        },
        {
          label: '12:00',
          value: '12:00'
        },
        {
          label: '13:00',
          value: '13:00'
        },
        {
          label: '14:00',
          value: '14:00'
        },
        {
          label: '15:00',
          value: '15:00'
        },
        {
          label: '16:00',
          value: '16:00'
        },
        {
          label: '17:00',
          value: '17:00'
        },
        {
          label: '18:00',
          value: '18:00'
        },
        {
          label: '19:00',
          value: '19:00'
        },
        {
          label: '20:00',
          value: '20:00'
        },
        {
          label: '21:00',
          value: '21:00'
        }
      ]
    }
  ]
};
