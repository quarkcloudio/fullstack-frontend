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
  Tag,
  Input,
  Select
} from 'antd';

const TabPane = Tabs.TabPane;
const { Step } = Steps;

@connect(({ model }) => ({
  model,
}))

@Form.create()

class InfoPage extends PureComponent {
  state = {
    data:{
      goodsOrderDeliveryInfo:false,
      goodsOrderDeliveryDetails:false,
      goodsOrderInfo:false,
    },
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
        actionUrl: 'admin/goodsOrder/deliveryInfo?' + stringify(params),
      },
      callback: res => {
        if (res) {
          this.setState({
            data: res.data
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
        title: '发货数量',
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '库存',
        dataIndex: 'stock_num',
        key: 'stock_num',
      }
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };

    return (
      <PageHeaderWrapper title={false}>
        <div className={styles.container}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              发货单编号：{this.state.data.goodsOrderDeliveryInfo.delivery_no}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Table
                dataSource={this.state.data.goodsOrderDeliveryDetails}
                columns={columns}
                pagination={false}
                bordered
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card size="small" title="收货信息">
                <p>收 货 人： {this.state.data.goodsOrderInfo.consignee_name}，{this.state.data.goodsOrderInfo.consignee_phone}</p>
                <p>收货地址： {this.state.data.goodsOrderInfo.consignee_address}</p>
                <p>支付方式： {this.state.data.goodsOrderInfo.pay_type}</p>
                <p>买家留言： {this.state.data.goodsOrderInfo.remark}</p>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card size="small" title="物流信息">
                <p>物流方式： {this.state.data.goodsOrderDeliveryInfo.express_type == 1 ? '无需配送' : '第三方物流'}</p>
                {this.state.data.goodsOrderDeliveryInfo.express_type == 2 && (
                  <span>
                    <p>物流公司： {this.state.data.goodsOrderDeliveryInfo.express_name}</p>
                    <p>运单号码： {this.state.data.goodsOrderDeliveryInfo.express_no}</p>
                  </span>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default InfoPage;