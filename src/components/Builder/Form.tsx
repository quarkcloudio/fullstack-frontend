import React, { useEffect } from 'react';
import styles from './Form.less';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

import {
  Spin,
  InputNumber,
  DatePicker,
  Tabs,
  Switch,
  Icon,
  Tag,
  Form,
  Select,
  Input,
  Button,
  Checkbox,
  Radio,
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export interface BasicFormProps extends FormComponentProps {
  formLoading: boolean;
  action?: string;
  controls?: any;
  labelCol?: any;
  wrapperCol?: any;
  submitName?: string;
  submitType?: string;
  submitLayout?: string;
  url?: string;
  submitting: boolean;
  dispatch: Dispatch<any>;
}

const BasicForm: React.SFC<BasicFormProps> = props => {

  const {
    formLoading,
    action,
    labelCol,
    wrapperCol,
    controls,
    submitName,
    submitType,
    submitLayout,
    url,
    submitting,
    dispatch,
    form,
  } = props;

  const { getFieldDecorator } = form;

  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'builder/getFormInfo',
        payload: {
          url: url,
        }
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if (!err) {
        dispatch({
          type: 'builder/formSubmit',
          payload: {
            action: action,
            ...values,
          },
        });
      }
    });
  };

  return (
    <Spin spinning={formLoading}>
      <Form onSubmit={handleSubmit} style={{ marginTop: 15 }}>
        {!!controls &&
          controls.map((control:any) => {
            if(control.type == "text") {
              return (
                <Form.Item 
                  labelCol={control.labelCol?control.labelCol:labelCol} 
                  wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                  label={control.labelName}
                >
                  {getFieldDecorator(control.name,{
                    initialValue: control.value,
                    rules: control.rules
                  })(<Input className={styles.middleItem} placeholder={control.placeholder} />)}
                </Form.Item>
              );
            }
          })}
        <Form.Item {...submitLayout} >
          <Button type = {submitType} htmlType="submit" loading={submitting}>
            {submitName}
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default Form.create<BasicFormProps>()(
  connect(({ loading ,builder}: ConnectState) => ({
    submitting: loading.effects['builder/formSubmit'],
    controls: builder.controls,
    wrapperCol: builder.wrapperCol,
    labelCol: builder.labelCol,
    submitName: builder.submitName,
    submitType: builder.submitType,
    submitLayout: builder.submitLayout,
    action: builder.action,
    formLoading: builder.formLoading,
  }))(BasicForm),
);
