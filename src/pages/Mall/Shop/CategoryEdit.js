import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import TabForm from '@/components/Builder/TabForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { stringify } from 'qs';

import {
  Card,
} from 'antd';

class BuilderForm extends PureComponent {

  state = {
    url: 'admin/shop/categoryEdit'+'?'+stringify(this.props.location.query),
  };

  render() {
    return (
      <PageHeaderWrapper title={false}>
        <TabForm url={this.state.url} />
      </PageHeaderWrapper>
    );
  }
}

export default BuilderForm;
