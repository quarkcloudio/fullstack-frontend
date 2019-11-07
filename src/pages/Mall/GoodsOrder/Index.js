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
      return <div style={{'backgroundColor':'#ffffff','padding':'0px 10px'}}>
        <p style={{'textAlign':'left','margin':0,'borderBottom':'1px solid #e8e8e8','padding':'20px 0px'}}>
          <span style={{'color':'#22BAA0'}}>温馨提示：</span>
          {record.status == '未支付' ? '如果商品被恶意拍下了，您可以关闭订单。' : null}
          {record.status == '支付成功' ? '交易已成功，如果买家提出售后要求，需卖家与买家协商，做好售后服务。' : null}
          {record.status == '转入退款' ? '买家提出退款，请与买家联系。' : null}
          {record.status == '交易关闭' ? '此订单交易已关闭。' : null}
          {record.status == '支付失败' ? '支付失败，您可以关闭订单。' : null}
        </p>
        <p style={{'textAlign':'left','margin':0,'borderBottom':'1px solid #e8e8e8','padding':'10px 0px'}}>收货信息：{record.consignee} ，{record.goods_order_phone} ，{record.address}</p>
        <p style={{'textAlign':'left','margin':0,'borderBottom':'1px solid #e8e8e8','padding':'10px 0px'}}>配送状态：<span style={{'color':'#5bb85d'}}>{record.goods_order_status}</span></p>
        <List
          size="large"
          dataSource={record.goods_order_details}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar src={item.cover_id} shape="square" size="large" />
                }
                title={<a href={"#/admin/mall/goods/edit?id="+item.goods_id}>{item.goods_name} {item.goods_property_names}</a>}
                description={item.description}
              />
              {<span style={{'marginRight':150,'float':'left'}}>￥{item.goods_price}</span>}
              {<span style={{'marginRight':150,'float':'left','color':'#ff3535'}}>x {item.num}</span>}
              {<span>￥{item.goods_price * item.num}</span>}
            </List.Item>
          )}
        />
        <p style={{'textAlign':'right','margin':0,'borderBottom':'1px solid #e8e8e8','borderTop':'1px solid #e8e8e8','padding':'10px 0px'}}><span>￥{record.buyer_pay_amount}（商品总金额） + ￥{record.freight_amount}（运费） - ￥{record.mdiscount_amount}（店铺优惠） - ￥{record.discount_amount}（平台优惠） -  ￥{record.point_amount}（积分抵扣） = ￥{record.total_amount}</span></p>
        <p style={{'textAlign':'right','margin':0,'borderBottom':'1px solid #e8e8e8','padding':'10px 0px'}}>
          <span style={{'color':record.status == '支付成功'?'#5bb85d':'#ff3535'}}>[ {record.status} ]</span>
          ￥{record.total_amount}
        </p>
        <p style={{'textAlign':'right','marginTop':0,'borderBottom':'1px solid #e8e8e8','padding':'10px 0px'}}><strong>订单总金额：</strong><strong style={{'color':'#ff3535'}}>￥{record.total_amount}</strong></p>
        <p style={{'textAlign':'right','margin':0,'height':40}}>
          <span style={{'float':'left'}}><Button>打印订单</Button></span>
          <span style={{'float':'right'}}><Button>一键发货</Button> <Button href={"#/admin/mall/goodsOrder/Info?id="+record.id} type="primary">订单详情</Button></span>
        </p>
      </div>;
    };

    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '订单号', dataIndex: 'order_no', key: 'order_no' },
      { title: '买家', dataIndex: 'username', key: 'username' },
      { title: '联系方式', dataIndex: 'phone', key: 'phone' },
      { title: '支付方式', dataIndex: 'pay_type', key: 'pay_type' },
      { title: '下单时间', dataIndex: 'created_at', key: 'created_at' },
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