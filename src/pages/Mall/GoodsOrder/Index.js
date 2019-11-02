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
  Divider,
  List,
  Avatar
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
    data:[],
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
      type: 'list/info',
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

    const expandedRowRender = (record, index) => {
      // const columns = [
      //   { 
      //     title: '商品封面',
      //     dataIndex: 'cover_id',
      //     key: 'cover_id',
      //     render: (text, row) => (
      //       <img src={text} width={40} height={40}></img>
      //     )
      //   },
      //   { title: '商品名称', dataIndex: 'goods_name', key: 'goods_name' },
      //   { title: '单价', dataIndex: 'goods_price', key: 'goods_price' },
      //   { title: '数量', dataIndex: 'num', key: 'num' },
      //   {
      //     title: '操作',
      //     dataIndex: 'operation',
      //     key: 'operation',
      //     render: () => (
      //       <span>
      //         <a>查看商品</a>
      //       </span>
      //     ),
      //   },
      // ];
      // return <Table columns={columns} dataSource={record.goods_order_details} pagination={false} />;

      return <List
        size="large"
        dataSource={record.goods_order_details}
        renderItem={item => (
          <List.Item
            actions={[<a href={"#/admin/mall/goods/edit?id="+item.goods_id}>编辑商品</a>]}
          >
            <List.Item.Meta
              avatar={
                <Avatar src={item.cover_id} shape="square" size="large" />
              }
              title={<a href={"#/admin/mall/goods/edit?id="+item.goods_id}>{item.goods_name} {item.goods_property_names}</a>}
              description={item.description}
            />
            {<span>￥{item.goods_price} x {item.num}</span>}
          </List.Item>
        )}
      />;

    };

    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '订单号', dataIndex: 'order_no', key: 'order_no' },
      { title: '买家', dataIndex: 'username', key: 'username' },
      { title: '电话', dataIndex: 'phone', key: 'phone' },
      { title: '支付方式', dataIndex: 'pay_type', key: 'pay_type' },
      { title: '价格', dataIndex: 'amount', key: 'amount' },
      { title: '状态', dataIndex: 'status', key: 'status' },
      { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
      { title: '操作', key: 'operation', render: () => <span><a>发货</a> <a>退款</a> <a>查看详情</a></span> },
    ];

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
              <Form.Item>
                <Select defaultValue="付款方式" style={{ width: 120 }}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Select defaultValue="订单类型" style={{ width: 120 }}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Input style={{ width: 140 }} placeholder="会员绑定手机号" />
              </Form.Item>
              <Form.Item>
                <Input style={{ width: 140 }} placeholder="收货人姓名" />
              </Form.Item>
              <Form.Item>
                <Input style={{ width: 140 }} placeholder="收货人手机号" />
              </Form.Item>
              <Form.Item>
                <Input style={{ width: 180 }} placeholder="收货人地址" />
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
              columns={columns}
              expandedRowRender={expandedRowRender}
              dataSource={this.state.data}
            />
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default IndexPage;