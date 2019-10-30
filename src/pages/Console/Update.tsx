import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './Update.less';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';

import {
  Row,
  Col,
  Icon,
  Input,
  Form,
  Button,
  Modal,
  message,
  Badge,
  Card,
  Steps,
  Collapse,
  Typography,
  Divider,
  Progress,
  Spin,
  Popconfirm
} from 'antd';

const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const Step = Steps.Step;
const Panel = Collapse.Panel;
const { Title } = Typography;

@connect(({ model }) => ({
  model,
}))
@Form.create()
class UpdatePage extends PureComponent {
  // 定义要操作的模型名称
  modelName = 'console';

  state = {
    msg: '',
    url: '',
    data: {},
    status: '',
    pagination: {},
    loading: false,
    visible: false,
    percent:0,
    current:0,
    actionStatus:'',
    downloadLoading:false,
    extractLoading:false,
    updateFileLoading:false,
    updateDatabaseLoading:false,
    clearCacheLoading:false,
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {
    this.checkUpdate();
  }

  checkUpdate = () => {
    // loading
    this.setState({ loading: true });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/console/update'
      },
      callback: res => {
        if (res) {
          this.setState({ ...res, loading: false });
        }
      },
    });
  };

  upgrade = () => {
    // loading
    this.download();
  };

  download = () => {
    // loading
    this.setState({ downloadLoading: true ,actionStatus:'正在下载软件包...'});

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/console/download',
        version:this.state.data.repository.name,
      },
      callback: res => {
        if (res.status == 'success') {
          this.setState({ percent:20, downloadLoading: false,current:1,actionStatus:'软件包下载完成！' });
          this.extract();
        } else {
          this.setState({ downloadLoading: false ,actionStatus:'下载软件包失败！'});
        }
      },
    });
  };

  extract = () => {
    // loading
    this.setState({ extractLoading: true,actionStatus:'正在解压软件包...' });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/console/extract',
        version:this.state.data.repository.name,
      },
      callback: res => {
        if (res.status == 'success') {
          this.setState({ percent:40, extractLoading: false,current:2 ,actionStatus:'解压完成！'});
          this.updateFile();
        } else {
          this.setState({ extractLoading: false ,actionStatus:'解压失败！'});
        }
      },
    });
  };

  updateFile = () => {
    // loading
    this.setState({ updateFileLoading: true,actionStatus:'正在更新程序...' });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/console/updateFile',
        version:this.state.data.repository.name,
      },
      callback: res => {
        if (res.status == 'success') {
          this.setState({ percent:60, updateFileLoading: false,current:3 ,actionStatus:'更新程序完成！'});
          this.updateDatabase();
        } else {
          this.setState({ updateFileLoading: false ,actionStatus:'更新程序失败！'});
        }
      },
    });
  };

  updateDatabase = () => {
    // loading
    this.setState({ updateDatabaseLoading: true,actionStatus:'正在更新数据库...' });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/console/updateDatabase',
        version:this.state.data.repository.name,
      },
      callback: res => {
        if (res.status == 'success') {
          this.setState({ percent:80, updateDatabaseLoading: false,current:4 ,actionStatus:'更新数据库完成！'});
          this.clearCache();
        } else {
          this.setState({ updateDatabaseLoading: false ,actionStatus:'更新数据库失败！'});
        }
      },
    });
  };

  clearCache = () => {
    // loading
    this.setState({ clearCacheLoading: true,actionStatus:'正在清理缓存...' });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/console/clearCache',
        version:this.state.data.repository.name,
      },
      callback: res => {
        if (res.status == 'success') {
          this.setState({ percent:90, clearCacheLoading: false,current:5 ,actionStatus:'缓存清理完成！'});
          this.finish();
        } else {
          this.setState({ clearCacheLoading: false ,actionStatus:'缓存清理失败！'});
        }
      },
    });
  };

  finish = () => {
    this.setState({ percent:100, current:6 ,actionStatus:'恭喜您升级完成，系统重启中...'});
    setInterval(() => location.reload(), 3000);
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    if(this.state.current == 0) {
      this.upgrade();
    }
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Spin spinning={this.state.loading} tip="Loading...">
        <div className={styles.container}>
          <Row gutter={16}>
            <Col span={24}>
              <Card bordered={false}>
                <div>当前版本{this.state.data.app_version}</div>
                <br></br>
                {this.state.data.can_update ?
                  <span>
                    <Divider>{this.state.data.repository.name}更新日志</Divider>
                    <div>
                      {this.state.data.repository.body}
                    </div>
                    <div>
                      <br></br>
                      <Popconfirm
                        title="请确认您是否已对系统进行了备份！"
                        onConfirm={this.showModal}
                        okText="是"
                        cancelText="否"
                      >
                        <Button type="primary">立即升级</Button>
                      </Popconfirm>
                    </div>
                  </span>
                :
                  <span>
                    <div>您的系统已经是最新版本了</div>
                    <br></br>
                    <Button onClick={this.checkUpdate}>检查更新</Button>
                  </span>
                }
                <Modal
                  title="系统升级"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  width={'860px'}
                  footer={false}
                  closable={false}
                  // maskClosable={false}
                >
                  <div>正在进行{this.state.data.can_update ? this.state.data.repository.name : null}版本升级，此过程将会持续几分钟，请您耐心等待。</div>
                  <br></br>
                  <div>
                    <Steps size="small" current={this.state.current}>
                      <Step title="下载文件" icon={ this.state.downloadLoading ? <Icon type="loading" /> : false} />
                      <Step title="解压文件" icon={ this.state.extractLoading ? <Icon type="loading" /> : false} />
                      <Step title="更新程序" icon={ this.state.updateFileLoading ? <Icon type="loading" /> : false}/>
                      <Step title="更新数据库" icon={ this.state.updateDatabaseLoading ? <Icon type="loading" /> : false} />
                      <Step title="清除缓存" icon={ this.state.clearCacheLoading ? <Icon type="loading" /> : false}/>
                      <Step title="升级完成" />
                    </Steps>
                  </div>
                  <br></br>
                  <div style={{ textAlign: 'center' }}>
                    <Progress type="circle" percent={this.state.percent} />
                  </div>
                  <br></br>
                  <div style={{ textAlign: 'center' }}>
                    {this.state.actionStatus}
                    <br></br>
                    <br></br>
                    {this.state.current !=6 ? <span>（<span style={{ color: '#cf1322' }}>系统升级中，请勿关闭本页面</span>）</span>: null}
                  </div>
                  <br></br>
                </Modal>
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
    );
  }
}

export default UpdatePage;
