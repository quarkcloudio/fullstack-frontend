import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Form from '@/components/Builder/Form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './Style.less';

import {
  Card,
} from 'antd';

class BuilderForm extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper title={false}>
        <div className={styles.container}>
          <Card
            size="small"
            title="demo"
            bordered={false}
            extra={<a href="javascript:history.go(-1)">返回上一页</a>}
          >
            <Form url={'admin/demo/getFormInfo'} />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default BuilderForm;
