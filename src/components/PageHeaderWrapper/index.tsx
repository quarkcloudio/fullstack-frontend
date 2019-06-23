import React from 'react';
import styles from './index.less';
import { PageHeader } from 'antd';

var PageHeaderWrapper = function PageHeaderWrapper(props:any) {
  var children = props.children;

  const routes = [
    {
      path: 'index',
      breadcrumbName: 'First-level Menu',
    },
    {
      path: 'first',
      breadcrumbName: 'Second-level Menu',
    },
    {
      path: 'second',
      breadcrumbName: 'Third-level Menu',
    },
  ];

  return (
    <div className={styles.pageHeaderWarp}>
      <div className={styles.gridContent}>
        <PageHeader title={false} breadcrumb={{ routes }} />
      </div>
      <div className={styles.gridContent}>
        <div className={styles.headerWrapChildrenContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageHeaderWrapper;
