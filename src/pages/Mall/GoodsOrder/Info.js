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
    loading: false,
    current:0
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

          let current = 0;

          if(res.data.goods_order_status == 'NOT_PAID') {
            current = 1;
          }

          if(res.data.goods_order_status == 'PAID') {
            current = 2;
          }

          if(res.data.goods_order_status == 'SEND') {
            current = 3;
          }

          if(res.data.goods_order_status == 'SUCCESS') {
            current = 4;
          }

          this.setState({
            data: res.data,
            current :current
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
                {this.state.current ? 
                  <Steps current={this.state.current} size="small">
                    <Step title="拍下商品" description={this.state.data.create_time} />
                    <Step title="买家付款" description={this.state.data.pay_time} />
                    <Step title="商家发货" description={this.state.data.send_time} />
                    <Step title="交易成功" description={this.state.data.finish_time} />
                  </Steps>
                : 
                <Steps current={this.state.goodsOrderStatusRecordCount} size="small">
                  {!!this.state.data && this.state.data.goodsOrderStatusRecords.map(option => {
                    switch (option.status) {
                      case 'NOT_PAID':
                        return <Step title="拍下商品" description={option.created_at} />;
                        break;
                      case 'PAID':
                        return <Step title="买家付款" description={option.created_at} />;
                        break;
                      case 'SEND':
                        return <Step title="商家发货" description={option.created_at} />;
                        break;
                      case 'SUCCESS':
                        return <Step title="交易成功" description={option.created_at} />;
                        break;
                      case 'CLOSED':
                        return <Step title="交易关闭" description={option.created_at} />;
                        break;
                      case 'REFUND':
                        return <Step title="退款中" description={option.created_at} />;
                        break;
                      default:
                        break;
                    }
                  })}
                  </Steps>
                }
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={16}>
              <Card size="small" style={{minHeight:'260px'}} title={'当前订单状态：' + this.state.data.goods_order_status_title}>
                {this.state.data.goods_order_status == 'NOT_PAID' ? <p>已拍下订单，等待买家付款</p> : null}
                {this.state.data.goods_order_status == 'PAID' ? 
                  <span>
                    <p><Button>关闭订单</Button> <Button>修改收货人信息</Button> <Button href={"#/admin/mall/goodsOrder/quickDelivery?id="+this.state.data.id} type="primary">一键发货</Button></p>
                    <p>1、买家已付款，请尽快发货，否则买家有权申请退款。</p>
                    <p>2、如果无法发货，请及时与买家联系并说明情况。</p>
                    <p>3、买家申请退款后，卖家须征得买家同意后再操作发货，否则买家有权拒收货物。</p>
                  </span> 
                : null}
                {this.state.data.goods_order_status == 'SEND' ? 
                  <span>
                    <p>买家（{this.state.data.username}，{this.state.data.phone}）最晚于{this.state.data.timeout_receipt}来完成本次交易的“确认收货”。</p>
                    <p>如果期间买家没有“确认收货”，也没有“申请退款”，本交易将自动结束。</p>
                    <p>如果买家表示未收到货或者收到的货物有问题，请及时联系买家积极处理，友好协商。</p>
                  </span> 
                : null}
                {this.state.data.goods_order_status == 'SUCCESS' ? 
                  <span>
                    <p>交易已成功，如果买家提出售后要求，需卖家与买家协商，做好售后服务。</p>
                  </span> 
                : null}
                {this.state.data.goods_order_status == 'REFUND' ? 
                  <span>
                    <p><Button>查看退款详情</Button></p>
                    <p>买家申请退款，请尽快处理。</p>
                  </span> 
                : null}
                {this.state.data.goods_order_status == 'CLOSED' ? 
                  <span>
                    <p>关闭类型：{this.state.data.close_type}</p>
                    <p>关闭原因：{this.state.data.close_reason}</p>
                  </span> 
                : null}
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" style={{minHeight:'260px'}} title={'商家：'+this.state.data.shop_title}>
                <p>订单编号：{this.state.data.order_no}</p>
                {!!this.state.data &&
                  this.state.data.goodsOrderStatusRecords.map(option => {
                    switch (option.status) {
                      case 'NOT_PAID':
                        return <p>拍下商品：{option.created_at}</p>;
                        break;
                      case 'PAID':
                        return <p>买家付款：{option.created_at}</p>;
                        break;
                      case 'SEND':
                        return <p>商家发货：{option.created_at}</p>;
                        break;
                      case 'SUCCESS':
                        return <p>交易成功：{option.created_at}</p>;
                        break;
                      case 'CLOSED':
                        return <p>交易关闭：{option.created_at}</p>;
                        break;
                      case 'REFUND':
                        return <p>退款中：{option.created_at}</p>;
                        break;
                      default:
                        break;
                    }
                  })}
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card size="small" title="订单信息">
                <p>收 货 人： {this.state.data.consignee_name}，{this.state.data.consignee_phone}</p>
                <p>收货地址： {this.state.data.consignee_address}</p>
                <p>支付方式： {this.state.data.pay_type}</p>
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
          {this.state.data.goods_order_status == 'SEND' || this.state.data.goods_order_status == 'SUCCESS' ||this.state.data.goods_order_status == 'REFUND' ? 
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card size="small" title="物流发货单">
              {!!this.state.data &&
                this.state.data.goodsOrderDeliveries.map(option => {
                  return (
                    <div style={{float:'left',marginLeft:'30px'}}>
                      <p>订单商品： {!!option.goodsOrderDetails && option.goodsOrderDetails.map(option1 => {
                        return option1.goods_name
                      })}</p>
                      <p>物流方式： {option.express_type}</p>
                      <p>物流公司： {option.express_name}</p>
                      <p>物流编号： {option.delivery_no}</p>
                      <p>运单号码： {option.express_no}</p>
                    </div>
                  );
                })}
                </Card>
            </Col>
          </Row>
          : null}
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default InfoPage;