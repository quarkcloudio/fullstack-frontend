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
import ModalForm from '@/components/Builder/ModalForm';

import {
  Spin,
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
  pageLoading: boolean;
  tableLoading: boolean;
  headerButtons:[];
  toolbarButtons:[];
  search:[];
  advancedSearch:[];
  advancedSearchExpand:boolean;
  searchValues:[];
  table: [];
  selectedRowKeys:[];
  modalTitle:string;
  modalWidth:string;
  modalFormUrl:string;
  modalVisible:boolean;
  url?: string;
  submitting: boolean;
  dispatch: Dispatch<any>;
}

const BasicList: React.SFC<BasicListProps> = props => {

  const {
    pageTitle,
    pageRandom,
    pageLoading,
    tableLoading,
    headerButtons,
    toolbarButtons,
    search,
    advancedSearch,
    advancedSearchExpand,
    searchValues,
    table,
    selectedRowKeys,
    modalTitle,
    modalWidth,
    modalFormUrl,
    modalVisible,
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

      if(column.isImage) {
        column.render = (text:any, row:any) => (
          <img src={text} width={40} height={40}></img>
        )
      }

      if(column.isIcon) {
        column.render = (text:any, row:any) => (
          <Icon type={text} />
        )
      }

      if(column.a) {
        if(column.a['href'].indexOf("?") != -1) {
          column.render = (text:any, row:any) => (
            <a href={column.a['href']+'&id='+row.id} target={column.a['target']}>
              {text}
            </a>
          )
        } else {
          column.render = (text:any, row:any) => (
            <a href={column.a['href']+'?id='+row.id} target={column.a['target']}>
              {text}
            </a>
          )
        }
      }

      if(column.isImage && column.a) {

        if(column.a['href'].indexOf("?") != -1) {
          column.render = (text:any, row:any) => (
            <a href={column.a['href']+'&id='+row.id} target={column.a['target']}>
              <img src={text} width={40} height={40}></img>
            </a>
          )
        } else {
          column.render = (text:any, row:any) => (
            <a href={column.a['href']+'?id='+row.id} target={column.a['target']}>
              <img src={text} width={40} height={40}></img>
            </a>
          )
        }
      }

      if(column.tag) {
        column.render = (text:any, row:any) => (
          <span>
            <Tag color={eval(column.tag)}>{text}</Tag>
          </span>
        )
      }

      if(column.actions) {
        column.render = (text, row) => (
          <span>
          {
            table.columns[key].actions.map((action:any,key:any) => {

              if(action.componentName == "button") {

                let actionHref = '';

                if(action.href) {
                  if(action.href.indexOf("?") != -1) {
                    actionHref = action.href+'&id='+row.id;
                  } else {
                    actionHref = action.href+'?id='+row.id;
                  }
                }

                return (
                  <span>
                    <Button
                      href={actionHref ? actionHref : undefined}
                      size={action.size}
                      type={action.type}
                      target={action.target ? action.target : false}
                      onClick={() => callback(action.onClick['name'],(action.name=='启用|禁用') ? ((row.status=='正常') ? [row.id,'2'] : [row.id,'1']) : [row.id,action.onClick['value']],action.onClick['url']+'?id='+row.id)}
                      style={action.style}
                    >
                      {!!action.icon && (<Icon type={action.icon} />)}
                      {(action.name=='启用|禁用') ? ((row.status=='正常') ? ('禁用') : ('启用')) : (action.name)}
                    </Button>
                  </span>
                );
              }

              if(action.componentName == "popconfirm") {
                return (
                  <span>
                    <Popconfirm title="确定删除吗？" onConfirm={() => callback(action.onConfirm['name'],[row.id,action.onConfirm['value']],action.onConfirm['url']+'?id='+row.id)}>
                      <Button
                        size={action.size}
                        type={action.type}
                        style={action.style}
                      >
                        {!!action.icon && (<Icon type={action.icon} />)}
                        {action.name}
                      </Button>
                    </Popconfirm>
                  </span>
                );
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
      sessionStorage.setItem('listUrl', url);
      dispatch({
        type: 'list/info',
        payload: {
          actionUrl: url,
        }
      });
    }
  }, []);

  const callback = (name,value,actionUrl) => {
    if(name == 'changeStatus') {
      changeStatus(actionUrl,value);
    }
    if(name == 'multiChangeStatus') {
      multiChangeStatus(actionUrl,value);
    }
    if(name == 'search') {
      onSearch(actionUrl);
    }
    if(name == 'resetSearch') {
      form.resetFields();
    }
    if(name == 'openModal') {
      openModal(actionUrl,value);
    }
    if(name == 'submit') {
      onSubmit(actionUrl,value);
    }
  };

  // 改变数据状态操作
  const changeStatus = (actionUrl,value) => {
    console.log(value)
    dispatch({
      type: 'list/changeStatus',
      payload: {
        actionUrl: actionUrl,
        id:value[0],
        status:value[1],
      },
      callback: res => {
        // 调用model
        dispatch({
          type: 'list/data',
          payload: {
            actionUrl: url,
            ...table.pagination,
            search: searchValues,
          }
        });
      },
    });
  };

  // 改变多个数据状态操作
  const multiChangeStatus = (actionUrl,value) => {
    let ids = selectedRowKeys;
    dispatch({
      type: 'list/changeStatus',
      payload: {
        actionUrl: actionUrl,
        id: ids,
        status: value,
      },
      callback: res => {
        // 调用model
        dispatch({
          type: 'list/data',
          payload: {
            actionUrl: url,
            ...table.pagination,
            search: searchValues,
          }
        });
      },
    });
  };

  // 分页切换
  const changePagination = (pagination, filters, sorter) => {
    dispatch({
      type: 'list/data',
      payload: {
        actionUrl: url,
        pageSize: pagination.pageSize, // 分页数量
        current: pagination.current, // 当前页码
        sortField: sorter.field, // 排序字段
        sortOrder: sorter.order, // 排序规则
        ...filters, // 筛选
        search: searchValues,
      }
    });
  };

  // 搜索
  const onSearch = (actionUrl:string) => {

    form.validateFields((err, values) => {
      search.map((control:any,key:any) => {
        if(control.componentName == 'datePicker') {
          values[control.name] = values[control.name].format('YYYY-MM-DD HH:mm:ss');
        }
        if(control.componentName == 'rangePicker') {
          if (values[control.name]) {
            if (values[control.name][0] && values[control.name][1]) {
              // 时间标准化
              let dateStart = values[control.name][0].format('YYYY-MM-DD HH:mm:ss');
              let dateEnd = values[control.name][1].format('YYYY-MM-DD HH:mm:ss');
              // 先清空对象
              values[control.name] = [];
              // 重新赋值对象
              values[control.name] = [dateStart, dateEnd];
            }
          }
        }
      })

      advancedSearch.map((control:any,key:any) => {
        if(control.componentName == 'datePicker') {
          values[control.name] = values[control.name].format('YYYY-MM-DD HH:mm:ss');
        }
        if(control.componentName == 'rangePicker') {
          if (values[control.name]) {
            if (values[control.name][0] && values[control.name][1]) {
              // 时间标准化
              let dateStart = values[control.name][0].format('YYYY-MM-DD HH:mm:ss');
              let dateEnd = values[control.name][1].format('YYYY-MM-DD HH:mm:ss');
              // 先清空对象
              values[control.name] = [];
              // 重新赋值对象
              values[control.name] = [dateStart, dateEnd];
            }
          }
        }
      })

      if (!err) {
        dispatch({
          type: 'list/data',
          payload: {
            actionUrl: actionUrl ? actionUrl : url,
            ...table.pagination,
            search: values,
          }
        });
      }
    });
  };

  const onSubmit = (actionUrl,values) => {
    dispatch({
      type: 'list/submit',
      payload: {
        actionUrl: actionUrl,
        ...values,
      },
      callback: res => {
        // 调用model
        dispatch({
          type: 'list/data',
          payload: {
            actionUrl: url,
            ...table.pagination,
            search: searchValues,
          }
        });
      },
    });
  };

  // 展开或收缩高级搜索
  const toggle = () => {
    dispatch({
      type: 'list/advancedSearchExpand',
      payload: {
        advancedSearchExpand : !advancedSearchExpand
      }
    });
  };

  // 选择事件
  const onSelectChange = (selectedRowKeys:any) => {
    dispatch({
      type: 'list/selectedRowKeys',
      payload: {
        selectedRowKeys : selectedRowKeys
      }
    });
  };

  // 行选中配置
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: row => ({
      name: row.name,
    }),
    fixed: 'left',
  };

  const openModal = (actionUrl,value) => {

    dispatch({
      type: 'list/modalVisible',
      payload: {
        modalVisible:true,
        modalFormUrl:actionUrl,
        modalTitle:value.title ? value.title : value['1'].title,
        modalWidth:value.width ? value.width : value['1'].width,
      }
    });
  };

  const closeModal = () => {
    dispatch({
      type: 'list/modalVisible',
      payload: {
        modalVisible: false,
        modalFormUrl:'',
        modalTitle:'',
        modalWidth:'',
      }
    });
  };

  return (
    <Spin spinning={pageLoading} tip="Loading..." style={{background:'#fff'}}>
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <Row type="flex" justify="start">
          <Col span={12}>
            <h5 className={styles.tableHeaderTitle}>{pageTitle}</h5>
          </Col>
          <Col span={12}>
            <div className={styles.floatRight}>
              <Form layout="inline">
                {!!headerButtons &&
                headerButtons.map((control:any) => {
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
                        onClick={() => callback(control.onClick['name'],control.onClick['value'],control.onClick['url'])}
                        style={control.style}
                      >
                        {!!control.icon && (<Icon type={control.icon} />)}
                        {control.name}
                      </Button>
                    </Form.Item>
                  );
                })}
              </Form>
            </div>
          </Col>
        </Row>
      </div>
      <Divider style={{ marginBottom: 10,marginTop: 10 }} />
      <div className={styles.tableToolBar}>
        <Row type="flex" justify="start">
          <Col span={8}>
            <Form layout="inline">
              {!!toolbarButtons &&
              toolbarButtons.map((control:any) => {
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
                      onClick={() => callback(control.onClick['name'],control.onClick['value'],control.onClick['url'])}
                      style={control.style}
                    >
                      {!!control.icon && (<Icon type={control.icon} />)}
                      {control.name}
                    </Button>
                  </Form.Item>
                );
              })}
            </Form>
          </Col>
          <Col span={16}>
            <div className={styles.floatRight}>
              <Form layout="inline">
                {!!search &&
                  search.map((control:any) => {
                    if(control.componentName == "input") {
                      return (
                        <Form.Item 
                          labelCol={control.labelCol} 
                          wrapperCol={control.wrapperCol}
                          extra={control.extra}
                        >
                          {getFieldDecorator(control.name,{
                            initialValue: control.value,
                            rules: control.rules
                          })(<Input onPressEnter={() => onSearch('')} size={control.size} style={control.style} placeholder={control.placeholder} />)}
                        </Form.Item>
                      );
                    }

                    if(control.componentName == "select") {
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

                    if(control.componentName == "datePicker") {
                      return (
                        <Form.Item 
                          labelCol={control.labelCol} 
                          wrapperCol={control.wrapperCol}
                          extra={control.extra}
                        >
                          {getFieldDecorator(control.name,{
                            initialValue: !!control.value&&moment(control.value, control.format),
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

                    if(control.componentName == "rangePicker") {
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

                    if(control.componentName == "button") {
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
                            onClick={() => callback(control.onClick['name'],control.onClick['value'],control.onClick['url'])}
                            style={control.style}
                          >
                            {!!control.icon && (<Icon type={control.icon} />)}
                            {control.name}
                          </Button>
                        </Form.Item>
                      );
                    }

                  })}
                {(advancedSearch.length != 0) && (
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
            {!!advancedSearch &&
              advancedSearch.map((control:any) => {
                if(control.componentName == "input") {
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
                      })(<Input onPressEnter={() => onSearch('')} size={control.size} style={control.style} placeholder={control.placeholder} />)}
                    </Form.Item>
                  );
                }

                if(control.componentName == "select") {
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

                if(control.componentName == "datePicker") {
                  return (
                    <Form.Item 
                      labelCol={control.labelCol} 
                      wrapperCol={control.wrapperCol}
                      extra={control.extra}
                      label={control.labelName}
                    >
                      {getFieldDecorator(control.name,{
                        initialValue: !!control.value&&moment(control.value, control.format),
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

                if(control.componentName == "rangePicker") {
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

                if(control.componentName == "button") {
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
                        onClick={() => callback(control.onClick['name'],control.onClick['value'],control.onClick['url'])}
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
          pagination={table.pagination}
          loading={tableLoading}
          onChange={changePagination}
        />
      </div>
      {!!modalFormUrl && (
        <Modal
          title={modalTitle}
          width={modalWidth}
          visible={modalVisible}
          onCancel={closeModal}
          centered={true}
          footer={false}
        >
          <ModalForm url={modalFormUrl} />
        </Modal>
      )}
    </div>
    </Spin>
  );
};

export default Form.create<BasicListProps>()(
  connect(({ loading ,list}: ConnectState) => ({
    submitting: loading.effects['list/submit'],
    pageTitle:list.pageTitle,
    pageRandom:list.pageRandom,
    pageLoading:list.pageLoading,
    tableLoading:list.tableLoading,
    headerButtons:list.headerButtons,
    toolbarButtons:list.toolbarButtons,
    search:list.search,
    advancedSearch:list.advancedSearch,
    advancedSearchExpand:list.advancedSearchExpand,
    searchValues:list.searchValues,
    table:list.table,
    selectedRowKeys:list.selectedRowKeys,
    modalTitle:list.modalTitle,
    modalWidth:list.modalWidth,
    modalFormUrl:list.modalFormUrl,
    modalVisible:list.modalVisible,
  }))(BasicList),
);
