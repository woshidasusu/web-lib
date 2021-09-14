<template>
  <div class="layout-container">
    <div class="top-container">
      <span style="margin-right: 20px" class="title">{{ '编辑' }} - {{ code }} - {{ name }}</span>
      <el-button type="text" @click="showMetadata = true">查看元数据</el-button>
      <el-button type="text" @click="showPreview = true">预览</el-button>
    </div>
    <left-nav @quickAdd="onQuickAdd"></left-nav>
    <right-nav></right-nav>
    <div class="content-container">
      <draggable
        v-if="metadata"
        v-model="dragComponents"
        style="flex-grow: 1"
        chosen-class="chosen"
        force-fallback="true"
        group="components"
        animation="500"
        :move="onMove"
        @add="onAdd"
        @choose="onChoose"
        @update="onUpdate"
      >
        <div
          v-for="(item, i) in metadata.components"
          :key="item._id || i"
          class="drag-item-container"
          :class="item._id === curEditComponentId ? 'selected' : ''"
        >
          <drag-component :data="item"></drag-component>
        </div>
      </draggable>
    </div>
    <el-drawer title="元数据" :visible.sync="showMetadata" size="60%">
      <div class="code drawer-container">{{ metadata }}</div>
    </el-drawer>
    <el-drawer title="预览" :visible.sync="showPreview" size="60%">
      <m-config-form
        v-if="showPreview && metadata"
        class="drawer-container"
        :metadata="metadata"
        :data-service-data="dataServiceData"
      ></m-config-form>
    </el-drawer>
  </div>
</template>

<script>
import mConfigForm from '@/components/configForm';
import dataServiceDataList from '../../config/data-service-data-list';
import leftNav from './left-nav/index.vue';
import rightNav from './right-nav/index.vue';
import dynamicStore from '@/store/dynamicStore';
import draggable from 'vuedraggable';
import DragComponent from './drag-components';
export default {
  components: {
    mConfigForm,
    leftNav,
    rightNav,
    draggable,
    DragComponent
  },
  props: {},
  data() {
    return {
      dataServiceData: null,
      showMetadata: false,
      showPreview: false,
      dragComponents: [],
      originMetadata: null,
      uid: 1,
      curEditComponentId: null
    };
  },
  computed: {
    ...dynamicStore.cfDesignerEdit.statesToComputed([
      'edit.pageType',
      'edit.code',
      'edit.name',
      'edit.metadata',
      'edit.curDragComponent',
      'edit.curEditComponent'
    ])
  },
  watch: {
    dragComponents(newV) {}
  },
  async mounted() {
    const type = this.$route.query?.type;
    this.pageType = type || 'formPage';
    let data = localStorage.getItem('__metadata');
    if (data) {
      data = JSON.parse(data);
    } else {
      data = {};
    }
    this.dataServiceData = dataServiceDataList[data.dataServicePath] || {};
    this.code = data.code;
    this.name = data.name;
    this.originMetadata = data.metadata || {};
    this.adjustUid(this.originMetadata.components);
    this.metadata = {
      type: 'formPage',
      labelWidth: '130px',
      components: []
    };
    Object.assign(this.metadata, this.originMetadata);
    if (this.originMetadata.components?.length) {
      this.originMetadata.components.forEach(v => {
        this.dragComponents.push(JSON.parse(JSON.stringify(v)));
      });
    }
  },
  destroyed() {
    console.log('destroyed');
  },
  methods: {
    adjustUid(components = []) {
      let uid = this.uid;
      const stack = [...components];
      while (stack.length) {
        const cur = stack.pop();
        if (!Number.isNaN(+cur._id)) {
          uid = Math.max(uid, +cur._id);
        }
        if (cur.components?.length) {
          stack.push(...cur.components);
        }
      }
      this.uid = uid + 1;
      console.log('adjustUid() - uid：', this.uid);
    },
    onMove(e, originalEvent) {
      if (e.relatedRect.left === 40) {
        return false;
      }
      return true;
    },
    onAdd(e) {
      console.log('onAdd() - newIndex：', e.newIndex, this.curDragComponent.type);
      const o = { _id: this.uid++, ...this.curDragComponent };
      this.metadata.components.splice(e.newIndex, 0, o);
      this.editComponent(o);
    },
    onQuickAdd() {
      console.log('onQuickAdd', this.curDragComponent.type);
      this.dragComponents.push(this.curDragComponent);
      const o = { _id: this.uid++, ...this.curDragComponent };
      this.metadata.components.push(o);
      this.editComponent(o);
    },
    onChoose(e) {
      console.log('onChoose() - index：', e.oldIndex);
      this.editComponent(this.metadata.components[e.oldIndex]);
    },
    editComponent(item) {
      this.curEditComponentId = item._id;
      this.curEditComponent = item;
    },
    onUpdate(e) {
      console.log('onUpdate() - newIndex：', e.newIndex, 'oldIndex：', e.oldIndex);
      const o = this.metadata.components.splice(e.oldIndex, 1)[0];
      this.metadata.components.splice(e.newIndex, 0, o);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.layout-container {
  padding: 20px 40px;
  user-select: none;

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .top-container {
    position: fixed;
    width: 100%;
    height: 70px;
    top: 0;
    padding-top: 20px;
    background: #fff;
    z-index: 999;
  }

  .content-container {
    display: flex;
    flex-direction: column;
    margin: 0 350px;
    margin-top: 55px;
    padding: 20px;
    box-shadow: 0 2px 13px 0 #ebeef5;
    min-height: calc(100vh - 100px);
  }
}
.border-bottom {
  &::after {
    content: '';
    display: block;
    margin: 10px 0;
    border-bottom: 1px solid #ebeef5;
  }
}
.code {
  white-space: pre-wrap;
  max-height: 100%;
  overflow: auto;
}
.group-container {
  border-top: 1px solid #ebeef5;
  padding: 15px 0;
  font-size: 15px;
  font-weight: bold;
  color: #333333;
}
.drawer-container {
  padding: 24px;
  overflow: auto;
  max-height: calc(100vh - 80px);
}
.drag-item-container {
  padding: 6px 12px;
  border: 1px dashed #dcdcdc;
  cursor: pointer;

  &.selected {
    border-color: #1989fa;
    border-width: 2px;
  }
  &:hover {
    border-color: #1989fa;
  }
}
</style>
