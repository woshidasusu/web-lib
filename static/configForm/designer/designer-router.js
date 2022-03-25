import { browserEnv } from '@/utils';

const META = {
  title: '配置化平台',
  isShowFooter: false,
  isFullPage: true,
  noAuth: 1
};

const _routes = [
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
        path: 'compare',
        component: () => import('../designer/views/compare.vue'),
        meta: {
          ...META
        }
      },
      {
        path: '',
        redirect: 'list'
      }
    ]
  }
];

let routes = [];
if (browserEnv() !== 'product') {
  routes = _routes;
}

export default routes;
