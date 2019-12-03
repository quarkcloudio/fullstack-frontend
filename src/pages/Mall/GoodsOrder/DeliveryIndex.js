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
        actionUrl: 'admin/goodsOrder/deliveryIndex' + stringify(params),
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
        <p style={{'textAlign':'left','margin':0,'borderBottom':'1px solid #e8e8e8','padding':'10px 0px'}}>收货信息：{record.consignee_name} ，{record.consignee_phone} ，{record.consignee_address}</p>
        <p style={{'textAlign':'left','margin':0,'borderBottom':'1px solid #e8e8e8','padding':'10px 0px'}}>发货单状态：<span style={{'color':'#5bb85d'}}>{record.status ==1 ? '待发货' : '已发货'}</span></p>
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
            </List.Item>
          )}
        />
        <p style={{'textAlign':'right','marginTop':0,'borderBottom':'1px solid #e8e8e8','borderTop':'1px solid #e8e8e8','padding':'10px 0px'}}>购买账号：{record.username}（{record.phone}）</p>
        <p style={{'textAlign':'right','margin':0,'height':40}}>
          <span style={{'float':'left'}}><Button>打印发货单</Button></span>
          <span style={{'float':'right'}}><Button href={"#/admin/mall/goodsOrder/Info?id="+record.id}>发货单详情</Button> {record.status ==1 ? <Button type="primary" href={"#/admin/mall/goodsOrder/quickDelivery?id="+record.id}>去发货</Button> : <Button type="primary" href={"#/admin/mall/goodsOrder/quickDelivery?id="+record.id}>修改运单</Button>}</span>
        </p>
      </div>;
    };

    const columns = [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: '发货单号', dataIndex: 'delivery_no', key: 'delivery_no' },
      { title: '发货时间', dataIndex: 'express_send_at', key: 'express_send_at' },
      { title: '订单编号', dataIndex: 'order_no', key: 'order_no' },
      { title: '下单时间', dataIndex: 'paid_at', key: 'paid_at' },
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
          actionUrl: 'admin/goodsOrder/deliveryIndex' + stringify(params),
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
              actionUrl: 'admin/goodsOrder/deliveryIndex' + stringify(params),
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
              actionUrl: 'admin/goodsOrder/deliveryIndex' + stringify(params),
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
              <Col span={4}>
                <h5 className={styles.tableHeaderTitle}>发货单列表</h5>
              </Col>
              <Col span={20}>
                <div className={styles.floatRight}>
                <Form layout="inline">
                  <Form.Item >
                    <Radio.Group onChange={getStatusLists}>
                      <Radio.Button value="ALL">全部发货单({this.state.data.totalNum})</Radio.Button>
                      <Radio.Button value="1">等待发货({this.state.data.waitSendNum})</Radio.Button>
                      <Radio.Button value="2">已发货({this.state.data.sendNum})</Radio.Button>
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
                <Tag color="#2db7f5" style={{ marginTop:2,paddingBottom:5,paddingTop:5,paddingLeft:10,paddingRight:10 }}>发货单统计：{this.state.data.totalNum}</Tag>
              </Col>
              <Col span={22}>
                <div className={styles.floatRight}>
                  <Form layout="inline">
                    <Form.Item>
                      {getFieldDecorator(`title`, {
                        initialValue: ''
                      })(
                        <Input style={{ width: 220 }} placeholder="发货单号/订单编号/买家账号" />,
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator(`status`, {
                        initialValue: 'ALL'
                      })(
                        <Select style={{ width: 120 }}>
                          <Option value="ALL">全部发货单</Option>
                          <Option value="1">等待发货</Option>
                          <Option value="2">已发货</Option>
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator(`status`, {
                        initialValue: 'ALL'
                      })(
                        <Select style={{ width: 120 }}>
                          <Option value="ALL">全部配送方式</Option>
                          <Option value="NOT_PAID">无需物流</Option>
                          <Option value="PAID">第三方物流</Option>
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
                    {getFieldDecorator(`dateRange`)(
                      <RangePicker
                        showTime={true}
                        style={{ width: 360 }}
                      />
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