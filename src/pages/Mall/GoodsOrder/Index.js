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
    data:false,
    msg: '',
    url: '',
    status: '',
    loading: false,
    selected: '0',
    advancedSearchExpand: false,
    search:[],
    pagination:[],
    tableLoading:false,
    exportUrl:''
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {
    // 获得url参数
    const params = this.props.location.query;

    // loading
    this.setState({ loading: true });

    this.props.dispatch({
      type: 'action/get',
      payload: {
        actionUrl: 'admin/goodsOrder/index' + stringify(params),
      },
      callback: res => {
        if (res) {
          this.setState({
            search: res.data.search,
            pagination: res.data.pagination,
            data: res.data,
            exportUrl:res.data.exportUrl
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
      return <List
        size="large"
        dataSource={record.goods_order_details}
        renderItem={item => (
          <span>
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar src={item.cover_id} shape="square" size="large" />
                }
                title={<a href={"#/admin/mall/goods/edit?id="+item.goods_id}>{item.goods_name} {item.goods_property_names}</a>}
                description={item.description}
              />
              {<span style={{'marginRight':150,'float':'left'}}>￥{item.goods_price} x {item.num}</span>}
              {<span>￥{item.goods_price * item.num}</span>}
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title={<p style={{'textAlign':'right'}}>商品总金额： ￥311.00 + 运费： ￥50.00 - 店铺红包： ￥0.00 - 平台红包： ￥0.00 - 积分抵扣： ￥0.00 - 卖家优惠： ￥0.00 = 订单总金额： ￥361.00</p>}
              />
            </List.Item>
            <List.Item>
              <List.Item.Meta
                title={<p style={{'textAlign':'right'}}>[ 已支付 ] ￥361.00</p>}
              />
            </List.Item>
          </span>
        )}
      />;
    };

    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '订单号', dataIndex: 'order_no', key: 'order_no' },
      { title: '买家', dataIndex: 'username', key: 'username' },
      { title: '电话', dataIndex: 'phone', key: 'phone' },
      { title: '支付方式', dataIndex: 'pay_type', key: 'pay_type' },
      { title: '状态', dataIndex: 'goods_order_status', key: 'goods_order_status' },
      { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
      { title: '操作', key: 'operation', render: () => <span><Button type="link">拆单发货</Button><Button type="link">订单详情</Button></span> },
    ];

    // 分页切换
    const changePagination = (pagination, filters, sorter) => {

      // 获得url参数
      const params = this.props.location.query;

      this.setState({
        tableLoading: true
      });

      this.props.dispatch({
        type: 'action/get',
        payload: {
          actionUrl: 'admin/goodsOrder/index' + stringify(params),
          pageSize: pagination.pageSize, // 分页数量
          current: pagination.current, // 当前页码
          sortField: sorter.field, // 排序字段
          sortOrder: sorter.order, // 排序规则
          ...filters, // 筛选
          search: this.state.search,
        },
        callback : res => {
          if (res) {
            this.setState({
              search: res.data.search,
              pagination: res.data.pagination,
              data:res.data,
              tableLoading: false
            });
          }
        }
      });
    };

    // 不同状态不同数据
    const getStatusLists = (e) => {

      // 获得url参数
      const params = this.props.location.query;

      this.props.form.validateFields((err, values) => {

        if (values['dateRange'] && values['dateRange']) {
          if (values['dateRange'][0] && values['dateRange'][1]) {
            // 时间标准化
            let dateStart = values['dateRange'][0].format('YYYY-MM-DD HH:mm:ss');
            let dateEnd = values['dateRange'][1].format('YYYY-MM-DD HH:mm:ss');
            // 先清空对象
            values['dateRange'] = [];
            // 重新赋值对象
            values['dateRange'] = [dateStart, dateEnd];
          }
        }

        values['status'] = e.target.value;

        if (!err) {
          this.setState({
            tableLoading: true
          });
          this.props.dispatch({
            type: 'action/get',
            payload: {
              actionUrl: 'admin/goodsOrder/index' + stringify(params),
              ...this.state.pagination,
              search: values,
            },
            callback : res => {
              if (res) {
                this.setState({
                  search: res.data.search,
                  pagination: res.data.pagination,
                  data:res.data,
                  tableLoading: false
                });
              }
            }
          });
        }
      });
    };

    // 搜索
    const onSearch = () => {

      // 获得url参数
      const params = this.props.location.query;

      this.props.form.validateFields((err, values) => {

        if (values['dateRange'] && values['dateRange']) {
          if (values['dateRange'][0] && values['dateRange'][1]) {
            // 时间标准化
            let dateStart = values['dateRange'][0].format('YYYY-MM-DD HH:mm:ss');
            let dateEnd = values['dateRange'][1].format('YYYY-MM-DD HH:mm:ss');
            // 先清空对象
            values['dateRange'] = [];
            // 重新赋值对象
            values['dateRange'] = [dateStart, dateEnd];
          }
        }

        if (!err) {
          this.setState({
            tableLoading: true
          });
          this.props.dispatch({
            type: 'action/get',
            payload: {
              actionUrl: 'admin/goodsOrder/index' + stringify(params),
              ...this.state.pagination,
              search: values,
            },
            callback : res => {
              if (res) {
                this.setState({
                  search: res.data.search,
                  pagination: res.data.pagination,
                  data:res.data,
                  tableLoading: false
                });
              }
            }
          });
        }
      });
    };

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
                    <Radio.Group onChange={getStatusLists}>
                      <Radio.Button value="ALL">全部订单({this.state.data.totalNum})</Radio.Button>
                      <Radio.Button value="NOT_PAID">等待付款({this.state.data.notPaidNum})</Radio.Button>
                      <Radio.Button value="PAID">待发货({this.state.data.paidNum})</Radio.Button>
                      <Radio.Button value="SEND">已发货({this.state.data.sendNum})</Radio.Button>
                      <Radio.Button value="SUCCESS">已完成({this.state.data.successNum})</Radio.Button>
                      <Radio.Button value="CLOSE">已关闭({this.state.data.closeNum})</Radio.Button>
                      <Radio.Button value="REFUND">退款中({this.state.data.refundNum})</Radio.Button>
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
                <Tag color="#2db7f5" style={{ marginTop:2,paddingBottom:5,paddingTop:5,paddingLeft:10,paddingRight:10 }}>订单金额：{this.state.data.totalMoney}元</Tag>
              </Col>
              <Col span={22}>
                <div className={styles.floatRight}>
                  <Form layout="inline">
                    <Form.Item>
                      {getFieldDecorator(`title`, {
                        initialValue: ''
                      })(
                        <Input style={{ width: 220 }} placeholder="订单编号/买家账号/买家手机号" />,
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator(`status`, {
                        initialValue: 'ALL'
                      })(
                        <Select style={{ width: 120 }}>
                          <Option value="ALL">全部订单</Option>
                          <Option value="NOT_PAID">等待付款</Option>
                          <Option value="PAID">待发货</Option>
                          <Option value="SEND">已发货</Option>
                          <Option value="SUCCESS">已完成</Option>
                          <Option value="CLOSE">已关闭</Option>
                          <Option value="REFUND">退款中</Option>
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item>
                      <Button onClick={() => onSearch()}>搜索</Button>
                    </Form.Item>
                    <Form.Item>
                      <Button href={this.state.exportUrl} target="_blank" type="primary">导出</Button>
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
                    {getFieldDecorator(`payType`, {
                      initialValue: '0'
                    })(
                      <Select style={{ width: 180 }}>
                        <Option value="0">请选择付款方式</Option>
                        <Option value="WECHAT_APP">微信APP支付</Option>
                        <Option value="WECHAT_JSAPI">微信公众号支付</Option>
                        <Option value="WECHAT_NATIVE">微信电脑网站支付</Option>
                        <Option value="ALIPAY_PAGE">支付宝电脑网站支付</Option>
                        <Option value="ALIPAY_APP">支付宝APP支付</Option>
                        <Option value="ALIPAY_WAP">支付宝手机网站支付</Option>
                        <Option value="ALIPAY_F2F">支付宝当面付</Option>
                        <Option value="ALIPAY_JS">支付宝JSAPI</Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator(`payType`, {
                      initialValue: '0'
                    })(
                      <Select style={{ width: 180 }}>
                        <Option value="0">请选择订单类型</Option>
                        <Option value="MALL">普通订单</Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator(`dateRange`)(
                      <RangePicker
                        showTime={true}
                        style={{ width: 360 }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator(`consignee`, {
                      initialValue: ''
                    })(
                      <Input style={{ width: 180 }} placeholder="收货人姓名" />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator(`phone`, {
                      initialValue: ''
                    })(
                      <Input style={{ width: 180 }} placeholder="收货人手机号" />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator(`address`, {
                      initialValue: ''
                    })(
                      <Input style={{ width: 260 }} placeholder="收货人地址" />
                    )}
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
              rowKey="id"
              key={`table-${this.state.data.lists && this.state.data.lists.length}`}
              defaultExpandAllRows={true}
              columns={columns}
              expandedRowRender={expandedRowRender}
              dataSource={this.state.data.lists}
              pagination={this.state.pagination}
              loading={this.state.tableLoading}
              onChange={changePagination}
            />
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default IndexPage;