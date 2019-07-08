import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import BasicForm from '@/components/Builder/BasicForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './Style.less';

import {
  Card,
} from 'antd';

class BuilderForm extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper title={false}>
        <BasicForm url={'admin/demo/getFormInfo'} />
      </PageHeaderWrapper>
    );
  }
}

export default BuilderForm;
