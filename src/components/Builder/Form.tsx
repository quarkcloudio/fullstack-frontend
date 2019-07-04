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
  Upload,
  message,
  Modal,
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;

export interface BasicFormProps extends FormComponentProps {
  previewImage: string;
  previewVisible: boolean;
  imageList:any;
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
    imageList,
    previewImage,
    previewVisible,
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

  const handleEditorUpload = (param:any) => {
    const serverURL = '/api/admin/picture/upload';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = (response:any) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址

      const responseObj = JSON.parse(xhr.responseText);

      if (responseObj.status === 'success') {
        param.success({
          url: responseObj.data.url,
          meta: {
            id: responseObj.data.id,
            title: responseObj.data.title,
            alt: responseObj.data.title,
            loop: true, // 指定音视频是否循环播放
            autoPlay: true, // 指定音视频是否自动播放
            controls: true, // 指定音视频是否显示控制栏
            poster: responseObj.data.url, // 指定视频播放器的封面
          },
        });
      } else {
        // 上传发生错误时调用param.error
        param.error({
          msg: responseObj.msg,
        });
      }
    };

    const progressFn = (event:any) => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100);
    };

    const errorFn = (response:any) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.',
      });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage['token']);
    xhr.send(fd);
  };

  const handleCancel = () => { 
    dispatch({
      type: 'builder/previewImage',
      payload: {
        previewImage : null,
        previewVisible : false,
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
                  extra={control.extra}
                >
                  {getFieldDecorator(control.name,{
                    initialValue: control.value,
                    rules: control.rules
                  })(<Input size={control.size} style={control.style} placeholder={control.placeholder} />)}
                </Form.Item>
              );
            }

            if(control.type == "textArea") {
              return (
                <Form.Item 
                  labelCol={control.labelCol?control.labelCol:labelCol} 
                  wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                  label={control.labelName}
                  extra={control.extra}
                >
                  {getFieldDecorator(control.name,{
                    initialValue: control.value,
                    rules: control.rules
                  })(<TextArea style={control.style} autosize={control.autosize} rows={control.rows} placeholder={control.placeholder} />)}
                </Form.Item>
              );
            }

            if(control.type == "inputNumber") {
              return (
                <Form.Item 
                  labelCol={control.labelCol?control.labelCol:labelCol} 
                  wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                  label={control.labelName}
                  extra={control.extra}
                >
                  {getFieldDecorator(control.name,{
                    initialValue: control.value,
                    rules: control.rules
                  })(<InputNumber size={control.size} style={control.style} max={control.max} min={control.min} step={control.step} placeholder={control.placeholder} />)}
                </Form.Item>
              );
            }

            if(control.type == "checkbox") {
              return (
                <Form.Item 
                  labelCol={control.labelCol?control.labelCol:labelCol} 
                  wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                  label={control.labelName}
                  extra={control.extra}
                >
                  {getFieldDecorator(control.name,{
                    initialValue: control.value,
                    rules: control.rules
                  })(
                    <Checkbox.Group style={control.style}>
                      {!!control.list && control.list.map((value:any) => {
                      return (<Checkbox value={value.value}>{value.name}</Checkbox>)
                      })}
                    </Checkbox.Group>
                  )}
                </Form.Item>
              );
            }

            if(control.type == "radio") {
              return (
                <Form.Item 
                  labelCol={control.labelCol?control.labelCol:labelCol} 
                  wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                  label={control.labelName}
                  extra={control.extra}
                >
                  {getFieldDecorator(control.name,{
                    initialValue: control.value,
                    rules: control.rules
                  })(
                    <RadioGroup size={control.size} style={control.style}>
                      {!!control.list && control.list.map((value:any) => {
                      return (<Radio value={value.value}>{value.name}</Radio>)
                      })}
                    </RadioGroup>
                  )}
                </Form.Item>
              );
            }

            if(control.type == "select") {
              return (
                <Form.Item 
                  labelCol={control.labelCol?control.labelCol:labelCol} 
                  wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                  label={control.labelName}
                  extra={control.extra}
                >
                  {getFieldDecorator(control.name,{
                    initialValue: control.value
                    ? control.value.toString()
                    : undefined,
                    rules: control.rules
                  })(
                    <Select size={control.size} style={control.style} placeholder={control.placeholder}>
                      {!!control.options && control.options.map((option:any) => {
                      return (<Option key={option.value}>{option.name}</Option>)
                      })}
                    </Select>
                  )}
                </Form.Item>
              );
            }

            if(control.type == "switch") {
              return (
                <Form.Item 
                  labelCol={control.labelCol?control.labelCol:labelCol} 
                  wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                  label={control.labelName}
                  extra={control.extra}
                >
                  {getFieldDecorator(control.name,{
                    initialValue: control.value,
                    valuePropName: 'checked',
                    rules: control.rules
                  })(
                    <Switch style={control.style} checkedChildren={control.checkedChildren} unCheckedChildren={control.unCheckedChildren} />
                  )}
                </Form.Item>
              );
            }

            if(control.type == "datePicker") {
              return (
                <Form.Item 
                  labelCol={control.labelCol?control.labelCol:labelCol} 
                  wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                  label={control.labelName}
                  extra={control.extra}
                >
                  {getFieldDecorator(control.name,{
                    initialValue: moment(control.value, 'YYYY-MM-DD HH:mm:ss'),
                    rules: control.rules
                  })(
                    <DatePicker
                      showTime={control.showTime}
                      size={control.size}
                      style={control.style}
                      locale={locale}
                      format={control.format}
                      placeholder={control.placeholder}
                    />
                  )}
                </Form.Item>
              );
            }

            if(control.type == "editor") {
              return (
                <Form.Item 
                  labelCol={control.labelCol?control.labelCol:labelCol} 
                  wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                  label={control.labelName}
                  extra={control.extra}
                >
                  <div className={styles.editor}>
                    {getFieldDecorator(control.name,{
                      initialValue: BraftEditor.createEditorState(control.value),
                      rules: control.rules
                    })(
                      <BraftEditor
                        contentStyle={control.style}
                        media={{ uploadFn: handleEditorUpload }}
                      />
                    )}
                  </div>
                </Form.Item>
              );
            }

            if(control.type == "image") {

              const uploadButton = (
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">{control.button}</div>
                </div>
              );

              // 图片上传
              const uploadPictureProps = {
                name: 'file',
                listType: 'picture-card',
                fileList: imageList,
                onPreview: (file:any) => {
                  dispatch({
                    type: 'builder/previewImage',
                    payload: {
                      previewImage : file.url || file.thumbUrl,
                      previewVisible : true,
                    }
                  });
                },
                action: '/api/admin/picture/upload',
                headers: {
                  authorization: 'Bearer ' + sessionStorage['token'],
                },
                beforeUpload: (file:any) => {
                  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    message.error('请上传jpg或png格式的图片!');
                    return false;
                  }
                  const isLt2M = file.size / 1024 / 1024 < 2;
                  if (!isLt2M) {
                    message.error('图片大小不可超过2MB!');
                    return false;
                  }
                  return true;
                },
                onChange: (info:any) => {
                  let fileList = info.fileList;

                  fileList = fileList.slice(-3);

                  fileList = fileList.map((file:any) => {
                    if (file.response) {
                      file.url = file.response.data.url;
                      file.uid = file.response.data.id;
                    }
                    return file;
                  });

                  fileList = fileList.filter((file:any) => {
                    if (file.response) {
                      return file.response.status === 'success';
                    }
                    return true;
                  });

                  dispatch({
                    type: 'builder/updateImageList',
                    payload: {
                      imageList : fileList,
                    }
                  });
                },
              };

              return (
                <Form.Item 
                  labelCol={control.labelCol?control.labelCol:labelCol} 
                  wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                  label={control.labelName}
                  extra={control.extra}
                >
                  <Upload {...uploadPictureProps}>
                    {imageList >= 3 ? null : uploadButton}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img style={{ width: '100%' }} src={previewImage} />
                  </Modal>
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
    imageList:builder.imageList,
    previewVisible:builder.previewVisible,
    previewImage:builder.previewImage
  }))(BasicForm),
);
