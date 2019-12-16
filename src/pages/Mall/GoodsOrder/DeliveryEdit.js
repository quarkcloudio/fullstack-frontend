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
        actionUrl: 'admin/goodsOrder/deliveryEdit?' + stringify(params),
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // 验证正确提交表单
      if (!err) {
        this.props.dispatch({
          type: 'action/post',
          payload: {
            actionUrl: 'admin/goodsOrder/deliverySave',
            ...values,
          },
          callback: res => {
            if (res.status == 'success') {
              location.reload();
            }
          },
        });
      }
    });
  };

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
              <Table
                dataSource={this.state.data.goods_order_details}
                columns={columns}
                pagination={false}
                bordered
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card size="small" title="收货信息">
                <p>收 货 人： {this.state.data.consignee_name}，{this.state.data.consignee_phone}</p>
                <p>收货地址： {this.state.data.consignee_address}</p>
                <p>支付方式： {this.state.data.pay_type}</p>
                <p>买家留言： {this.state.data.remark}</p>
              </Card>
            </Col>
          </Row>
          {this.state.data.goods_order_status == 'SEND' || this.state.data.goods_order_status == 'SUCCESS' ||this.state.data.goods_order_status == 'REFUND' ? 
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card size="small" title="物流发货单">
                <p>订单商品： {!!option.goodsOrderDetails && option.goodsOrderDetails.map(option1 => {
                  return option1.goods_name
                })}</p>
                <p>物流方式： {option.express_type}</p>
                <p>物流公司： {option.express_name}</p>
                <p>物流编号： {option.delivery_no}</p>
                <p>运单号码： {option.express_no}</p>
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