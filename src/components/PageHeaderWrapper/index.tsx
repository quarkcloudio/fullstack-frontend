import { ConnectProps, ConnectState } from '@/models/connect';
import { MenuDataItem, getMenuData } from '@ant-design/pro-layout';

import React, { useEffect } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { PageHeader } from 'antd';

export interface PageHeaderWrapperProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

export type BasicLayoutContext = { [K in 'location']: PageHeaderWrapperProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

const PageHeaderWrapper: React.SFC<PageHeaderWrapperProps> = props => {

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

  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    breadcrumbNameMap,
    dispatch
  } = props;
  const { breadcrumb } = getMenuData(routes);

  console.log(breadcrumbNameMap);

  return (
    <div className={styles.pageHeaderWarp}>
      <div className={styles.gridContent}>
        <PageHeader title={false} breadcrumb={ breadcrumb } />
      </div>
      <div className={styles.gridContent}>
        <div className={styles.headerWrapChildrenContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default connect(({ global }: ConnectState) => ({
  menuData: global.menuData,
}))(PageHeaderWrapper);
