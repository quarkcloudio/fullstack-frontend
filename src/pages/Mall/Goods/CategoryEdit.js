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
var spuId = 0;
var skuId = 0;

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
    spuTable:[],
    spuSearch:[],
    spuSelectedIds:[],
    spuSelectedData:[],
    spuDrawerVisible:false,
    skuTable:[],
    skuSearch:[],
    skuSelectedIds:[],
    skuSelectedData:[],
    skuDrawerVisible:false,
    spuSelectedKeys:[],
    skuSelectedKeys:[]
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
        actionUrl: 'admin/goods/categoryEdit?id='+params.id,
      },
      callback: (res) => {
        if (res) {
          this.setState({
            data: res.data,
            coverId:res.data.cover_id,
            spuSelectedIds:res.data.spuSelectedIds,
            skuSelectedIds:res.data.skuSelectedIds,
            spuSelectedData:res.data.spuSelectedData,
            skuSelectedData:res.data.skuSelectedData,
            spuSelectedKeys:res.data.spuSelectedKeys,
            skuSelectedKeys:res.data.skuSelectedKeys
          });

          spuId = res.data.spuSelectedKeys.length;
          skuId = res.data.skuSelectedKeys.length;

          this.props.dispatch({
            type: 'list/data',
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
      
          this.props.dispatch({
            type: 'list/data',
            payload: {
              actionUrl: 'admin/goods/skuIndex',
              skuSelectedIds:this.state.skuSelectedIds
            },
            callback: (res) => {
              if (res) {
                this.setState({ skuTable: res.data.table});
              }
            }
          });
        }
      }
    });
  }

  spuShowDrawer = () => {
    this.setState({
      spuDrawerVisible: true,
    });
  };

  spuCloseDrawer = () => {
    this.setState({
      spuDrawerVisible: false,
    });
  };
  
  // 分页切换
  spuChangePagination = (pagination, filters, sorter) => {
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
  spuOnSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values['name'] = values['spuName'];
        values['goodsTypeId'] = values['spuGoodsTypeId'];
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

  spuRemove = k => {
    const { form } = this.props;

    // can use data-binding to get
    const keys = form.getFieldValue('spuKeys');

    // 移除已经选中spu的id
    let removeSpuSelectedId = this.state.spuSelectedData[k]['id'];
    let spuSelectedIds = this.state.spuSelectedIds;
    let newSpuSelectedIds = spuSelectedIds.filter(function(item) {
      return item != removeSpuSelectedId
    });
    this.setState({ spuSelectedIds: newSpuSelectedIds});

    // can use data-binding to set
    form.setFieldsValue({
      spuKeys: keys.filter(key => key !== k),
    });

    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/spuIndex',
        ...this.state.spuTable.pagination,
        search: this.state.spuSearch,
        spuSelectedIds:newSpuSelectedIds
      },
      callback: (res) => {
        if (res) {
          this.setState({ spuTable: res.data.table});
        }
      }
    });
  };

  spuAdd = (index) => {
    const { form } = this.props;

    // can use data-binding to get
    const keys = form.getFieldValue('spuKeys');
    const nextKeys = keys.concat(spuId++);

    // 已经选中spu的id
    let spuSelectedIds = this.state.spuSelectedIds;
    spuSelectedIds.push(this.state.spuTable.dataSource[index]['id']);
    // 已经选中spu的值
    this.state.spuSelectedData[spuId-1] = this.state.spuTable.dataSource[index];
    this.setState({ spuSelectedIds:spuSelectedIds,spuSelectedData: this.state.spuSelectedData});

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
      spuKeys: nextKeys,
    });
  };

  skuShowDrawer = () => {
    this.setState({
      skuDrawerVisible: true,
    });
  };

  skuCloseDrawer = () => {
    this.setState({
      skuDrawerVisible: false,
    });
  };

  // 分页切换
  skuChangePagination = (pagination, filters, sorter) => {
    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/skuIndex',
        pageSize: pagination.pageSize, // 分页数量
        current: pagination.current, // 当前页码
        sortField: sorter.field, // 排序字段
        sortOrder: sorter.order, // 排序规则
        ...filters, // 筛选
        search: this.state.skuSearch,
        skuSelectedIds:this.state.skuSelectedIds
      },
      callback: (res) => {
        if (res) {
          this.setState({ skuTable: res.data.table});
        }
      }
    });
  };

  // 搜索
  skuOnSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values['name'] = values['skuName'];
        values['goodsTypeId'] = values['skuGoodsTypeId'];
        this.props.dispatch({
          type: 'list/data',
          payload: {
            actionUrl: 'admin/goods/skuIndex',
            ...this.state.skuTable.pagination,
            search: values,
            skuSelectedIds:this.state.skuSelectedIds
          },
          callback: (res) => {
            if (res) {
              this.setState({ skuTable: res.data.table,skuSearch:values});
            }
          }
        });
      }
    });
  };

  skuRemove = k => {
    const { form } = this.props;

    // can use data-binding to get
    const keys = form.getFieldValue('skuKeys');

    // 移除已经选中sku的id
    let removeskuSelectedId = this.state.skuSelectedData[k]['id'];
    let skuSelectedIds = this.state.skuSelectedIds;
    let newskuSelectedIds = skuSelectedIds.filter(function(item) {
      return item != removeskuSelectedId
    });
    this.setState({ skuSelectedIds: newskuSelectedIds});

    // can use data-binding to set
    form.setFieldsValue({
      skuKeys: keys.filter(key => key !== k),
    });

    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/skuIndex',
        ...this.state.skuTable.pagination,
        search: this.state.skuSearch,
        skuSelectedIds:newskuSelectedIds
      },
      callback: (res) => {
        if (res) {
          this.setState({ skuTable: res.data.table});
        }
      }
    });
  };

  skuAdd = (index) => {
    const { form } = this.props;

    // can use data-binding to get
    const keys = form.getFieldValue('skuKeys');
    const nextKeys = keys.concat(skuId++);

    // 已经选中sku的id
    let skuSelectedIds = this.state.skuSelectedIds;
    skuSelectedIds.push(this.state.skuTable.dataSource[index]['id']);
    // 已经选中sku的值
    this.state.skuSelectedData[skuId-1] = this.state.skuTable.dataSource[index];
    this.setState({ skuSelectedIds:skuSelectedIds,skuSelectedData: this.state.skuSelectedData});

    this.props.dispatch({
      type: 'list/data',
      payload: {
        actionUrl: 'admin/goods/skuIndex',
        ...this.state.skuTable.pagination,
        search: this.state.skuSearch,
        skuSelectedIds:this.state.skuSelectedIds
      },
      callback: (res) => {
        if (res) {
          this.setState({ skuTable: res.data.table});
        }
      }
    });

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      skuKeys: nextKeys,
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

    getFieldDecorator('spuKeys', { initialValue: this.state.spuSelectedKeys });
    const spuKeys = getFieldValue('spuKeys');
    const spuFormItems = spuKeys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '关联属性' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`attribute_spu_ids[${k}]`,{
            initialValue: this.state.spuSelectedData[k]['id'],
          })(
          <Input type={'hidden'}/>
        )}
        {getFieldDecorator(`attribute_spu_names[${k}]`,{
            initialValue: this.state.spuSelectedData[k]['name'],
          })(
          <Input placeholder="属性名称" disabled={true} style={{ width: '100px', marginRight: 8 }} />
        )}
        {getFieldDecorator(`attribute_spu_values[${k}]`,{
            initialValue: this.state.spuSelectedData[k]['goods_attribute_values'],
          })(
          <Input placeholder="属性值" disabled={true} style={{ width: '250px', marginRight: 8 }} />
        )}
        {getFieldDecorator(`attribute_spu_groups[${k}]`,{
            initialValue: this.state.spuSelectedData[k]['group'] ? this.state.spuSelectedData[k]['group'] : '',
          })(
          <Input placeholder="分组名称" style={{ width: '100px', marginRight: 8 }} />
        )}
        {getFieldDecorator(`attribute_spu_sorts[${k}]`,{
            initialValue:  this.state.spuSelectedData[k]['sort'] ? this.state.spuSelectedData[k]['sort'] : 0,
          })(
          <Input placeholder="排序" style={{ width: '60px', marginRight: 8 }} />
        )}
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => this.spuRemove(k)}
        />
      </Form.Item>
    ));

    getFieldDecorator('skuKeys', { initialValue: this.state.skuSelectedKeys });
    const skuKeys = getFieldValue('skuKeys');
    const skuFormItems = skuKeys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? '关联规格' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`attribute_sku_ids[${k}]`,{
            initialValue: this.state.skuSelectedData[k]['id'],
          })(
          <Input type={'hidden'}/>
        )}
        {getFieldDecorator(`attribute_sku_names[${k}]`,{
            initialValue: this.state.skuSelectedData[k]['name'],
          })(
          <Input placeholder="属性名称" disabled={true} style={{ width: '100px', marginRight: 8 }} />
        )}
        {getFieldDecorator(`attribute_sku_values[${k}]`,{
            initialValue: this.state.skuSelectedData[k]['goods_attribute_values'],
          })(
          <Input placeholder="属性值" disabled={true} style={{ width: '250px', marginRight: 8 }} />
        )}
        {getFieldDecorator(`attribute_sku_groups[${k}]`,{
            initialValue: this.state.skuSelectedData[k]['group'] ? this.state.skuSelectedData[k]['group'] : '',
          })(
          <Input placeholder="分组名称" style={{ width: '100px', marginRight: 8 }} />
        )}
        {getFieldDecorator(`attribute_sku_sorts[${k}]`,{
            initialValue: this.state.skuSelectedData[k]['sort'] ? this.state.skuSelectedData[k]['sort'] : 0,
          })(
          <Input placeholder="排序" style={{ width: '60px', marginRight: 8 }} />
        )}
        <Icon
          className="dynamic-delete-button"
          type="minus-circle-o"
          onClick={() => this.skuRemove(k)}
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

    const spuColumns = [
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
          <a onClick={() => this.spuAdd(index)}>选择</a>
        ),
      },
    ];

    const skuColumns = [
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
          <a onClick={() => this.skuAdd(index)}>选择</a>
        ),
      },
    ];

    return (
      <PageHeaderWrapper title={false}>
        <div style={{background:'#fff',padding: '10px'}}>
        <Tabs>
          <TabPane tab="基本信息" key="1">
            <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
              <Form.Item {...formItemLayout} label="分类标题">
                {getFieldDecorator('id',{
                    initialValue: this.state.data.id
                  })(
                  <Input type='hidden' />,
                )}
                {getFieldDecorator('title',{
                    initialValue: this.state.data.title
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入分类标题" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="分类名称">
                {getFieldDecorator('name',{
                    initialValue:  this.state.data.name
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
                  {this.state.coverId[0] ? (
                    <img src={this.state.coverId[0]['url']} alt="avatar" width={80} />
                  ) : (uploadButton)}
                </Upload>
              </Form.Item>
              <Form.Item {...formItemLayout} label="父节点">
                {getFieldDecorator('pid',{
                  initialValue:  this.state.data.pid
                  ?  this.state.data.pid.toString()
                  : '0'
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
                    initialValue: this.state.data.sort
                  })(
                  <InputNumber style={{ width: 200 }} placeholder="排序" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="描述">
                {getFieldDecorator('description',{
                    initialValue: this.state.data.description
                  })(
                  <TextArea style={{ width: 400 }} placeholder="请输入描述" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="频道模板">
                {getFieldDecorator('index_tpl',{
                    initialValue: this.state.data.index_tpl
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入频道模板" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="列表模板">
                {getFieldDecorator('lists_tpl',{
                    initialValue: this.state.data.lists_tpl
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入列表模板" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="详情模板">
                {getFieldDecorator('detail_tpl',{
                    initialValue: this.state.data.detail_tpl
                  })(
                  <Input style={{ width: 400 }} placeholder="请输入详情模板" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="分页数量">
                {getFieldDecorator('page_num',{
                    initialValue: this.state.data.page_num
                  })(
                  <InputNumber style={{ width: 200 }} placeholder="请输入分页数量" />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="状态">
                {getFieldDecorator('status',{
                    initialValue: this.state.data.status,
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
              {spuFormItems}
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={this.spuShowDrawer} style={{ width: '400px' }}>
                  <Icon type="plus" /> 添加属性
                </Button>
              </Form.Item>
              {skuFormItems}
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={this.skuShowDrawer} style={{ width: '400px' }}>
                  <Icon type="plus" /> 添加规格
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
              onClose={this.spuCloseDrawer}
              visible={this.state.spuDrawerVisible}
              width={500}
            >
              <p>
                <Form layout="inline" onSubmit={this.spuOnSearch}>
                  <Form.Item>
                    {getFieldDecorator('spuName')(
                      <Input
                        placeholder="搜索内容"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('spuGoodsTypeId',{
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
                  columns={spuColumns}
                  dataSource={this.state.spuTable.dataSource}
                  pagination={this.state.spuTable.pagination}
                  onChange={this.spuChangePagination}
                />
              </p>
            </Drawer>

            <Drawer
              title="请选择关联规格"
              closable={false}
              onClose={this.skuCloseDrawer}
              visible={this.state.skuDrawerVisible}
              width={500}
            >
              <p>
                <Form layout="inline" onSubmit={this.skuOnSearch}>
                  <Form.Item>
                    {getFieldDecorator('skuName')(
                      <Input
                        placeholder="搜索内容"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('skuGoodsTypeId',{
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
                  columns={skuColumns}
                  dataSource={this.state.skuTable.dataSource}
                  pagination={this.state.skuTable.pagination}
                  onChange={this.skuChangePagination}
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