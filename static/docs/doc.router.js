import docRouterConfig from './doc-router-config';
import Vue from 'vue';
import VueRouter from 'vue-router';

/**
 * 返回异步组件
 * @param path 组件路径
 * @returns
 */
const load = path => {
  const component = import(/* webpackChunkName: "[request]" */ `./md/${path}.md`);
  component.catch(e => {
    console.error(e);
  });
  return component;
};

/**
 * 返回文档组件路由元数据
 * @param routers
 * @param mergeRouter
 * @returns
 */
const componentsRouter = (routers, mergeRouter = []) => {
  routers.forEach(item => {
    if (item.path) {
      mergeRouter.push({
        name: `doc-${item.title}`,
        path: '/docs/' + item.path,
        meta: {
          title: item.title,
          isFullPage: true,
          isShowFooter: false,
          noAuth: 1
        },
        component: () => load(item.path)
      });
    }
    if (item.children && item.children.length) {
      componentsRouter(item.children, mergeRouter);
    }
  });
  return mergeRouter;
};

const routes = componentsRouter(docRouterConfig);

const rootRoutes = [
  {
    path: '/docs',
    component: () => import('./index.vue'),
    children: [
      ...routes,
      {
        path: '*',
        redirect: 'global'
      },
      {
        path: '',
        redirect: 'global'
      }
    ]
  },
  {
    path: '/code-preview',
    name: 'CodePreview',
    meta: {
      title: '在线示例预览',
      isShowFooter: false,
      isFullPage: true,
      noAuth: 1
    },
    component: () => import('./views/code-preview/index.vue')
  },
  {
    path: '/form-preview',
    name: 'FormPreview',
    meta: {
      title: '配置化表单 - 在线编辑',
      isShowFooter: false,
      isFullPage: true,
      noAuth: 1
    },
    component: () => import('./views/form-preview/index.vue')
  },
  {
    path: '*',
    redirect: '/docs'
  }
];

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  routes: rootRoutes
});

export default router;
export { routes };
