export default {
  __nameShowInDesigner: '调研 - 推送方式',
  type: 'kf_pushWay',
  label: '触点推送方式',
  style: { 'margin-bottom': '8px' },
  value: {
    push_config: {
      wx: {
        enable: 0,
        title: '服务评价提醒',
        first: '',
        date: '{当前时间}',
        remark: ''
      },
      sms: {
        enable: 0,
        content:
          '尊敬的{客户姓名}，为了监督和提升我们的服务品质，邀请您做一个简单的回访，点击{问卷地址}开始答题。回复TD退订。'
      },
      wework: {
        enable: 0
      }
    }
  },
  required: 1,
  options: [
    {
      type: 'weworkPush',
      label: '企微客服通待办推送'
    },
    {
      type: 'wxPush',
      label: '公众号推送',
      desc: '（不占用每月的4条群发限额）',
      msgTemplate: [
        '服务评价提醒',
        { type: 'input', placeholder: '您的十分满意是我们不懈的追求！', name: 'first' },
        '项目房产：{客户房产}',
        '服务内容：{计划名称}',
        '时间：{当前时间}',
        {
          type: 'textarea',
          rows: 2,
          placeholder: '为了监督和提升我们的服务品质，邀请您做一个简单的回访。感谢您的配合！',
          name: 'remark'
        }
      ],
      tips: [
        '{客户房产} 表示客户的项目房产， {计划名称} 表示调研计划名称',
        '受微信平台的限制，请不要带有营销、广告性质的内容，否则容易导致封号'
      ]
    },
    {
      type: 'smsPush',
      label: '短信推送',
      params: [
        {
          key: 'corp_ids',
          formModelKey: 'scope_id',
          conditions: [
            {
              type: 'expression',
              expression: '===',
              leftDataSource: {
                type: 'formModel',
                dataKey: 'apply_scope'
              },
              rightOperate: '公司'
            }
          ]
        },
        {
          key: 'proj_ids',
          formModelKey: 'scope_id',
          conditions: [
            {
              type: 'expression',
              expression: '===',
              leftDataSource: {
                type: 'formModel',
                dataKey: 'apply_scope'
              },
              rightOperate: '项目'
            }
          ]
        }
      ],
      inputConfig: {
        rows: 3,
        operate: [
          { type: 'customer', label: '{客户姓名}' },
          { type: 'house', label: '{客户房产}' },
          { type: 'link', label: '{问卷地址}' }
        ],
        name: 'content'
      },
      tips: [
        [
          { type: 'operate', label: '{客户姓名}' },
          '表示客户姓名，',
          { type: 'operate', label: '{客户房产}' },
          '表示客户房产，',
          { type: 'operate', label: '{问卷地址}' },
          '表示问卷地址'
        ],
        '短信抬头将显示为您公司的签名，比如【明源云链】',
        '给异常手机号（包括停机、空号等）发送短信，也会扣除账户余额',
        '为规避风险，短信末尾将会自动增加“回复TD退订”的字样'
      ]
    }
  ]
};
