import React, { Component } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import styles from './Index.css';

import { Form, Input, Button, Row, Col} from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

const Iconfont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1615691_y9lfy84fltb.js', // 在 iconfont.cn 上生成
});

interface IProps {
  dispatch:Dispatch<any>;
  submitting: boolean;
}

class IndexPage extends Component<IProps> {

  formRef: React.RefObject<any> = React.createRef();

  state = {
    captcha: '/api/admin/captcha'
  };
  
  componentDidMount() {

  }

  render() {

    const {submitting} = this.props;

    return (
      <div className={styles.main}>
        sss
      </div>
    );
  }
}

function mapStateToProps(state:any) {
  const { submitting } = state.login;
  return {
    submitting
  };
}

export default connect(mapStateToProps)(IndexPage);