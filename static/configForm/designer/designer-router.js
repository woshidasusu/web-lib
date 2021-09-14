import Vue from 'vue';
import VueRouter from 'vue-router';

const META = {
  title: '配置化平台',
  isShowFooter: false,
  isFullPage: true,
  noAuth: 1
};

const routes = [
  {
    path: '/config-form',
    component: () => import('../designer/index.vue'),
    children: [
      {
        path: 'list',
        component: () => import('../designer/views/list.vue'),
        meta: {
          ...META
        }
      },
      {
        path: 'edit',
        component: () => import('../designer/views/edit/index.vue'),
        meta: {
          ...META
        }
      },
      {
        path: 'preview',
        component: () => import('../designer/views/preview.vue'),
        meta: {
          ...META
        }
      },
      {
        path: 'detail',
        component: () => import('../designer/views/detail.vue'),
        meta: {
          ...META
        }
      },
      {
        path: '',
        redirect: 'list'
      }
    ]
  },
  { path: '*', redirect: '/config-form' }
];

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

export default router;
