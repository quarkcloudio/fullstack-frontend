import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import styles from './Style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';

import {
  Card,
  Row,
  Col,
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
  Steps,
  Cascader,
  TreeSelect,
  Divider,
  Typography,
  Table,
  Popconfirm,
  Affix
} from 'antd';

const {  RangePicker } = DatePicker;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { Step } = Steps;
const { TreeNode } = TreeSelect;
const { Title } = Typography;

@connect(({ model }) => ({
  model,
}))

@Form.create()

class CreatePage extends PureComponent {

  state = {
    msg: '',
    url: '',
    data: {
      categorys:[],
      shops:[],
      goodsUnits:[],
    },
    status: '',
    goodsMode:1,
    showFreightInfo:true,
    showSpecialInfo:false,
    shopId:'',
    categoryId:'',
    systemSpus:false,
    shopSpus:false,
    skus:false,
    checkedSkus:[],
    loading: false,
    unitLoading:false,
    layoutLoading:false,
    columns:[],
    dataSource:false,
    checkedSkuValues:[],
    coverId:false,
    fileId:false,
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {

    // 获得url参数
    const params = this.props.location.query;

    // loading
    this.setState({ loading: true });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/goods/create',
      },
      callback: (res) => {
        if (res) {
          this.setState({ data: res.data});
        }
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    const attrFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };

    let state = {
      loading: false,
    };

    // 单图片上传模式
    let uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    const handleEditorUpload = (param) => {
      const serverURL = '/api/admin/picture/upload';
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
  
      const successFn = (response) => {
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
  
      const progressFn = (event) => {
        // 上传进度发生变化时调用param.progress
        param.progress((event.loaded / event.total) * 100);
      };
  
      const errorFn = (response) => {
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

    return (
      <PageHeaderWrapper title={false}>
        <div style={{background:'#fff',padding:'20px'}}>
          <Steps current={1} style={{width:'100%',margin:'30px auto'}}>
            <Step title="填写商品详情" />
            <Step title="上传商品图片" />
            <Step title="商品发布成功" />
          </Steps>
          <div className="steps-content" style={{width:'100%',margin:'40px auto'}}>
            <Form style={{ marginTop: 8 }}>
              <Form.Item
                {...formItemLayout}
              >
                <Row gutter={10}>
                  <Col className="gutter-row" span={4}>
                    <div className="gutter-box">
                      <Upload
                        name={'file'}
                        listType={"picture-card"}
                        showUploadList={false}
                        action={'/api/admin/picture/upload'}
                        headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                        beforeUpload = {(file) => {
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
                        }}
                        onChange = {(info) => {
                          if (info.file.status === 'done') {
                            // Get this url from response in real world.
                            if (info.file.response.status === 'success') {
                              let fileList = [];
                              if (info.file.response) {
                                info.file.url = info.file.response.data.url;
                                info.file.uid = info.file.response.data.id;
                                info.file.id = info.file.response.data.id;
                              }
                              fileList[0] = info.file;
                              this.setState({ coverId: fileList });
                            } else {
                              message.error(info.file.response.msg);
                            }
                          }
                        }}
                      >
                        {this.state.coverId ? (
                          <img src={this.state.coverId[0]['url']} alt="avatar" width={80} />
                        ) : (uploadButton)}
                      </Upload>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <div className="gutter-box">
                      <Upload
                        name={'file'}
                        listType={"picture-card"}
                        showUploadList={false}
                        action={'/api/admin/picture/upload'}
                        headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                        beforeUpload = {(file) => {
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
                        }}
                        onChange = {(info) => {
                          if (info.file.status === 'done') {
                            // Get this url from response in real world.
                            if (info.file.response.status === 'success') {
                              let fileList = [];
                              if (info.file.response) {
                                info.file.url = info.file.response.data.url;
                                info.file.uid = info.file.response.data.id;
                                info.file.id = info.file.response.data.id;
                              }
                              fileList[0] = info.file;
                              this.setState({ coverId: fileList });
                            } else {
                              message.error(info.file.response.msg);
                            }
                          }
                        }}
                      >
                        {this.state.coverId ? (
                          <img src={this.state.coverId[0]['url']} alt="avatar" width={80} />
                        ) : (uploadButton)}
                      </Upload>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <div className="gutter-box">
                      <Upload
                        name={'file'}
                        listType={"picture-card"}
                        showUploadList={false}
                        action={'/api/admin/picture/upload'}
                        headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                        beforeUpload = {(file) => {
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
                        }}
                        onChange = {(info) => {
                          if (info.file.status === 'done') {
                            // Get this url from response in real world.
                            if (info.file.response.status === 'success') {
                              let fileList = [];
                              if (info.file.response) {
                                info.file.url = info.file.response.data.url;
                                info.file.uid = info.file.response.data.id;
                                info.file.id = info.file.response.data.id;
                              }
                              fileList[0] = info.file;
                              this.setState({ coverId: fileList });
                            } else {
                              message.error(info.file.response.msg);
                            }
                          }
                        }}
                      >
                        {this.state.coverId ? (
                          <img src={this.state.coverId[0]['url']} alt="avatar" width={80} />
                        ) : (uploadButton)}
                      </Upload>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <div className="gutter-box">
                      <Upload
                        name={'file'}
                        listType={"picture-card"}
                        showUploadList={false}
                        action={'/api/admin/picture/upload'}
                        headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                        beforeUpload = {(file) => {
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
                        }}
                        onChange = {(info) => {
                          if (info.file.status === 'done') {
                            // Get this url from response in real world.
                            if (info.file.response.status === 'success') {
                              let fileList = [];
                              if (info.file.response) {
                                info.file.url = info.file.response.data.url;
                                info.file.uid = info.file.response.data.id;
                                info.file.id = info.file.response.data.id;
                              }
                              fileList[0] = info.file;
                              this.setState({ coverId: fileList });
                            } else {
                              message.error(info.file.response.msg);
                            }
                          }
                        }}
                      >
                        {this.state.coverId ? (
                          <img src={this.state.coverId[0]['url']} alt="avatar" width={80} />
                        ) : (uploadButton)}
                      </Upload>
                    </div>
                  </Col>
                  <Col className="gutter-row" span={4}>
                    <div className="gutter-box">
                      <Upload
                        name={'file'}
                        listType={"picture-card"}
                        showUploadList={false}
                        action={'/api/admin/picture/upload'}
                        headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                        beforeUpload = {(file) => {
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
                        }}
                        onChange = {(info) => {
                          if (info.file.status === 'done') {
                            // Get this url from response in real world.
                            if (info.file.response.status === 'success') {
                              let fileList = [];
                              if (info.file.response) {
                                info.file.url = info.file.response.data.url;
                                info.file.uid = info.file.response.data.id;
                                info.file.id = info.file.response.data.id;
                              }
                              fileList[0] = info.file;
                              this.setState({ coverId: fileList });
                            } else {
                              message.error(info.file.response.msg);
                            }
                          }
                        }}
                      >
                        {this.state.coverId ? (
                          <img src={this.state.coverId[0]['url']} alt="avatar" width={80} />
                        ) : (uploadButton)}
                      </Upload>
                    </div>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
                <Button type="primary" htmlType="submit">
                  下一步，确认商品发布
                </Button>
              </Form.Item>

            </Form>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CreatePage;