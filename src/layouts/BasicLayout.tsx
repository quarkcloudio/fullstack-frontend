/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectProps, ConnectState } from '@/models/connect';
import { isAntDesignPro } from '@/utils/utils';
import logo from '../assets/logo.svg';

export interface BasicLayoutProps extends ProLayoutProps, Omit<ConnectProps, 'location'> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const links = [{
  key: 'FullStack',
  title: 'FullStack',
  href: 'http://fullstack.qasl.cn',
  blankTarget: true
}, {
  key: 'Document',
  title: '帮助文档',
  href: 'https://www.kancloud.cn/tangtanglove/fullstack',
  blankTarget: true
}, {
  key: 'Github',
  title: '问题反馈',
  href: 'https://github.com/tangtanglove/fullstack-backend/issues',
  blankTarget: true
}];

const copyright = '2019 qasl.cn';

const footerRender: BasicLayoutProps['footerRender'] = (_, defaultDom) => {
  return (
      <DefaultFooter links={links} copyright={copyright} />
  );
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, children, settings } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'account/getAccountInfo', // 获取用户信息
      });
      dispatch({
        type: 'settings/getSetting', // 获取设置
      });
      dispatch({
        type: 'global/getMenuData', // 获取菜单
      });
    }
  }, []);

  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean): void =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });

  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => (
        <Link to={menuItemProps.path}>{defaultDom}</Link>
      )}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
            defaultMessage: 'Home',
          }),
        },
        ...routers,
      ]}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {children}
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  menuData: global.menuData,
}))(BasicLayout);
