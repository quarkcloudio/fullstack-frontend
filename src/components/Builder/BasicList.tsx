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
import { routerRedux } from 'dva/router';

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
  pageTitle:string;
  pageRandom:string;
  previewImage: string;
  previewVisible: boolean;
  table: [];
  headerButtons:[];
  toolbarButtons:[];
  search:[];
  advancedSearch:[];
  formModel:[];
  advancedSearchExpand:boolean;
  selectedRowKeys:[];
  url?: string;
  submitting: boolean;
  dispatch: Dispatch<any>;
}

const BasicList: React.SFC<BasicListProps> = props => {

  const {
    pageTitle,
    pageRandom,
    previewImage,
    previewVisible,
    table,
    headerButtons,
    toolbarButtons,
    search,
    advancedSearch,
    formModel,
    advancedSearchExpand,
    selectedRowKeys,
    url,
    submitting,
    dispatch,
    form,
  } = props;

  var columns = [];

  if(table.columns) {
    table.columns.map((column:any,key:any) => {
      if(column.render) {
        let renderText = column.render;
        column.render = (text:any, row:any) => (
          <span>
            {eval(renderText)}
          </span>
        )
      }

      if(column.actions) {
        column.render = (text, record) => (
          <span>
          {
            table.columns[key].actions.map((action:any,key:any) => {
              if(action.onClick) {
                return(
                  <span>
                    <Button
                      href={action.href ? action.href+'?id='+record.id : false}
                      size={action.size}
                      type={action.type}
                      target={action.target ? action.target : false}
                      onClick={() => onClickCallback(action.onClick['functionName'],[
                        record.id,
                        (action.name=='启用|禁用') ? ((record.status=='正常') ? 2 : 1) : (action.onClick['value'])
                      ],action.onClick['url'])}
                      style={action.style}
                    >
                      {!!action.icon && (<Icon type={action.icon} />)}
                      {(action.name=='启用|禁用') ? ((record.status=='正常') ? ('禁用') : ('启用')) : (action.name)}
                    </Button>
                    &nbsp;
                  </span>
                )
              } else{
                return(
                  <span>
                    <Button
                      href={action.href ? action.href+'?id='+record.id : false}
                      size={action.size}
                      type={action.type}
                      target={action.target ? action.target : false}
                      style={action.style}
                    >
                      {!!action.icon && (<Icon type={action.icon} />)}
                      {(action.name=='启用|禁用') ? ((record.status=='正常') ? ('禁用') : ('启用')) : (action.name)}
                    </Button>
                    &nbsp;
                  </span>
                )
              }

            })
          }
          </span>
        );
      }
      columns[key] = column;
    })
  }

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

  const onClickCallback = (functionName,value,url) => {
    if(functionName == 'changeStatus') {
      changeStatus(value,url);
    }
  };

  // 打开弹窗
  const openFormModel = () => {

  };

  // 改变数据状态操作
  const changeStatus = (value, getUrl) => {
    // loading
    dispatch({
      type: 'basicList/changeStatus',
      payload: {
        id: value[0],
        status:value[1],
        url: getUrl,
      },
      callback: res => {
        // 调用model
        dispatch({
          type: 'basicList/getListInfo',
          payload: {
            url: url,
          }
        });
      },
    });
  };

  // 改变多个数据状态操作
  const multiChangeStatus = status => {

    let ids = selectedRowKeys;

    dispatch({
      type: 'model/changeStatus',
      payload: {
        id: ids,
        status: status,
      },
    }).then(() => {
      // 调用model
      dispatch({
        type: 'model/index',
        payload: {
          ...table.pagination,
          search: search,
        },
        callback: res => {
          // 执行成功后，进行回调
          if (res) {
            this.setState({ ...res, loading: false });
          }
        },
      });
    });
  };

  // 分页切换
  const changePagination = (pagination, filters, sorter) => {
    // loading
    // 调用model
    dispatch({
      type: 'model/index',
      payload: {
        pageSize: pagination.pageSize, // 分页数量
        current: pagination.current, // 当前页码
        sortField: sorter.field, // 排序字段
        sortOrder: sorter.order, // 排序规则
        ...filters, // 筛选
        search: search,
      },
      callback: res => {
        // 执行成功后，进行回调
        if (res) {
          this.setState({ ...res, loading: false, selectedRowKeys: [] });
        }
      },
    });
  };

  // 搜索
  const handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (values.dateRange) {
        if (values.dateRange[0] && values.dateRange[1]) {
          // 时间标准化
          let dateStart = values.dateRange[0].format('YYYY-MM-DD');
          let dateEnd = values.dateRange[1].format('YYYY-MM-DD');

          // 先清空对象
          values.dateRange = [];

          // 重新赋值对象
          values.dateRange = [dateStart, dateEnd];
        }
      }

      // 验证正确提交表单
      if (!err) {
        const { dispatch } = this.props;
        // 调用model
        dispatch({
          type: 'model/index',
          payload: {
            modelName: this.modelName,
            ...this.state.pagination,
            search: values,
          },
          callback: res => {
            // 执行成功后，进行回调
            if (res) {
              this.setState({ ...res, loading: false });
            }
          },
        });
      }
    });
  };

  // 搜索重置
  const resetSearch = () => {
    form.resetFields();
  };

  // 展开或收缩高级搜索
  const toggle = () => {
    dispatch({
      type: 'basicList/advancedSearchExpand',
      payload: {
        advancedSearchExpand : !advancedSearchExpand
      }
    });
  };

  // 选择事件
  const onSelectChange = (selectedRowKeys:any) => {
    dispatch({
      type: 'basicList/selectedRowKeys',
      payload: {
        selectedRowKeys : selectedRowKeys
      }
    });
  };

  // 行选中配置
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: record => ({
      name: record.name,
    }),
    fixed: 'left',
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <Row type="flex" justify="start">
          <Col span={12}>
            <h5 className={styles.tableHeaderTitle}>{pageTitle}</h5>
          </Col>
          <Col span={12}>
            <div className={styles.floatRight}>
            {!!headerButtons &&
            headerButtons.map((headerButton:any) => {
              return (
              <span>
                <Button
                  href={headerButton.href ? headerButton.href : false}
                  size={headerButton.size}
                  type={headerButton.type}
                  target={headerButton.target ? headerButton.target : false}
                  onClick={() => onClickCallback()}
                  style={headerButton.style}
                >
                  {!!headerButton.icon && (<Icon type={headerButton.icon} />)}
                  {headerButton.name}
                </Button>
                &nbsp;
              </span>
              );
            })}
            </div>
          </Col>
        </Row>
      </div>
      <Divider style={{ marginBottom: 10 }} />
      <div className={styles.tableToolBar}>
        <Row type="flex" justify="start">
          <Col span={8}>
          {!!toolbarButtons &&
            toolbarButtons.map((toolbarButton:any) => {
              return (
              <span>
                <Button
                  href={toolbarButton.href ? toolbarButton.href : false}
                  size={toolbarButton.size}
                  type={toolbarButton.type}
                  target={toolbarButton.target ? toolbarButton.target : false}
                  onClick={() => onClickCallback()}
                  style={toolbarButton.style}
                >
                  {!!toolbarButton.icon && (<Icon type={toolbarButton.icon} />)}
                  {toolbarButton.name}
                </Button>
                &nbsp;
              </span>
              );
            })}
          </Col>
          <Col span={16}>
            <div className={styles.floatRight}>
              <Form layout="inline">
                {!!search.controls &&
                  search.controls.map((control:any) => {
                    if(control.controlType == "text") {
                      return (
                        <Form.Item 
                          labelCol={control.labelCol} 
                          wrapperCol={control.wrapperCol}
                          extra={control.extra}
                        >
                          {getFieldDecorator(control.name,{
                            initialValue: control.value,
                            rules: control.rules
                          })(<Input size={control.size} style={control.style} placeholder={control.placeholder} />)}
                        </Form.Item>
                      );
                    }

                    if(control.controlType == "select") {
                      return (
                        <Form.Item 
                          labelCol={control.labelCol} 
                          wrapperCol={control.wrapperCol}
                          extra={control.extra}
                        >
                          {getFieldDecorator(control.name,{
                            initialValue: control.value
                            ? control.value.toString()
                            : undefined,
                            rules: control.rules
                          })(
                            <Select size={control.size} style={control.style} placeholder={control.placeholder}>
                              {!!control.options && control.options.map((option:any) => {
                              return (<Option key={option.value}>{option.name}</Option>)
                              })}
                            </Select>
                          )}
                        </Form.Item>
                      );
                    }

                    if(control.controlType == "datePicker") {
                      return (
                        <Form.Item 
                          labelCol={control.labelCol} 
                          wrapperCol={control.wrapperCol}
                          extra={control.extra}
                        >
                          {getFieldDecorator(control.name,{
                            initialValue: moment(control.value, 'YYYY-MM-DD HH:mm:ss'),
                            rules: control.rules
                          })(
                            <DatePicker
                              showTime={control.showTime}
                              size={control.size}
                              style={control.style}
                              locale={locale}
                              format={control.format}
                              placeholder={control.placeholder}
                            />
                          )}
                        </Form.Item>
                      );
                    }

                    if(control.controlType == "rangePicker") {
                      return (
                        <Form.Item 
                          labelCol={control.labelCol} 
                          wrapperCol={control.wrapperCol}
                          extra={control.extra}
                        >
                          {getFieldDecorator(control.name,{
                            initialValue: [
                              !!control.value[0]&&moment(control.value[0], control.format),
                              !!control.value[1]&&moment(control.value[1], control.format)
                            ],
                            rules: control.rules
                          })(
                            <RangePicker
                              showTime={control.showTime}
                              size={control.size}
                              style={control.style}
                              locale={locale}
                              format={control.format}
                            />
                          )}
                        </Form.Item>
                      );
                    }

                    if(control.controlType == "button") {
                      return (
                        <Form.Item 
                          labelCol={control.labelCol} 
                          wrapperCol={control.wrapperCol} 
                          extra={control.extra}
                        >
                          <Button
                            href={control.href ? control.href : false}
                            size={control.size}
                            type={control.type}
                            target={control.target ? control.target : false}
                            onClick={() => onClickCallback()}
                            style={control.style}
                          >
                            {!!control.icon && (<Icon type={control.icon} />)}
                            {control.name}
                          </Button>
                        </Form.Item>
                      );
                    }

                  })}
                {!!advancedSearch && (
                  <Form.Item style={{ marginRight: 10 }}>
                    <a style={{ fontSize: 12 }} onClick={toggle}>
                      高级搜索 <Icon type={advancedSearchExpand ? 'up' : 'down'} />
                    </a>
                  </Form.Item>
                )}
              </Form>
            </div>
          </Col>
        </Row>
      </div>

      <div
        className={styles.tableAdvancedSearchBar}
        style={{ display: advancedSearchExpand ? 'block' : 'none' }}
      >
        <Row>
          <Col span={24}>
            <Form layout="inline">
            {!!advancedSearch.controls &&
              advancedSearch.controls.map((control:any) => {
                if(control.controlType == "text") {
                  return (
                    <Form.Item 
                      labelCol={control.labelCol} 
                      wrapperCol={control.wrapperCol}
                      extra={control.extra}
                      label={control.labelName}
                    >
                      {getFieldDecorator(control.name,{
                        initialValue: control.value,
                        rules: control.rules
                      })(<Input size={control.size} style={control.style} placeholder={control.placeholder} />)}
                    </Form.Item>
                  );
                }

                if(control.controlType == "select") {
                  return (
                    <Form.Item 
                      labelCol={control.labelCol} 
                      wrapperCol={control.wrapperCol}
                      extra={control.extra}
                      label={control.labelName}
                    >
                      {getFieldDecorator(control.name,{
                        initialValue: control.value
                        ? control.value.toString()
                        : undefined,
                        rules: control.rules
                      })(
                        <Select size={control.size} style={control.style} placeholder={control.placeholder}>
                          {!!control.options && control.options.map((option:any) => {
                          return (<Option key={option.value}>{option.name}</Option>)
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  );
                }

                if(control.controlType == "datePicker") {
                  return (
                    <Form.Item 
                      labelCol={control.labelCol} 
                      wrapperCol={control.wrapperCol}
                      extra={control.extra}
                      label={control.labelName}
                    >
                      {getFieldDecorator(control.name,{
                        initialValue: moment(control.value, 'YYYY-MM-DD HH:mm:ss'),
                        rules: control.rules
                      })(
                        <DatePicker
                          showTime={control.showTime}
                          size={control.size}
                          style={control.style}
                          locale={locale}
                          format={control.format}
                          placeholder={control.placeholder}
                        />
                      )}
                    </Form.Item>
                  );
                }

                if(control.controlType == "rangePicker") {
                  return (
                    <Form.Item 
                      labelCol={control.labelCol} 
                      wrapperCol={control.wrapperCol} 
                      label={control.labelName}
                      extra={control.extra}
                    >
                      {getFieldDecorator(control.name,{
                        initialValue: [
                          !!control.value[0]&&moment(control.value[0], control.format),
                          !!control.value[1]&&moment(control.value[1], control.format)
                        ],
                        rules: control.rules
                      })(
                        <RangePicker
                          showTime={control.showTime}
                          size={control.size}
                          style={control.style}
                          locale={locale}
                          format={control.format}
                        />
                      )}
                    </Form.Item>
                  );
                }

                if(control.controlType == "button") {
                  return (
                    <Form.Item 
                      labelCol={control.labelCol} 
                      wrapperCol={control.wrapperCol} 
                      label={control.labelName}
                      extra={control.extra}
                    >
                      <Button
                        href={control.href ? control.href : false}
                        size={control.size}
                        type={control.type}
                        target={control.target ? control.target : false}
                        onClick={() => onClickCallback()}
                        style={control.style}
                      >
                        {!!control.icon && (<Icon type={control.icon} />)}
                        {control.name}
                      </Button>
                    </Form.Item>
                  );
                }

              })}
            </Form>
          </Col>
        </Row>
      </div>

      <div className={styles.tableData}>
        <Table
          rowKey={record => record.id}
          rowSelection={rowSelection}
          columns={table.columns}
          dataSource={table.dataSource}
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
    pageTitle:basicList.pageTitle,
    table:basicList.table,
    headerButtons:basicList.headerButtons,
    toolbarButtons:basicList.toolbarButtons,
    search:basicList.search,
    advancedSearch:basicList.advancedSearch,
    formModel:basicList.formModel,
    advancedSearchExpand:basicList.advancedSearchExpand,
    selectedRowKeys:basicList.selectedRowKeys,
    pageRandom:basicList.pageRandom
  }))(BasicList),
);
