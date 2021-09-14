<template>
  <section class="basic-container">
    <doc-header class="header" />
    <doc-aside />
    <main id="scroll-main" ref="content" class="main">
      <div class="main-box">
        <transition name="transTop">
          <router-view></router-view>
        </transition>
        <doc-page-nav />
      </div>
    </main>
  </section>
</template>

<script>
import Vue from 'vue';
import DocHeader from './components/doc-header';
import DocAside from './components/doc-aside';
import DocPageNav from './components/doc-page-nav';
import DemoBlock from './components/demo-block';

Vue.component('DemoBlock', DemoBlock);

export default {
  components: {
    DocHeader,
    DocAside,
    DocPageNav
  },
  watch: {
    '$route.path': {
      handler() {
        this.$nextTick(() => {
          const content = this.$refs.content;
          content.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import './assets/doc-theme.css';
@import './assets/docs-theme.css';

.basic-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  .header {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1500;
    height: 60px;
    background-color: #ffffff;
  }
  .main {
    display: flex;
    flex: 1;
    padding: 60px 0 100px 300px;
    background: #fff;
  }
  .main-box {
    display: block;
    width: 80%;
    min-width: 980px;
    max-width: 1400px;
    min-height: 100%;
    padding: 0 24px;
    margin: 0 auto;
  }
}
</style>
