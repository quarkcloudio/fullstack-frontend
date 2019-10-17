import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import styles from './Style.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';

import {
  Steps,
  Button,
  Result,
  Typography
} from 'antd';

const { Step } = Steps;
const { Paragraph, Text } = Typography;

@connect(({ model }) => ({
  model,
}))

class CreatePage extends PureComponent {

  state = {
    msg: '',
    url: '',
    data: {},
    status: '',
    goodsId:false,
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {

    // 获得url参数
    const params = this.props.location.query;

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/goods/complete?id='+params.id,
      },
      callback: (res) => {
        if (res) {
          this.setState({ data: res.data,loading:true,goodsId:params.id});
        }
      }
    });
  }

  render() {

    let state = {
      loading: false,
    };

    return (
      <PageHeaderWrapper title={false}>
        <div style={{background:'#fff',padding:'20px'}}>
          <Steps current={2} style={{width:'100%',margin:'30px auto'}}>
            <Step title="填写商品详情" />
            <Step title="上传商品图片" />
            <Step title="商品发布成功" />
          </Steps>
          <div className="steps-content" style={{width:'100%',margin:'40px auto'}}>
            <Result
              status="success"
              title="恭喜您，商品发布成功！"
              extra={[
                <Button href={this.state.data.goodsIndexUrl}>返回商品列表</Button>,
                <Button href={this.state.data.createGoodsUrl} type="primary">继续添加商品</Button>,
                <a href={this.state.data.viewGoodsUrl}>查看商品详情 &gt;</a>
              ]}
            >

            </Result>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CreatePage;