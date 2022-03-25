export default {
  type: 'kf_house_selector',
  __nameShowInDesigner: '选择项目房产组件',
  label: '项目房产',
  required: 1,
  hidden: 0,
  disabled: 0,
  width: '',
  style: '',
  value: {
    corp_id: '',
    corp_name: '',
    proj_id: '',
    building_id: '',
    unit_id: '',
    unit: '',
    floor: '',
    room_id: '',
    room_name: ''
  },
  placeholder: '',
  validateRules: [{ required: true, message: '项目房产不能为空' }]
};
