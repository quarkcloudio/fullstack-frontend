import React, { useEffect } from 'react';
import styles from './FormPage.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import router from 'umi/router';

import {
  Card,
  Spin,
  InputNumber,
  DatePicker,
  Tabs,
  Switch,
  Form,
  Select,
  Input,
  Button,
  Checkbox,
  Radio,
  Upload,
  message,
  Modal,
  Tree,
  Cascader
} from 'antd';
moment.locale('zh-cn');

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { TreeNode } = Tree;

export interface FormPageProps {
  title:string;
  loading: boolean;
  controls?: [];
  random:string;
  url?: string;
  submitting: boolean;
  dispatch: Dispatch<any>;
}

const FormPage: React.SFC<FormPageProps> = props => {

  const {
    title,
    loading,
    url,
    dispatch
  } = props;

  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'form/info',
        payload: {
          actionUrl: url,
        }
      });
    }
  }, [dispatch, url]);

  return (
  <Spin spinning={loading} tip="Loading..." style={{background:'#fff'}}>
    <div className={styles.container}>
      <Card
        size="small"
        title={title}
        bordered={false}
        extra={<Button type="link" onClick={(e) => router.go(-1)}>返回上一页</Button>}
      >

      </Card>
    </div>
  </Spin>
  );
};

function mapStateToProps(state:any) {
  const {
    url,
    title,
    random,
    previewImage,
    previewVisible,
    loading,
    controls,
    labelCol,
    wrapperCol
    } = state.form;
  return {
    url,
    title,
    random,
    previewImage,
    previewVisible,
    loading,
    controls,
    labelCol,
    wrapperCol
  };
}

export default connect(mapStateToProps)(FormPage);