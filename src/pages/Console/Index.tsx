import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './Index.less';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from 'bizcharts';

import {
  Row,
  Col,
  Icon,
  Form,
  Divider,
  Statistic,
  Badge,
  Card,
} from 'antd';

@connect(({ model }) => ({
  model,
}))

@Form.create()
class IndexPage extends PureComponent {
  // 定义要操作的模型名称
  modelName = 'console';
  interval = undefined;

  state = {
    msg: '',
    url: '',
    data: {},
    status: '',
    pagination: {},
    visible: false,
    loading: false,
    canUpdate: false,
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {
    // loading
    this.setState({ loading: true });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/console/index',
      },
      callback: res => {
        if (res) {
          this.setState({ ...res, loading: false });
        }
      },
    });

    this.checkUpdate();

    // this.interval = setInterval(() => this.checkUpdate(), 15000);
  }

  checkUpdate() {
    // 调用model
    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/console/update',
      },
      callback: res => {
        if (res) {
          // if(res.data.can_update) {
          //   clearInterval(this.interval);
          // }
          this.setState({canUpdate: res.data.can_update });
        }
      },
    });
  }

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

    return (
      <div>
        <div className={styles.container}>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="今日新增会员"
                  value={this.state.data.user_today_num}
                  precision={0}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="文章总数"
                  value={this.state.data.article_total_num}
                  precision={0}
                  valueStyle={{ color: '#999999' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="今日付款金额"
                  value={this.state.data.order_today_money}
                  precision={2}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="订单总金额"
                  value={this.state.data.order_total_money}
                  precision={2}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>
          <div className={styles.line}></div>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="待办事项" bordered={false}>
                <Row gutter={24}>
                  <Col span={8}>
                    <div className={styles.gutterBox}>
                      <div className={styles.gutterTitle}>商品库存报警</div>
                      <div className={styles.gutterNum}>
                        <a href="#">10</a>
                      </div>
                    </div>
                    <Divider />
                  </Col>
                  <Col span={8}>
                    <div className={styles.gutterBox}>
                      <div className={styles.gutterTitle}>待付款订单</div>
                      <div className={styles.gutterNum}>
                        <a href="#">10</a>
                      </div>
                    </div>
                    <Divider />
                  </Col>
                  <Col span={8}>
                    <div className={styles.gutterBox}>
                      <div className={styles.gutterTitle}>备货中订单</div>
                      <div className={styles.gutterNum}>
                        <a href="#">10</a>
                      </div>
                    </div>
                    <Divider />
                  </Col>
                  <Col span={8}>
                    <div className={styles.gutterBox}>
                      <div className={styles.gutterTitle}>待处理退款</div>
                      <div className={styles.gutterNum}>
                        <a href="#">10</a>
                      </div>
                    </div>
                    <Divider />
                  </Col>
                  <Col span={8}>
                    <div className={styles.gutterBox}>
                      <div className={styles.gutterTitle}>待处理退款</div>
                      <div className={styles.gutterNum}>
                        <a href="#">10</a>
                      </div>
                    </div>
                    <Divider />
                  </Col>
                  <Col span={8}>
                    <div className={styles.gutterBox}>
                      <div className={styles.gutterTitle}>待处理退款</div>
                      <div className={styles.gutterNum}>
                        <a href="#">10</a>
                      </div>
                    </div>
                    <Divider />
                  </Col>
                  <Col span={8}>
                    <div className={styles.gutterBoxNoBottom}>
                      <div className={styles.gutterTitle}>待处理退款</div>
                      <div className={styles.gutterNum}>
                        <a href="#">10</a>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={styles.gutterBoxNoBottom}>
                      <div className={styles.gutterTitle}>待处理退款</div>
                      <div className={styles.gutterNum}>
                        <a href="#">10</a>
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className={styles.gutterBoxNoBottom}>
                      <div className={styles.gutterTitle}>系统版本</div>
                      <div className={styles.gutterNum}>
                      {this.state.canUpdate ? 
                          <Badge dot>
                            <a className={styles.updateSystem} href="#/console/update">
                              {this.state.data.app_version}
                            </a>
                            <Icon type="arrow-up" />
                          </Badge>
                        : 
                          <a className={styles.updateSystem} href="#/console/update">
                            {this.state.data.app_version}
                          </a>
                        }
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="快捷入口" bordered={false}>
                <Row gutter={24} className={styles.fastRow}>
                  <Col span={6}>
                    <a href="#/article/create">
                      <div className={styles.fastBox}>
                        <p>
                          <Icon className={styles.fastIcon} type="edit" />
                        </p>
                        <p>添加文章</p>
                      </div>
                    </a>
                  </Col>
                  <Col span={6}>
                    <a href="#/page/create">
                      <div className={styles.fastBox}>
                        <p>
                          <Icon className={styles.fastIcon} type="money-collect" />
                        </p>
                        <p>添加单页</p>
                      </div>
                    </a>
                  </Col>
                  <Col span={6}>
                    <a href="#/banner/banner/index">
                      <div className={styles.fastBox}>
                        <p>
                          <Icon className={styles.fastIcon} type="picture" />
                        </p>
                        <p>幻灯片管理</p>
                      </div>
                    </a>
                  </Col>
                  <Col span={6}>
                    <a href="#/plugin/comment/index">
                      <div className={styles.fastBox}>
                        <p>
                          <Icon className={styles.fastIcon} type="message" />
                        </p>
                        <p>评论管理</p>
                      </div>
                    </a>
                  </Col>
                  <Col span={6}>
                    <a href="#/system/menu/index">
                      <div className={styles.fastBox}>
                        <p>
                          <Icon className={styles.fastIcon} type="menu" />
                        </p>
                        <p>菜单管理</p>
                      </div>
                    </a>
                  </Col>
                  <Col span={6}>
                    <a href="#/user/index">
                      <div className={styles.fastBox}>
                        <p>
                          <Icon className={styles.fastIcon} type="user" />
                        </p>
                        <p>用户管理</p>
                      </div>
                    </a>
                  </Col>
                  <Col span={6}>
                    <a href="#/system/navigation/index">
                      <div className={styles.fastBox}>
                        <p>
                          <Icon className={styles.fastIcon} type="bars" />
                        </p>
                        <p>导航管理</p>
                      </div>
                    </a>
                  </Col>
                  <Col span={6}>
                    <a href="#/attachment/file/index">
                      <div className={styles.fastBox}>
                        <p>
                          <Icon className={styles.fastIcon} type="paper-clip" />
                        </p>
                        <p>附件空间</p>
                      </div>
                    </a>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <div className={styles.line}></div>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="用户统计" bordered={false}>
                <Chart height={300} data={this.state.data.user_data} forceFit>
                  <Axis name="month" />
                  <Axis name="count" />
                  <Tooltip
                    crosshairs={{
                      type: 'y',
                    }}
                  />
                  <Geom type="interval" position="month*count" />
                </Chart>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="最近7天订单增长情况" bordered={false}>
                <Chart height={300} data={this.state.data.order_data} forceFit>
                  <Axis name="date" />
                  <Axis name="money" />
                  <Tooltip
                    crosshairs={{
                      type: 'y',
                    }}
                  />
                  <Geom type="interval" position="date*money" />
                </Chart>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default IndexPage;
