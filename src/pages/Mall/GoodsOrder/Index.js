import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { stringify } from 'qs';
import styles from './Style.less';

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
  Table,
  Badge,
  Menu,
  Dropdown,
  Divider
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@connect(({ model }) => ({
  model,
}))

@Form.create()

class IndexPage extends PureComponent {
  state = {
    msg: '',
    url: '',
    status: '',
    loading: false,
    selected: '0',
    advancedSearchExpand: false,
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
        actionUrl: 'admin/goodsOrder/index' + stringify(params),
      },
      callback: res => {
        if (res) {
          this.setState({
            data: res.data,
          });
        }
      },
    });
  }

  render() {

    const { getFieldDecorator, getFieldValue } = this.props.form;

    // 展开或收缩高级搜索
    const toggle = () => {
      this.setState({
        advancedSearchExpand: !this.state.advancedSearchExpand
      });
    };

    const expandedRowRender = () => {
      const columns = [
        { title: '商品封面', dataIndex: 'date', key: 'date' },
        { title: '商品名称', dataIndex: 'date', key: 'date' },
        { title: '单价', dataIndex: 'name', key: 'name' },
        { title: '数量', dataIndex: 'name', key: 'name' },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: () => (
            <span className="table-operation">
              <a>查看商品</a>
            </span>
          ),
        },
      ];
  
      const data = [];
      for (let i = 0; i < 3; ++i) {
        data.push({
          key: i,
          date: '2014-12-24 23:12:00',
          name: 'This is production name',
          upgradeNum: 'Upgraded: 56',
        });
      }
      return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    const columns = [
      { title: 'ID', dataIndex: 'name', key: 'name' },
      { title: '订单号', dataIndex: 'platform', key: 'platform' },
      { title: '联系人', dataIndex: 'version', key: 'version' },
      { title: '电话', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      { title: '支付方式', dataIndex: 'creator', key: 'creator' },
      { title: '价格', dataIndex: 'createdAt', key: 'createdAt' },
      { title: '状态', dataIndex: 'createdAt', key: 'createdAt' },
      { title: '支付时间', dataIndex: 'createdAt', key: 'createdAt' },
      { title: '操作', key: 'operation', render: () => <span><a>发货</a> <a>退款</a> <a>查看详情</a></span> },
    ];
  
    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        name: 'Screem',
        platform: 'iOS',
        version: '10.3.4.5654',
        upgradeNum: 500,
        creator: 'Jack',
        createdAt: '2014-12-24 23:12:00',
      });
    }

    return (
      <PageHeaderWrapper title={false}>
        <div className={styles.container}>
          <div className={styles.tableHeader}>
            <Row type="flex" justify="start">
              <Col span={2}>
                <h5 className={styles.tableHeaderTitle}>订单列表</h5>
              </Col>
              <Col span={22}>
                <div className={styles.floatRight}>
                <Form layout="inline">
                  <Form.Item >
                    <Radio.Group>
                      <Radio.Button value="large">全部订单(10)</Radio.Button>
                      <Radio.Button value="default">等待付款(10)</Radio.Button>
                      <Radio.Button value="small">待发货(10)</Radio.Button>
                      <Radio.Button value="small">发货中(10)</Radio.Button>
                      <Radio.Button value="small">已发货(10)</Radio.Button>
                      <Radio.Button value="small">已完成(10)</Radio.Button>
                      <Radio.Button value="small">已关闭(10)</Radio.Button>
                      <Radio.Button value="small">退款中(10)</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Form>
                </div>
              </Col>
            </Row>
          </div>

          <Divider style={{ marginBottom: 10,marginTop: 10 }} />
          <div className={styles.tableToolBar}>
            <Row type="flex" justify="start">
              <Col span={2}>
                <Tag color="#2db7f5" style={{ marginTop:2,paddingBottom:5,paddingTop:5,paddingLeft:10,paddingRight:10 }}>订单金额：2000.00元</Tag>
              </Col>
              <Col span={22}>
                <div className={styles.floatRight}>
                  <Form layout="inline">
                    <Form.Item>
                      <Input style={{ width: 220 }} placeholder="商品名称/订单编号/买家账号" />
                    </Form.Item>
                    <Form.Item>
                      <RangePicker style={{ width: 220 }}  />
                    </Form.Item>
                    <Form.Item>
                      <Select defaultValue="全部" style={{ width: 120 }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>
                          Disabled
                        </Option>
                        <Option value="Yiminghe">yiminghe</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button>搜索</Button>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary">导出</Button>
                    </Form.Item>
                    <Form.Item style={{ marginRight: 10 }}>
                      <a style={{ fontSize: 12 }} onClick={toggle}>
                        高级搜索 <Icon type={this.state.advancedSearchExpand ? 'up' : 'down'} />
                      </a>
                    </Form.Item>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
      <div
        className={styles.tableAdvancedSearchBar}
        style={{ display: this.state.advancedSearchExpand ? 'block' : 'none' }}
      >
        <Row>
          <Col span={24}>
            <Form layout="inline">
              <Form.Item >
                <Input />
              </Form.Item>
              <Form.Item >
                <Button>搜索</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>

          <div className={styles.tableData}>
            <Table
              className="components-table-demo-nested"
              columns={columns}
              expandedRowRender={expandedRowRender}
              dataSource={data}
            />
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default IndexPage;