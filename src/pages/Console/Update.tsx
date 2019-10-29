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
        actionUrl: 'admin/console/update',
      },
      callback: res => {
        if (res) {
          this.setState({ ...res, loading: false });
        }
      },
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
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
                      <Button type="primary" onClick={this.showModal}>立即升级</Button>
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
                  width={'700px'}
                  footer={false}
                  closable={false}
                  // maskClosable={false}
                >
                  <div>正在进行1.0.2版本升级，此过程将会持续几分钟，请您耐心等待。</div>
                  <br></br>
                  <div>
                    <Steps size="small" current={1}>
                      <Step title="下载文件" />
                      <Step title="备份数据" />
                      <Step title="更新数据库" />
                      <Step title="更新程序" />
                      <Step title="升级完成" />
                    </Steps>
                  </div>
                  <br></br>
                  <div style={{ textAlign: 'center' }}>
                    <Progress type="circle" percent={75} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    共计166个文件需要更新/已完成10个（
                    <span style={{ color: '#cf1322' }}>注意：请勿关闭本页面</span>）
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
