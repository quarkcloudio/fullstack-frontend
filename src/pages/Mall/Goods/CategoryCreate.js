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
  Drawer
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
var id = 0;

@connect(({ model }) => ({
  model,
}))

@Form.create()

class CreatePage extends PureComponent {

  state = {
    msg: '',
    url: '',
    data: {},
    status: '',
    loading: false,
    categorySelected:'0',
    fileList: false,
    showSpu:'none',
    showSku:'none',
    spuTable:[],
    spuSearch:[],
    spuSelectedIds:[],
    spuSelectedData:[],
    pagination:[],
    drawerVisible:false
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
        actionUrl: 'admin/goods/categoryCreate',
      },
      callback: (res) => {
        if (res) {
          if(params.id) {
            this.setState({ data: res.data,categorySelected:params.id });
          } else {
            this.setState({ data: res.data,categorySelected:'0' });
          }
        }
      }
    });

    this.props.dispatch({
      type: 'list/info',
      payload: {
        actionUrl: 'admin/goods/spuIndex',
        spuSelectedIds:this.state.spuSelectedIds
      },
      callback: (res) => {
        if (res) {
          this.setState({ spuTable: res.data.table});
        }
      }
    });
  }

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  closeDrawer = () => {
    this.setState({
      drawerVisible: false,
    });
  };
  
  // 分页切换
  changePagination = (pagination, filters, sorter) => {
    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/spuIndex',
        pageSize: pagination.pageSize, // 分页数量
        current: pagination.current, // 当前页码
        sortField: sorter.field, // 排序字段
        sortOrder: sorter.order, // 排序规则
        ...filters, // 筛选
        search: this.state.spuSearch,
        spuSelectedIds:this.state.spuSelectedIds
      },
      callback: (res) => {
        if (res) {
          this.setState({ spuTable: res.data.table});
        }
      }
    });
  };

  // 搜索
  onSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'list/data',
          payload: {
            actionUrl: 'admin/goods/spuIndex',
            ...this.state.spuTable.pagination,
            search: values,
            spuSelectedIds:this.state.spuSelectedIds
          },
          callback: (res) => {
            if (res) {
              this.setState({ spuTable: res.data.table,spuSearch:values});
            }
          }
        });
      }
    });
  };

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = (spuKey) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);

    let spuSelectedIds = this.state.spuSelectedIds;

    spuSelectedIds.push(this.state.spuTable.dataSource[spuKey]['id']);

    this.setState({ spuSelectedIds: spuSelectedIds});

    let spuSelectedData = this.state.spuSelectedData;
    let getSpuSelectedData = [];
    getSpuSelectedData[nextKeys] = this.state.spuTable.dataSource[spuKey];

    console.log(getSpuSelectedData);
    this.setState({ spuSelectedData: getSpuSelectedData});

    console.log(this.state.spuSelectedData);

    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/spuIndex',
        ...this.state.spuTable.pagination,
        search: this.state.spuSearch,
        spuSelectedIds:this.state.spuSelectedIds
      },
      callback: (res) => {
        if (res) {
          this.setState({ spuTable: res.data.table});
        }
      }
    });

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // 验证正确提交表单
      if (!err) {
        this.props.dispatch({
          type: 'form/submit',
          payload: {
            actionUrl: 'admin/goods/categoryStore',
            ...values,
          },
        });
      }
    });
  };

  brandFilterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

  brandChange = targetKeys => {
    let data = this.state.data;
    data.goodsBrandSelectedKeys = targetKeys
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
        offset: 2
      },
    };

    getFieldDecorator('keys', { initialValue: [] });

    const keys = getFieldValue('keys');

    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '关联属性' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`attribute_ids[${k}]`,{
            initialValue: this.state.spuSelectedData[k]['id'],
          })(
          <Input type={'hidden'}/>
        )}
        {getFieldDecorator(`attribute_names[${k}]`,{
            initialValue: this.state.spuSelectedData[k]['name'],
          })(
          <Input placeholder="属性名称" disabled={true} style={{ width: '100px', marginRight: 8 }} />
        )}
        {getFieldDecorator(`attribute_values[${k}]`,{
            initialValue: this.state.spuSelectedData[k]['goods_attribute_values'],
          })(
          <Input placeholder="属性值" disabled={true} style={{ width: '250px', marginRight: 8 }} />
        )}
        {getFieldDecorator(`attribute_groups[${k}]`,{
            initialValue: '',
          })(
          <Input placeholder="分组名称" style={{ width: '100px', marginRight: 8 }} />
        )}
        {getFieldDecorator(`attribute_sorts[${k}]`,{
            initialValue: 0,
          })(
          <Input placeholder="排序" style={{ width: '60px', marginRight: 8 }} />
        )}
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => this.remove(k)}
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

    const columns = [
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
        render: (text, record,index) => (
          <a onClick={() => this.add(index)}>选择</a>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title={false}>
        <div style={{background:'#fff',padding: '10px'}}>
        <Tabs>
          <TabPane tab="基本信息" key="1">
            <Form style={{ marginTop: 8 }}>
              <Form.Item {...formItemLayout} label="分类标题">
                {getFieldDecorator('title',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入分类标题" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="分类名称">
                {getFieldDecorator('name',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 200 }} placeholder="请输入分类名称" />,
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="封面图"
              >
                <Upload
                  name={'file'}
                  listType={"picture-card"}
                  showUploadList={false}
                  action={'/api/admin/picture/upload'}
                  headers={{authorization: 'Bearer ' + sessionStorage['token']}}
                  beforeUpload = {(file) => {
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
                  onChange = {(info) => {
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
                  {this.state.fileList ? (
                    <img src={this.state.fileList[0]['url']} alt="avatar" width={80} />
                  ) : (uploadButton)}
                </Upload>
              </Form.Item>
              <Form.Item {...formItemLayout} label="父节点">
                {getFieldDecorator('pid',{
                  initialValue:  this.state.categorySelected
                  ?  this.state.categorySelected
                  : undefined
                })(
                  <Select
                    style={{ width: 200 }}
                  >
                    {!!this.state.data.categorys && this.state.data.categorys.map((option) => {
                      return (<Option key={option.value.toString()}>{option.name}</Option>)
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="排序">
                {getFieldDecorator('sort',{
                    initialValue: 0
                  })(
                  <InputNumber style={{ width: 200 }} placeholder="排序" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="描述">
                {getFieldDecorator('description',{
                    initialValue: ''
                  })(
                  <TextArea style={{ width: 400 }} placeholder="请输入描述" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="频道模板">
                {getFieldDecorator('index_tpl',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入频道模板" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="列表模板">
                {getFieldDecorator('lists_tpl',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入列表模板" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="详情模板">
                {getFieldDecorator('detail_tpl',{
                    initialValue: ''
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入详情模板" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="分页数量">
                {getFieldDecorator('page_num',{
                    initialValue: 0
                  })(
                  <InputNumber style={{ width: 200 }} placeholder="请输入分页数量" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="状态">
                {getFieldDecorator('status',{
                    initialValue: true,
                    valuePropName: 'checked'
                  })(
                  <Switch checkedChildren="正常" unCheckedChildren="禁用" />,
                )}
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
                {getFieldDecorator('brand_ids',{
                    initialValue: ''
                  })(
                    <Transfer
                    titles={['所有品牌', '已选择关联品牌']}
                    dataSource={this.state.data?this.state.data.goodsBrands:[]}
                    showSearch
                    listStyle={{
                      width: 300,
                      height: 300,
                    }}
                    filterOption={this.brandFilterOption}
                    targetKeys={this.state.data?this.state.data.goodsBrandSelectedKeys:[]}
                    onChange={this.brandChange}
                    render={item => item.title}
                  />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="状态">
                {getFieldDecorator('status',{
                    initialValue: true,
                    valuePropName: 'checked'
                  })(
                  <Switch checkedChildren="正常" unCheckedChildren="禁用" />,
                )}
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
              {formItems}
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={this.showDrawer} style={{ width: '400px' }}>
                  <Icon type="plus" /> 添加属性
                </Button>
              </Form.Item>
              <Form.Item {...formItemLayout} label="状态">
                {getFieldDecorator('status',{
                    initialValue: true,
                    valuePropName: 'checked'
                  })(
                  <Switch checkedChildren="正常" unCheckedChildren="禁用" />,
                )}
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  提交
                </Button>
              </Form.Item>
            </Form>

            <Drawer
              title="请选择关联属性"
              closable={false}
              onClose={this.closeDrawer}
              visible={this.state.drawerVisible}
              width={500}
            >
              <p>
                <Form layout="inline" onSubmit={this.onSearch}>
                  <Form.Item>
                    {getFieldDecorator('name')(
                      <Input
                        placeholder="搜索内容"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('goodsTypeId',{
                        initialValue: '0',
                      })(
                      <Select style={{ width: 150 }}>
                        {!!this.state.data.goodsTypes && this.state.data.goodsTypes.map((option) => {
                          return (<Option key={option.value.toString()}>{option.name}</Option>)
                        })}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      搜索
                    </Button>
                  </Form.Item>
                </Form>
                <Table 
                  columns={columns}
                  dataSource={this.state.spuTable.dataSource}
                  pagination={this.state.spuTable.pagination}
                  onChange={this.changePagination}
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

export default CreatePage;