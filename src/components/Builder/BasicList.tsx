import React, { useEffect } from 'react';
import styles from './BasicList.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

import {
  Row,
  Col,
  Icon,
  Select,
  Input,
  Form,
  Button,
  Tag,
  Modal,
  message,
  Table,
  Divider,
  Popconfirm,
  DatePicker,
  TimePicker,
} from 'antd';

const Search = Input.Search;
const { RangePicker } = DatePicker;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
const Option = Select.Option;

export interface BasicListProps extends FormComponentProps {
  pageRandom:string;
  previewImage: string;
  previewVisible: boolean;
  url?: string;
  submitting: boolean;
  dispatch: Dispatch<any>;
}

const BasicList: React.SFC<BasicListProps> = props => {

  const {
    pageRandom,
    previewImage,
    previewVisible,
    url,
    submitting,
    dispatch,
    form,
  } = props;

  const { getFieldDecorator } = form;

  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'basicList/getListInfo',
        payload: {
          url: url,
        }
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        dispatch({
          type: 'basicList/formSubmit',
          payload: {
            action: action,
            ...values,
          },
        });
      }
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'basicList/previewImage',
      payload: {
        previewImage : null,
        previewVisible : false,
      }
    });
   };

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <Row type="flex" justify="start">
          <Col span={12}>
            <h5 className={styles.tableHeaderTitle}>文章列表</h5>
          </Col>
          <Col span={12}>
            <div className={styles.floatRight}>
              <Button type="primary">
                <Icon type="plus-circle" />
                发布文章
              </Button>
              &nbsp;
              <a
                href={''}
                target="_blank"
              >
                <Button>
                  <Icon type="export" />
                  导出数据
                </Button>
              </a>
            </div>
          </Col>
        </Row>
      </div>
      <Divider style={{ marginBottom: 10 }} />
      <div className={styles.tableToolBar}>
        <Row type="flex" justify="start">
          <Col span={8}>
            <ButtonGroup>
              <Button>全选</Button>
              <Button>取消</Button>
            </ButtonGroup>
            <Divider type="vertical" />
            <Button>审核</Button>&nbsp;
            <Button>禁用</Button>&nbsp;
            <Button type="danger">
              删除
            </Button>
          </Col>
          <Col span={16}>
            <div className={styles.floatRight}>
              <Form layout="inline">
                <Form.Item style={{ marginBottom: 0 }}>
                  {getFieldDecorator('category_id', {
                    initialValue: '0',
                  })(
                    <Select style={{ width: 160 }} placeholder="选择分类">
                      <Option key={0}>所有分类</Option>
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  {getFieldDecorator('status', {
                    initialValue: '0',
                  })(
                    <Select style={{ width: 160 }} placeholder="所选状态">
                      <Option key={0}>所有状态</Option>
                      <Option key={1}>正常</Option>
                      <Option key={2}>已禁用</Option>
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item style={{ display: 'inline-block' }}>
                  {getFieldDecorator('title')(
                    <Input placeholder="请输入要搜索的内容" style={{ width: 200 }} />,
                  )}
                </Form.Item>
                <Form.Item style={{ display: 'inline-block' }}>
                  <Button htmlType="submit">搜索</Button>
                </Form.Item>
                <Form.Item style={{ marginRight: 10 }}>
                  <a style={{ fontSize: 12 }}>
                    高级搜索 <Icon type={'down'} />
                  </a>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>

      <div
        className={styles.tableAdvancedSearchBar}
        style={{ display: 'none' }}
      >
        <Row>
          <Col span={24}>
            <Form layout="inline">
              <Form.Item label="标题" style={{ display: 'inline-block' }}>
                {getFieldDecorator('title')(
                  <Input placeholder="请输入要搜索的内容" style={{ width: 200 }} />,
                )}
              </Form.Item>
              <Form.Item label="作者" style={{ display: 'inline-block' }}>
                {getFieldDecorator('author')(
                  <Input placeholder="请输入作者" style={{ width: 160 }} />,
                )}
              </Form.Item>
              <Form.Item label="分类" style={{ marginBottom: 0 }}>
                {getFieldDecorator('category_id', {
                  initialValue: '0',
                })(
                  <Select style={{ width: 160 }} placeholder="选择分类">
                    <Option key={0}>所有分类</Option>
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="发布日期">
                {getFieldDecorator('dateRange')(<RangePicker />)}
              </Form.Item>

              <Form.Item label="状态" style={{ marginBottom: 0 }}>
                {getFieldDecorator('status', {
                  initialValue: '0',
                })(
                  <Select style={{ width: 160 }} placeholder="所选状态">
                    <Option key={0}>所有状态</Option>
                    <Option key={1}>正常</Option>
                    <Option key={2}>已禁用</Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon="search" htmlType="submit">
                  高级搜索
                </Button>
                &nbsp;
                <Button>重置</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>

      <div className={styles.tableData}>
        <Table
        />
      </div>
    </div>
  );
};

export default Form.create<BasicListProps>()(
  connect(({ loading ,basicList}: ConnectState) => ({
    submitting: loading.effects['basicList/formSubmit'],
    previewVisible:basicList.previewVisible,
    previewImage:basicList.previewImage,
    pageRandom:basicList.pageRandom
  }))(BasicList),
);
