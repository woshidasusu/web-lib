<template>
  <section class="page-nav">
    <div class="page-nav-link">
      <span v-if="leftNav" @click="handlePage('prev')">
        <span class="icon">←</span>
        <span class="text">{{ leftNav.meta.title || leftNav.name }}</span>
      </span>
    </div>
    <div class="page-nav-link">
      <span v-if="rightNav" @click="handlePage('next')">
        <span class="text">{{ rightNav.meta.title || rightNav.name }}</span>
        <span class="icon">→</span>
      </span>
    </div>
  </section>
</template>

<script>
import { routes } from '../../doc.router';

export default {
  data() {
    return {
      nav: routes,
      currentIndex: -1,
      leftNav: null,
      rightNav: null
    };
  },

  computed: {
    lang() {
      return this.$route.meta.lang;
    }
  },

  watch: {
    '$route.path'() {
      this.updateNav();
    }
  },
  created() {
    this.updateNav();
  },

  methods: {
    updateNav() {
      this.currentIndex = this.nav.findIndex(item => item.name === this.$route.name);
      this.leftNav = this.nav[this.currentIndex - 1];
      this.rightNav = this.nav[this.currentIndex + 1];
    },

    handlePage(direction) {
      this.$router.push(direction === 'prev' ? this.leftNav.path : this.rightNav.path);
    }
  }
};
</script>

<style lang="scss">
.page-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 0;
  color: #1f93ff;
  font-size: 16px;
}

.page-nav-link {
  cursor: pointer;
  transition: 0.3s;
  .text {
    color: #1f93ff;
    padding: 0 8px;
  }
  .icon {
    color: #333333;
  }
}
</style>
