export default {
  __nameShowInDesigner: '工单 - 服务请求人',
  type: 'kf_requester',
  required: 1,
  label: '服务请求人',
  width: '',
  style: '',
  value: {
    corp_id: '',
    proj_id: '',
    building_id: '',
    unit_id: '',
    room_id: '',
    room_name: '',
    requester: '',
    requester_member_id: '',
    phone: ''
  },
  dataSource: {
    type: 'window',
    symbol: 'data'
  },
  eventListener: [
    {
      event: 'roomSelected',
      handles: [
        {
          type: 'updateModel',
          formModelKey: 'accept_corp_id,accept_corp_name',
          eventDataKey: 'corp_id,corp_name'
        },
        {
          type: 'callMethod',
          method: 'updateRoomParams',
          targetFormItemId: '11'
        }
      ]
    }
  ]
};
