import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';

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
  Transfer,
  Table,
  Divider,
  Drawer,
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
var attributeId = 0;
var specificationId = 0;

@connect(({ model }) => ({
  model,
}))
@Form.create()
class EditPage extends PureComponent {
  state = {
    msg: '',
    url: '',
    data: {},
    status: '',
    loading: false,
    coverId: false,
    attributeTable: [],
    attributeSearch: [],
    attributeSelectedIds: [],
    attributeSelectedData: [],
    attributeDrawerVisible: false,
    specificationTable: [],
    specificationSearch: [],
    specificationSelectedIds: [],
    specificationSelectedData: [],
    specificationDrawerVisible: false,
    attributeSelectedKeys: [],
    specificationSelectedKeys: [],
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {
    // 获得url参数
    const params = this.props.location.query;

    // loading
    this.setState({ loading: true });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/goods/categoryEdit?id=' + params.id,
      },
      callback: res => {
        if (res) {
          this.setState({
            data: res.data,
            coverId: res.data.cover_id,
            attributeSelectedIds: res.data.attributeSelectedIds,
            specificationSelectedIds: res.data.specificationSelectedIds,
            attributeSelectedData: res.data.attributeSelectedData,
            specificationSelectedData: res.data.specificationSelectedData,
            attributeSelectedKeys: res.data.attributeSelectedKeys,
            specificationSelectedKeys: res.data.specificationSelectedKeys,
          });

          attributeId = res.data.attributeSelectedKeys.length;
          specificationId = res.data.specificationSelectedKeys.length;

          this.props.dispatch({
            type: 'list/data',
            payload: {
              actionUrl: 'admin/goods/attributeIndex',
              attributeSelectedIds: this.state.attributeSelectedIds,
            },
            callback: res => {
              if (res) {
                this.setState({ attributeTable: res.data.table });
              }
            },
          });

          this.props.dispatch({
            type: 'list/data',
            payload: {
              actionUrl: 'admin/goods/specificationIndex',
              specificationSelectedIds: this.state.specificationSelectedIds,
            },
            callback: res => {
              if (res) {
                this.setState({ specificationTable: res.data.table });
              }
            },
          });
        }
      },
    });
  }

  attributeShowDrawer = () => {
    this.setState({
      attributeDrawerVisible: true,
    });
  };

  attributeCloseDrawer = () => {
    this.setState({
      attributeDrawerVisible: false,
    });
  };

  // 分页切换
  attributeChangePagination = (pagination, filters, sorter) => {
    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/attributeIndex',
        pageSize: pagination.pageSize, // 分页数量
        current: pagination.current, // 当前页码
        sortField: sorter.field, // 排序字段
        sortOrder: sorter.order, // 排序规则
        ...filters, // 筛选
        search: this.state.attributeSearch,
        attributeSelectedIds: this.state.attributeSelectedIds,
      },
      callback: res => {
        if (res) {
          this.setState({ attributeTable: res.data.table });
        }
      },
    });
  };

  // 搜索
  attributeOnSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values['name'] = values['attributeName'];
        values['goodsTypeId'] = values['attributeGoodsTypeId'];
        this.props.dispatch({
          type: 'list/data',
          payload: {
            actionUrl: 'admin/goods/attributeIndex',
            ...this.state.attributeTable.pagination,
            search: values,
            attributeSelectedIds: this.state.attributeSelectedIds,
          },
          callback: res => {
            if (res) {
              this.setState({ attributeTable: res.data.table, attributeSearch: values });
            }
          },
        });
      }
    });
  };

  attributeRemove = k => {
    const { form } = this.props;

    // can use data-binding to get
    const keys = form.getFieldValue('attributeKeys');

    // 移除已经选中attribute的id
    let removeattributeSelectedId = this.state.attributeSelectedData[k]['id'];
    let attributeSelectedIds = this.state.attributeSelectedIds;
    let newattributeSelectedIds = attributeSelectedIds.filter(function(item) {
      return item != removeattributeSelectedId;
    });
    this.setState({ attributeSelectedIds: newattributeSelectedIds });

    // can use data-binding to set
    form.setFieldsValue({
      attributeKeys: keys.filter(key => key !== k),
    });

    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/attributeIndex',
        ...this.state.attributeTable.pagination,
        search: this.state.attributeSearch,
        attributeSelectedIds: newattributeSelectedIds,
      },
      callback: res => {
        if (res) {
          this.setState({ attributeTable: res.data.table });
        }
      },
    });
  };

  attributeAdd = index => {
    const { form } = this.props;

    // can use data-binding to get
    const keys = form.getFieldValue('attributeKeys');
    const nextKeys = keys.concat(attributeId++);

    // 已经选中attribute的id
    let attributeSelectedIds = this.state.attributeSelectedIds;
    attributeSelectedIds.push(this.state.attributeTable.dataSource[index]['id']);
    // 已经选中attribute的值
    this.state.attributeSelectedData[attributeId - 1] = this.state.attributeTable.dataSource[index];
    this.setState({
      attributeSelectedIds: attributeSelectedIds,
      attributeSelectedData: this.state.attributeSelectedData,
    });

    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/attributeIndex',
        ...this.state.attributeTable.pagination,
        search: this.state.attributeSearch,
        attributeSelectedIds: this.state.attributeSelectedIds,
      },
      callback: res => {
        if (res) {
          this.setState({ attributeTable: res.data.table });
        }
      },
    });

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      attributeKeys: nextKeys,
    });
  };

  specificationShowDrawer = () => {
    this.setState({
      specificationDrawerVisible: true,
    });
  };

  specificationCloseDrawer = () => {
    this.setState({
      specificationDrawerVisible: false,
    });
  };

  // 分页切换
  specificationChangePagination = (pagination, filters, sorter) => {
    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/specificationIndex',
        pageSize: pagination.pageSize, // 分页数量
        current: pagination.current, // 当前页码
        sortField: sorter.field, // 排序字段
        sortOrder: sorter.order, // 排序规则
        ...filters, // 筛选
        search: this.state.specificationSearch,
        specificationSelectedIds: this.state.specificationSelectedIds,
      },
      callback: res => {
        if (res) {
          this.setState({ specificationTable: res.data.table });
        }
      },
    });
  };

  // 搜索
  specificationOnSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values['name'] = values['specificationName'];
        values['goodsTypeId'] = values['specificationGoodsTypeId'];
        this.props.dispatch({
          type: 'list/data',
          payload: {
            actionUrl: 'admin/goods/specificationIndex',
            ...this.state.specificationTable.pagination,
            search: values,
            specificationSelectedIds: this.state.specificationSelectedIds,
          },
          callback: res => {
            if (res) {
              this.setState({ specificationTable: res.data.table, specificationSearch: values });
            }
          },
        });
      }
    });
  };

  specificationRemove = k => {
    const { form } = this.props;

    // can use data-binding to get
    const keys = form.getFieldValue('specificationKeys');

    // 移除已经选中specification的id
    let removespecificationSelectedId = this.state.specificationSelectedData[k]['id'];
    let specificationSelectedIds = this.state.specificationSelectedIds;
    let newspecificationSelectedIds = specificationSelectedIds.filter(function(item) {
      return item != removespecificationSelectedId;
    });
    this.setState({ specificationSelectedIds: newspecificationSelectedIds });

    // can use data-binding to set
    form.setFieldsValue({
      specificationKeys: keys.filter(key => key !== k),
    });

    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/specificationIndex',
        ...this.state.specificationTable.pagination,
        search: this.state.specificationSearch,
        specificationSelectedIds: newspecificationSelectedIds,
      },
      callback: res => {
        if (res) {
          this.setState({ specificationTable: res.data.table });
        }
      },
    });
  };

  specificationAdd = index => {
    const { form } = this.props;

    // can use data-binding to get
    const keys = form.getFieldValue('specificationKeys');
    const nextKeys = keys.concat(specificationId++);

    // 已经选中specification的id
    let specificationSelectedIds = this.state.specificationSelectedIds;
    specificationSelectedIds.push(this.state.specificationTable.dataSource[index]['id']);
    // 已经选中specification的值
    this.state.specificationSelectedData[
      specificationId - 1
    ] = this.state.specificationTable.dataSource[index];
    this.setState({
      specificationSelectedIds: specificationSelectedIds,
      specificationSelectedData: this.state.specificationSelectedData,
    });

    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/specificationIndex',
        ...this.state.specificationTable.pagination,
        search: this.state.specificationSearch,
        specificationSelectedIds: this.state.specificationSelectedIds,
      },
      callback: res => {
        if (res) {
          this.setState({ specificationTable: res.data.table });
        }
      },
    });

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      specificationKeys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values['cover_id'] = this.state.coverId;

      // 验证正确提交表单
      if (!err) {
        this.props.dispatch({
          type: 'form/submit',
          payload: {
            actionUrl: 'admin/goods/categorySave',
            ...values,
          },
        });
      }
    });
  };

  brandFilterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

  brandChange = targetKeys => {
    let data = this.state.data;
    data.goodsBrandSelectedKeys = targetKeys;
    this.setState({ data: data });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

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

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        span: 18,
        offset: 2,
      },
    };

    getFieldDecorator('attributeKeys', { initialValue: this.state.attributeSelectedKeys });
    const attributeKeys = getFieldValue('attributeKeys');
    const attributeFormItems = attributeKeys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '关联属性' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`attribute_ids[${k}]`, {
          initialValue: this.state.attributeSelectedData[k]['id'],
        })(<Input type={'hidden'} />)}
        {getFieldDecorator(`attribute_names[${k}]`, {
          initialValue: this.state.attributeSelectedData[k]['name'],
        })(
          <Input
            placeholder="属性名称"
            disabled={true}
            style={{ width: '100px', marginRight: 8 }}
          />,
        )}
        {getFieldDecorator(`attribute_values[${k}]`, {
          initialValue: this.state.attributeSelectedData[k]['goods_attribute_values'],
        })(
          <Input placeholder="属性值" disabled={true} style={{ width: '250px', marginRight: 8 }} />,
        )}
        {getFieldDecorator(`attribute_groups[${k}]`, {
          initialValue: this.state.attributeSelectedData[k]['group']
            ? this.state.attributeSelectedData[k]['group']
            : '',
        })(<Input placeholder="分组名称" style={{ width: '100px', marginRight: 8 }} />)}
        {getFieldDecorator(`attribute_sorts[${k}]`, {
          initialValue: this.state.attributeSelectedData[k]['sort']
            ? this.state.attributeSelectedData[k]['sort']
            : 0,
        })(<Input placeholder="排序" style={{ width: '60px', marginRight: 8 }} />)}
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => this.attributeRemove(k)}
        />
      </Form.Item>
    ));

    getFieldDecorator('specificationKeys', { initialValue: this.state.specificationSelectedKeys });
    const specificationKeys = getFieldValue('specificationKeys');
    const specificationFormItems = specificationKeys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '关联规格' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`attribute_specification_ids[${k}]`, {
          initialValue: this.state.specificationSelectedData[k]['id'],
        })(<Input type={'hidden'} />)}
        {getFieldDecorator(`attribute_specification_names[${k}]`, {
          initialValue: this.state.specificationSelectedData[k]['name'],
        })(
          <Input
            placeholder="属性名称"
            disabled={true}
            style={{ width: '100px', marginRight: 8 }}
          />,
        )}
        {getFieldDecorator(`attribute_specification_values[${k}]`, {
          initialValue: this.state.specificationSelectedData[k]['goods_attribute_values'],
        })(
          <Input placeholder="属性值" disabled={true} style={{ width: '250px', marginRight: 8 }} />,
        )}
        {getFieldDecorator(`attribute_specification_groups[${k}]`, {
          initialValue: this.state.specificationSelectedData[k]['group']
            ? this.state.specificationSelectedData[k]['group']
            : '',
        })(<Input placeholder="分组名称" style={{ width: '100px', marginRight: 8 }} />)}
        {getFieldDecorator(`attribute_specification_sorts[${k}]`, {
          initialValue: this.state.specificationSelectedData[k]['sort']
            ? this.state.specificationSelectedData[k]['sort']
            : 0,
        })(<Input placeholder="排序" style={{ width: '60px', marginRight: 8 }} />)}
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => this.specificationRemove(k)}
        />
      </Form.Item>
    ));

    // 单图片上传模式
    let uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    const attributeColumns = [
      {
        title: '属性名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '属性值',
        dataIndex: 'goods_attribute_values',
        key: 'goods_attribute_values',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => <a onClick={() => this.attributeAdd(index)}>选择</a>,
      },
    ];

    const specificationColumns = [
      {
        title: '属性名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '属性值',
        dataIndex: 'goods_attribute_values',
        key: 'goods_attribute_values',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => <a onClick={() => this.specificationAdd(index)}>选择</a>,
      },
    ];

    return (
      <PageHeaderWrapper title={false}>
        <div style={{ background: '#fff', padding: '10px' }}>
          <Tabs>
            <TabPane tab="基本信息" key="1">
              <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
                <Form.Item {...formItemLayout} label="分类标题">
                  {getFieldDecorator('id', {
                    initialValue: this.state.data.id,
                  })(<Input type="hidden" />)}
                  {getFieldDecorator('title', {
                    initialValue: this.state.data.title,
                  })(<Input style={{ width: 400 }} placeholder="请输入分类标题" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="分类名称">
                  {getFieldDecorator('name', {
                    initialValue: this.state.data.name,
                  })(<Input style={{ width: 200 }} placeholder="请输入分类名称" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="封面图">
                  <Upload
                    name={'file'}
                    listType={'picture-card'}
                    showUploadList={false}
                    action={'/api/admin/picture/upload'}
                    headers={{ authorization: 'Bearer ' + sessionStorage['token'] }}
                    beforeUpload={file => {
                      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                        message.error('请上传jpg或png格式的图片!');
                        return false;
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        message.error('图片大小不可超过2MB!');
                        return false;
                      }
                      return true;
                    }}
                    onChange={info => {
                      if (info.file.status === 'done') {
                        // Get this url from response in real world.
                        if (info.file.response.status === 'success') {
                          let fileList = [];
                          if (info.file.response) {
                            info.file.url = info.file.response.data.url;
                            info.file.uid = info.file.response.data.id;
                            info.file.id = info.file.response.data.id;
                          }
                          fileList[0] = info.file;
                          this.setState({ fileList: fileList });
                        } else {
                          message.error(info.file.response.msg);
                        }
                      }
                    }}
                  >
                    {this.state.coverId[0] ? (
                      <img src={this.state.coverId[0]['url']} alt="avatar" width={80} />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
                <Form.Item {...formItemLayout} label="父节点">
                  {getFieldDecorator('pid', {
                    initialValue: this.state.data.pid ? this.state.data.pid.toString() : '0',
                  })(
                    <Select style={{ width: 200 }}>
                      {!!this.state.data.categorys &&
                        this.state.data.categorys.map(option => {
                          return <Option key={option.value.toString()}>{option.name}</Option>;
                        })}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="排序">
                  {getFieldDecorator('sort', {
                    initialValue: this.state.data.sort,
                  })(<InputNumber style={{ width: 200 }} placeholder="排序" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="描述">
                  {getFieldDecorator('description', {
                    initialValue: this.state.data.description,
                  })(<TextArea style={{ width: 400 }} placeholder="请输入描述" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="频道模板">
                  {getFieldDecorator('index_tpl', {
                    initialValue: this.state.data.index_tpl,
                  })(<Input style={{ width: 400 }} placeholder="请输入频道模板" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="列表模板">
                  {getFieldDecorator('lists_tpl', {
                    initialValue: this.state.data.lists_tpl,
                  })(<Input style={{ width: 400 }} placeholder="请输入列表模板" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="详情模板">
                  {getFieldDecorator('detail_tpl', {
                    initialValue: this.state.data.detail_tpl,
                  })(<Input style={{ width: 400 }} placeholder="请输入详情模板" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="分页数量">
                  {getFieldDecorator('page_num', {
                    initialValue: this.state.data.page_num,
                  })(<InputNumber style={{ width: 200 }} placeholder="请输入分页数量" />)}
                </Form.Item>
                <Form.Item {...formItemLayout} label="状态">
                  {getFieldDecorator('status', {
                    initialValue: this.state.data.status,
                    valuePropName: 'checked',
                  })(<Switch checkedChildren="正常" unCheckedChildren="禁用" />)}
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="关联品牌" key="2">
              <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator('brand_ids', {
                    initialValue: '',
                  })(
                    <Transfer
                      titles={['所有品牌', '已选择关联品牌']}
                      dataSource={this.state.data ? this.state.data.goodsBrands : []}
                      showSearch
                      listStyle={{
                        width: 300,
                        height: 300,
                      }}
                      filterOption={this.brandFilterOption}
                      targetKeys={this.state.data ? this.state.data.goodsBrandSelectedKeys : []}
                      onChange={this.brandChange}
                      render={item => item.title}
                    />,
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label="状态">
                  {getFieldDecorator('status', {
                    initialValue: true,
                    valuePropName: 'checked',
                  })(<Switch checkedChildren="正常" unCheckedChildren="禁用" />)}
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="关联属性、规格" key="3">
              <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
                {attributeFormItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button
                    type="dashed"
                    onClick={this.attributeShowDrawer}
                    style={{ width: '400px' }}
                  >
                    <Icon type="plus" /> 添加属性
                  </Button>
                </Form.Item>
                {specificationFormItems}
                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button
                    type="dashed"
                    onClick={this.specificationShowDrawer}
                    style={{ width: '400px' }}
                  >
                    <Icon type="plus" /> 添加规格
                  </Button>
                </Form.Item>
                <Form.Item {...formItemLayout} label="状态">
                  {getFieldDecorator('status', {
                    initialValue: true,
                    valuePropName: 'checked',
                  })(<Switch checkedChildren="正常" unCheckedChildren="禁用" />)}
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                </Form.Item>
              </Form>

              <Drawer
                title="请选择关联属性"
                closable={false}
                onClose={this.attributeCloseDrawer}
                visible={this.state.attributeDrawerVisible}
                width={500}
              >
                <p>
                  <Form layout="inline" onSubmit={this.attributeOnSearch}>
                    <Form.Item>
                      {getFieldDecorator('attributeName')(<Input placeholder="搜索内容" />)}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('attributeGoodsTypeId', {
                        initialValue: '0',
                      })(
                        <Select style={{ width: 150 }}>
                          {!!this.state.data.goodsTypes &&
                            this.state.data.goodsTypes.map(option => {
                              return <Option key={option.value.toString()}>{option.name}</Option>;
                            })}
                        </Select>,
                      )}
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        搜索
                      </Button>
                    </Form.Item>
                  </Form>
                  <Table
                    columns={attributeColumns}
                    dataSource={this.state.attributeTable.dataSource}
                    pagination={this.state.attributeTable.pagination}
                    onChange={this.attributeChangePagination}
                  />
                </p>
              </Drawer>

              <Drawer
                title="请选择关联规格"
                closable={false}
                onClose={this.specificationCloseDrawer}
                visible={this.state.specificationDrawerVisible}
                width={500}
              >
                <p>
                  <Form layout="inline" onSubmit={this.specificationOnSearch}>
                    <Form.Item>
                      {getFieldDecorator('specificationName')(<Input placeholder="搜索内容" />)}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('specificationGoodsTypeId', {
                        initialValue: '0',
                      })(
                        <Select style={{ width: 150 }}>
                          {!!this.state.data.goodsTypes &&
                            this.state.data.goodsTypes.map(option => {
                              return <Option key={option.value.toString()}>{option.name}</Option>;
                            })}
                        </Select>,
                      )}
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        搜索
                      </Button>
                    </Form.Item>
                  </Form>
                  <Table
                    columns={specificationColumns}
                    dataSource={this.state.specificationTable.dataSource}
                    pagination={this.state.specificationTable.pagination}
                    onChange={this.specificationChangePagination}
                  />
                </p>
              </Drawer>
            </TabPane>
          </Tabs>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default EditPage;
