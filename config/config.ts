import { IConfig, IPlugin } from 'umi-types';

import defaultSettings from './defaultSettings';
// https://umijs.org/config/
import slash from 'slash2';
import webpackPlugin from './plugin.config';

const { pwa, primaryColor } = defaultSettings;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  history: 'hash', // url模式
  base: '/admin/',
  publicPath: '/admin/',
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    // auth
    {
      path: '/login',
      component: '../layouts/LoginLayout',
      routes: [{ path: '/login', component: './Auth/Login' }],
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        // console
        { path: '/', redirect: '/console/index' },
        {
          path: '/console',
          name: 'console',
          icon: 'file-word',
          routes: [
            {
              path: '/console/index',
              name: 'index',
              component: './Console/Index',
            },
            {
              path: '/console/update',
              name: 'update',
              component: './Console/Update',
            },
          ],
        },
        {
          path: '/builder',
          name: 'builder',
          routes: [
            {
              path: '/builder/index',
              component: './Builder/Index',
            },
            {
              path: '/builder/form',
              component: './Builder/Form',
            },
          ],
        },
        {
          path: '/article',
          name: 'article',
          icon: 'file-word',
          routes: [
            {
              path: '/article/index',
              name: 'index',
              component: './Article/Index',
            },
            {
              path: '/article/create',
              name: 'create',
              component: './Article/Create',
            },
            {
              path: '/article/edit',
              name: 'edit',
              component: './Article/Edit',
              hideInMenu: true,
            },
            {
              path: '/article/myPublished',
              name: 'myPublished',
              component: './Article/MyPublished',
            },
          ],
        },
        {
          path: '/page',
          name: 'page',
          icon: 'file-ppt',
          routes: [
            {
              path: '/page/index',
              name: 'index',
              component: './Page/Index',
            },
            {
              path: '/page/create',
              name: 'create',
              component: './Page/Create',
            },
            {
              path: '/page/edit',
              name: 'edit',
              component: './Page/Edit',
              hideInMenu: true,
            },
          ],
        },
        {
          path: '/user',
          name: 'user',
          icon: 'user-add',
          routes: [
            {
              path: '/user/index',
              name: 'index',
              component: './User/Index',
            },
            {
              path: '/user/create',
              name: 'create',
              component: './User/Create',
            },
            {
              path: '/user/edit',
              name: 'edit',
              component: './User/Edit',
              hideInMenu: true,
            },
            {
              path: '/user/recharge',
              name: 'recharge',
              component: './User/Recharge',
              hideInMenu: true,
            },
          ],
        },
        {
          path: '/admin',
          name: 'admin',
          icon: 'usergroup-add',
          routes: [
            {
              path: '/admin/user',
              name: 'user',
              routes: [
                {
                  path: '/admin/user',
                  redirect: '/admin/user/index',
                },
                {
                  path: '/admin/user/index',
                  component: './Admin/User/Index',
                },
                {
                  path: '/admin/user/create',
                  component: './Admin/User/Create',
                },
                {
                  path: '/admin/user/edit',
                  component: './Admin/User/Edit',
                },
              ],
            },
            {
              path: '/admin/permission',
              name: 'permission',
              routes: [
                {
                  path: '/admin/permission',
                  redirect: '/admin/permission/index',
                },
                {
                  path: '/admin/permission/index',
                  component: './Admin/Permission/Index',
                },
              ],
            },
            {
              path: '/admin/role',
              name: 'role',
              routes: [
                {
                  path: '/admin/role',
                  redirect: '/admin/role/index',
                },
                {
                  path: '/admin/role/index',
                  component: './Admin/Role/Index',
                },
                {
                  path: '/admin/role/create',
                  component: './Admin/Role/Create',
                },
                {
                  path: '/admin/role/edit',
                  component: './Admin/Role/Edit',
                },
              ],
            },
          ],
        },
        {
          path: '/banner',
          name: 'banner',
          icon: 'file-word',
          routes: [
            {
              path: '/banner/banner',
              name: 'banner',
              routes: [
                {
                  path: '/banner/banner',
                  redirect: '/banner/banner/index',
                },
                {
                  path: '/banner/banner/index',
                  component: './Banner/Banner/Index',
                },
                {
                  path: '/banner/banner/create',
                  component: './Banner/Banner/Create',
                },
                {
                  path: '/banner/banner/edit',
                  component: './Banner/Banner/Edit',
                },
              ],
            },
            {
              path: '/banner/bannerCategory',
              name: 'bannerCategory',
              routes: [
                {
                  path: '/banner/bannerCategory',
                  redirect: '/banner/bannerCategory/index',
                },
                {
                  path: '/banner/bannerCategory/index',
                  component: './Banner/BannerCategory/Index',
                },
                {
                  path: '/banner/bannerCategory/create',
                  component: './Banner/BannerCategory/Create',
                },
                {
                  path: '/banner/bannerCategory/edit',
                  component: './Banner/BannerCategory/Edit',
                },
              ],
            },
          ],
        },
        {
          path: '/plugin',
          name: 'plugin',
          icon: 'file-ppt',
          routes: [
            {
              path: '/plugin/comment',
              name: 'comment',
              routes: [
                {
                  path: '/plugin/comment',
                  redirect: '/plugin/comment/index',
                },
                {
                  path: '/plugin/comment/index',
                  component: './Plugin/Comment/Index',
                },
                {
                  path: '/plugin/comment/edit',
                  component: './Plugin/Comment/Edit',
                },
              ],
            },
            {
              path: '/plugin/link',
              name: 'link',
              routes: [
                {
                  path: '/plugin/link',
                  redirect: '/plugin/link/index',
                },
                {
                  path: '/plugin/link/index',
                  component: './Plugin/Link/Index',
                },
                {
                  path: '/plugin/link/create',
                  component: './Plugin/Link/Create',
                },
                {
                  path: '/plugin/link/edit',
                  component: './Plugin/Link/Edit',
                },
              ],
            },
            {
              path: '/plugin/printer',
              name: 'printer',
              routes: [
                {
                  path: '/plugin/printer',
                  redirect: '/plugin/Printer/index',
                },
                {
                  path: '/plugin/printer/index',
                  component: './Plugin/Printer/Index',
                },
                {
                  path: '/plugin/printer/edit',
                  component: './Plugin/Printer/Edit',
                },
              ],
            },
          ],
        },
        {
          path: '/system',
          name: 'system',
          icon: 'setting',
          routes: [
            {
              path: '/system/config',
              name: 'config',
              routes: [
                {
                  path: '/system/config',
                  redirect: '/system/config/index',
                },
                {
                  path: '/system/config/index',
                  name: 'index',
                  component: './System/Config/Index',
                },
                {
                  path: '/system/config/website',
                  name: 'website',
                  component: './System/Config/Website',
                },
                {
                  path: '/system/config/create',
                  component: './System/Config/Create',
                  hideInMenu: true,
                },
                {
                  path: '/system/config/edit',
                  component: './System/Config/Edit',
                  hideInMenu: true,
                },
              ],
            },
            {
              path: '/system/menu',
              name: 'menu',
              routes: [
                {
                  path: '/system/menu',
                  redirect: '/system/menu/index',
                },
                {
                  path: '/system/menu/index',
                  component: './System/Menu/Index',
                },
              ],
            },
            {
              path: '/system/navigation',
              name: 'navigation',
              routes: [
                {
                  path: '/system/navigation',
                  redirect: '/system/navigation/index',
                },
                {
                  path: '/system/navigation/index',
                  name: 'index',
                  component: './System/Navigation/Index',
                  hideInMenu: true,
                },
              ],
            },
            {
              path: '/system/category',
              name: 'category',
              routes: [
                {
                  path: '/system/category',
                  redirect: '/system/category/index',
                },
                {
                  path: '/system/category/index',
                  component: './System/Category/Index',
                  hideInMenu: true,
                },
                {
                  path: '/system/category/create',
                  component: './System/Category/Create',
                  hideInMenu: true,
                },
                {
                  path: '/system/category/edit',
                  component: './System/Category/Edit',
                  hideInMenu: true,
                },
              ],
            },
            {
              path: '/system/sms/index',
              name: 'sms',
              component: './System/Sms/Index',
            },
            {
              path: '/system/actionLog/index',
              name: 'actionLog',
              component: './System/ActionLog/Index',
            },
          ],
        },
        {
          path: '/attachment',
          name: 'attachment',
          icon: 'file-ppt',
          routes: [
            {
              path: '/attachment/file',
              name: 'file',
              routes: [
                {
                  path: '/attachment/file',
                  redirect: '/attachment/file/index',
                },
                {
                  path: '/attachment/file/index',
                  component: './Attachment/File/Index',
                },
              ],
            },
            {
              path: '/attachment/picture',
              name: 'picture',
              routes: [
                {
                  path: '/attachment/picture',
                  redirect: '/attachment/picture/index',
                },
                {
                  path: '/attachment/picture/index',
                  component: './Attachment/Picture/Index',
                },
                {
                  path: '/attachment/picture/edit',
                  component: './Attachment/Picture/Edit',
                },
              ],
            },
          ],
        },
        {
          name: 'account',
          icon: 'user',
          path: '/account',
          routes: [
            {
              path: '/account/settings',
              name: 'settings',
              routes: [
                {
                  path: '/account/settings',
                  redirect: '/account/settings/info',
                },
                {
                  path: '/account/settings/info',
                  component: './Account/Settings/Info',
                },
                {
                  path: '/account/settings/security',
                  component: './Account/Settings/Security',
                },
              ],
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/api': {
      target: 'http://www.project.com/',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
} as IConfig;
