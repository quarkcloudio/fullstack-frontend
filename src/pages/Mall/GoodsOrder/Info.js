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
  Tabs,
  Form,
  Button,
  message,
  Modal,
  Table,
  Divider,
  List,
  Avatar,
  Steps,
  Tag
} from 'antd';

const TabPane = Tabs.TabPane;
const { Step } = Steps;

@connect(({ model }) => ({
  model,
}))

@Form.create()

class InfoPage extends PureComponent {
  state = {
    data:false,
    msg: '',
    url: '',
    status: '',
    loading: false
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
        actionUrl: 'admin/goodsOrder/info?' + stringify(params),
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
    
    const columns = [
      {
        title: '商品名称',
        key: 'cover_id',
        dataIndex: 'cover_id',
        render: (text, record) => (
          <span>
            <Avatar src={text} shape="square" size="large" /> 
            {record.goods_name}
          </span>
        ),
      },
      {
        title: '属性',
        dataIndex: 'goods_property_names',
        key: 'goods_property_names',
      },
      {
        title: '单价',
        dataIndex: 'goods_price',
        key: 'goods_price',
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '库存',
        dataIndex: 'stock_num',
        key: 'stock_num',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '服务',
        key: 'service_status',
        dataIndex: 'service_status',
        render:  (text, record) => (
          <span>
            <Tag color={'green'}>
              {text}
            </Tag>
          </span>
        ),
      }
    ];

    return (
      <PageHeaderWrapper title={false}>
        <div className={styles.container}>
          <Row>
            <Col span={24}>
              <div style={{'width':800,'margin':'50px auto'}}>
                <Steps current={3} size="small">
                  <Step title="下单时间" description={this.state.data.created_at} />
                  <Step title="买家付款" description="2019-11-07 09:11:30" />
                  <Step title="商家发货" description="2019-11-07 09:11:30" />
                  <Step title="确认收货" description="2019-11-07 09:11:30" />
                </Steps>
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Card size="small" title={'当前订单状态：'+this.state.data.goods_order_status}>
                <p>关闭类型：买家取消订单</p>
                <p>关闭原因：我不想买了</p>
                <p>关闭原因：我不想买了</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title={'商家：'+this.state.data.shop_title}>
                <p>订单编号：{this.state.data.order_no}</p>
                <p>下单时间：{this.state.data.created_at}</p>
                <p>关闭时间：2019-11-07 08:56:35</p>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card size="small" title="订单信息">
                <p>收 货 人： {this.state.data.consignee}，{this.state.data.goods_order_phone}</p>
                <p>收货地址： {this.state.data.address}</p>
                <p>支付方式： {this.state.data.pay_type}</p>
                <p>配送时间： 立即配送</p>
                <p>买家留言： {this.state.data.remark}</p>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Table
                dataSource={this.state.data.goods_order_details}
                columns={columns}
                pagination={false}
                footer={() => <p style={{'textAlign':'right'}}>
                  ￥{this.state.data.buyer_pay_amount}（商品总金额） + 
                  ￥{this.state.data.freight_amount}（运费） - 
                  ￥{this.state.data.mdiscount_amount}（店铺优惠） - 
                  ￥{this.state.data.discount_amount}（平台优惠） - 
                  ￥{this.state.data.point_amount}（积分抵扣） = 订单总金额：<span style={{'color':'#ff3535'}}>￥{this.state.data.total_amount}</span></p>}
                bordered
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card size="small" title="发货单物流">
                <p>订单商品： 测试商品</p>
                <p>物流方式： 第三方物流</p>
                <p>物流公司： 申通快递</p>
                <p>物流编号： 20190812092373001</p>
                <p>运单号码： 41325523534</p>
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default InfoPage;