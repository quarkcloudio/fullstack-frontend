import React, { useEffect } from 'react';
import styles from './BasicForm.less';
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
  Card,
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
  pageTitle:string;
  name:string;
  pageRandom:string;
  previewImage: string;
  previewVisible: boolean;
  formLoading: boolean;
  action?: string;
  controls?: [];
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
    pageTitle,
    name,
    pageRandom,
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
        type: 'basicForm/getFormInfo',
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

        controls.map((control:any,key:any) => {
          if(control.type == 'image' || control.type == 'file') {
            values[control.name] = control.list;
          }

          if(control.type == 'datePicker') {
            values[control.name] = values[control.name].format('YYYY-MM-DD HH:mm:ss');
          }

          if(control.type == 'editor') {
            values[control.name] = values[control.name].toHTML();
          }
        })

        console.log(values)

        dispatch({
          type: 'basicForm/formSubmit',
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
      type: 'basicForm/previewImage',
      payload: {
        previewImage : null,
        previewVisible : false,
      }
    });
   };

  return (
  <div className={styles.container}>
    <Card
      size="small"
      title={pageTitle}
      bordered={false}
      extra={<a href="javascript:history.go(-1)">返回上一页</a>}
    >
      <Spin spinning={formLoading} >
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
                // 多图片上传模式
                if(control.mode == "multiple") {
                  let uploadButton = (
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">{control.button}</div>
                    </div>
                  );
                  var getFileList = control.list;
                  return (
                    <Form.Item 
                      labelCol={control.labelCol?control.labelCol:labelCol} 
                      wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                      label={control.labelName}
                      extra={control.extra}
                    >
                      <Upload
                        name={'file'}
                        listType={"picture-card"}
                        fileList={getFileList}
                        multiple={true}
                        onPreview={(file:any) => {
                          dispatch({
                            type: 'basicForm/previewImage',
                            payload: {
                              previewImage : file.url || file.thumbUrl,
                              previewVisible : true,
                            }
                          }
                        )}}
                        action={'/api/admin/picture/upload'}
                        headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                        beforeUpload = {(file:any) => {
                          let canUpload = false;
                          for(var i = 0; i < control.limitType.length; i++) {
                            if(control.limitType[i] == file.type) {
                              canUpload = true;
                            }
                          }
                          if (!canUpload) {
                            message.error('请上传正确格式的图片!');
                            return false;
                          }
                          const isLtSize = file.size / 1024 / 1024 < control.limitSize;
                          if (!isLtSize) {
                            message.error('图片大小不可超过'+control.limitSize+'MB!');
                            return false;
                          }
                          return true;
                        }}
                        onChange = {(info:any) => {
                          let fileList = info.fileList;
                          fileList = fileList.slice(-control.limitNum);
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
                            type: 'basicForm/updateFileList',
                            payload: {
                              fileList : fileList,
                              controlName : control.name
                            }
                          });
                        }}
                      >
                        {control.list >= 3 ? null : uploadButton}
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
                } else {
                  // 单图片上传模式
                  let uploadButton = (
                    <div>
                      <Icon type="plus" />
                      <div className="ant-upload-text">{control.button}</div>
                    </div>
                  );

                  return (
                    <Form.Item 
                      labelCol={control.labelCol?control.labelCol:labelCol} 
                      wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                      label={control.labelName}
                      extra={control.extra}
                    >
                      <Upload
                        name={'file'}
                        listType={"picture-card"}
                        showUploadList={false}
                        action={'/api/admin/picture/upload'}
                        headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                        beforeUpload = {(file:any) => {
                          let canUpload = false;
                          for(var i = 0; i < control.limitType.length; i++) {
                            if(control.limitType[i] == file.type) {
                              canUpload = true;
                            }
                          }
                          if (!canUpload) {
                            message.error('请上传正确格式的图片!');
                            return false;
                          }
                          const isLtSize = file.size / 1024 / 1024 < control.limitSize;
                          if (!isLtSize) {
                            message.error('图片大小不可超过'+control.limitSize+'MB!');
                            return false;
                          }
                          return true;
                        }}
                        onChange = {(info:any) => {
                          if (info.file.status === 'done') {
                            // Get this url from response in real world.
                            if (info.file.response.status === 'success') {
                              let fileList = [];

                              if (info.file.response) {
                                info.file.url = info.file.response.data.url;
                                info.file.uid = info.file.response.data.id;
                              }

                              fileList[0] = info.file;
                              dispatch({
                                type: 'basicForm/updateFileList',
                                payload: {
                                  fileList : fileList,
                                  controlName : control.name
                                }
                              });
                            } else {
                              message.error(info.file.response.msg);
                            }
                          }
                        }}
                      >
                        {control.list ? (
                          <img src={control.list[0]['url']} alt="avatar" width={80} />
                        ) : (uploadButton)}
                      </Upload>
                    </Form.Item>
                  );
                }
              }

              if(control.type=='file') {
                var getFileList = control.list;
                return (
                  <Form.Item 
                    labelCol={control.labelCol?control.labelCol:labelCol} 
                    wrapperCol={control.wrapperCol?control.wrapperCol:wrapperCol} 
                    label={control.labelName}
                    extra={control.extra}
                  >
                    <Upload
                      name={'file'}
                      fileList={getFileList}
                      multiple={true}
                      action={'/api/admin/picture/upload'}
                      headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                      beforeUpload = {(file:any) => {
                        let canUpload = false;
                        for(var i = 0; i < control.limitType.length; i++) {
                          if(control.limitType[i] == file.type) {
                            canUpload = true;
                          }
                        }
                        if (!canUpload) {
                          message.error('请上传正确格式的文件!');
                          return false;
                        }
                        const isLtSize = file.size / 1024 / 1024 < control.limitSize;
                        if (!isLtSize) {
                          message.error('文件大小不可超过'+control.limitSize+'MB!');
                          return false;
                        }
                        return true;
                      }}
                      onChange = {(info:any) => {
                        let fileList = info.fileList;
                        fileList = fileList.slice(-control.limitNum);
                        fileList = fileList.map((file:any) => {
                          if (file.response) {
                            if(file.response.status === 'success') {
                              file.url = file.response.data.url;
                              file.uid = file.response.data.id;
                            }
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
                          type: 'basicForm/updateFileList',
                          payload: {
                            fileList : fileList,
                            controlName : control.name
                          }
                        });
                      }}
                    >
                      <Button>
                        <Icon type="upload" /> {control.button}
                      </Button>
                    </Upload>
                  </Form.Item>
                );
              }

            })}

          {!!submitName && 
            <Form.Item {...submitLayout} >
              <Button type = {submitType} htmlType="submit" loading={submitting}>
                {submitName}
              </Button>
            </Form.Item>
          }

        </Form>
      </Spin>
    </Card>
  </div>
  );
};

export default Form.create<BasicFormProps>()(
  connect(({ loading ,basicForm}: ConnectState) => ({
    pageTitle: basicForm.pageTitle,
    name: basicForm.name,
    submitting: loading.effects['basicForm/formSubmit'],
    controls: basicForm.controls,
    wrapperCol: basicForm.wrapperCol,
    labelCol: basicForm.labelCol,
    submitName: basicForm.submitName,
    submitType: basicForm.submitType,
    submitLayout: basicForm.submitLayout,
    action: basicForm.action,
    formLoading: basicForm.formLoading,
    previewVisible:basicForm.previewVisible,
    previewImage:basicForm.previewImage,
    pageRandom:basicForm.pageRandom
  }))(BasicForm),
);
