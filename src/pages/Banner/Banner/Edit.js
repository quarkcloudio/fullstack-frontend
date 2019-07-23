import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import BasicForm from '@/components/Builder/BasicForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { stringify } from 'qs';

import {
  Card,
} from 'antd';

class BuilderForm extends PureComponent {

  state = {
    url: 'admin/banner/edit'+'?'+stringify(this.props.location.query),
  };

  render() {
    return (
      <PageHeaderWrapper title={false}>
        <BasicForm url={this.state.url} />
      </PageHeaderWrapper>
    );
  }
}

export default BuilderForm;
