import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import BasicList from '@/components/Builder/BasicList';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';

class IndexPage extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper title={false}>
        <BasicList url={'admin/actionLog/index'} />
      </PageHeaderWrapper>
    );
  }
}

export default IndexPage;
