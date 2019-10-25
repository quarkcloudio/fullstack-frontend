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
  Cascader,
  TreeSelect,
  Divider,
  Typography,
  Table,
  Popconfirm,
  Affix,
  Spin,
} from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TreeNode } = TreeSelect;
const { Title } = Typography;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;

    let rules = false;
    let editableCellClass = styles.editableCellValueWrap;
    let editableRowInput = styles.editableRowInput;

    if (dataIndex == 'goods_price' || dataIndex == 'stock_num') {
      rules = [
        {
          required: true,
          message: `${title}必填`,
        },
      ];
    }

    if (dataIndex == 'goods_sn' || dataIndex == 'goods_barcode') {
      editableCellClass = styles.bigEditableCellValueWrap;
      editableRowInput = styles.bigEditableRowInput;
    }

    return editing ? (
      <Form.Item className={editableRowInput}>
        {form.getFieldDecorator(dataIndex, {
          rules: rules,
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div className={editableCellClass} style={{ paddingRight: 24 }} onClick={this.toggleEdit}>
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

var id = 0;

@connect(({ model }) => ({
  model,
}))
@Form.create()
class CreatePage extends PureComponent {
  handleChangeStatus = key => {
    let dataSource = [...this.state.dataSource];
    dataSource[key-1]['status'] = dataSource[key-1]['status']==0 ? 1 :0 ;
    this.setState({ dataSource: dataSource});
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  state = {
    msg: '',
    url: '',
    data: {
      categorys: [],
      shops: [],
      goodsUnits: [],
    },
    status: '',
    goodsMode: 1,
    showFreightInfo: true,
    showSpecialInfo: false,
    shopId: '',
    categoryId: '',
    systemGoodsAttributes: false,
    shopGoodsAttributes: false,
    goodsAttributes: false,
    checkedGoodsAttributes: [],
    loading: false,
    unitLoading: false,
    layoutLoading: false,
    columns: [],
    dataSource: false,
    goodsSkus: false,
    checkedGoodsAttributeValues: [],
    coverId: false,
    fileId: false,
    keys: [],
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {
    // 获得url参数
    const params = this.props.location.query;

    this.setState({ loading: true });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/goods/edit',
        ...params,
      },
      callback: res => {
        if (res) {
          let showFreightInfo = true;
          let showSpecialInfo = false;

          if (res.data.goods_mode == 1) {
            let showFreightInfo = true;
            let showSpecialInfo = false;
          } else if (res.data.goods_mode == 2) {
            let showFreightInfo = false;
            let showSpecialInfo = true;
          } else if (res.data.goods_mode == 3) {
            let showFreightInfo = false;
            let showSpecialInfo = true;
          }

          this.setState({
            loading: false,
            data: res.data,
            coverId: res.data.cover_id,
            fileId: res.data.file_id,
            showFreightInfo: showFreightInfo,
            showSpecialInfo: showSpecialInfo,
            systemGoodsAttributes: res.data.systemGoodsAttributes,
            shopGoodsAttributes: res.data.shopGoodsAttributes,
            goodsAttributes: res.data.goodsAttributes,
            keys: res.data.keys,
            checkedGoodsAttributes: res.data.checkedGoodsAttributes,
            checkedGoodsAttributeValues: res.data.checkedGoodsAttributeValues,
            goodsSkus: res.data.goodsSkus,
          });

          id = res.data.keys.length;

          this.initGoodsAttributeValue();
        }
      },
    });
  }

  reload = e => {
    // unitLoading
    this.setState({ unitLoading: true, layoutLoading: true });

    const params = this.props.location.query;

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/goods/edit',
        ...params,
      },
      callback: res => {
        if (res) {
          this.setState({ data: res.data, unitLoading: false, layoutLoading: false });
        }
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({ loading: true });

      const params = this.props.location.query;

      let dataSource = []
      this.state.dataSource.map(row => {
        let getRow = {...row};
        dataSource.push(getRow)
      })

      values['goods_skus'] = dataSource;
      values['pc_content'] = values['pc_content'].toHTML();
      values['mobile_content'] = values['mobile_content'].toHTML();
      values['cover_id'] = this.state.coverId;
      values['file_id'] = this.state.fileId;
      // 验证正确提交表单
      if (!err) {
        this.props.dispatch({
          type: 'form/submit',
          payload: {
            actionUrl: 'admin/goods/save',
            ...values,
            ...params,
          },
          callback: res => {
            if (res) {
              this.setState({ loading: false });
            }
          },
        });
      }
    });
  };

  onGoodsModeChange = e => {
    if (e.target.value == 1) {
      this.setState({
        showFreightInfo: true,
        showSpecialInfo: false,
      });
    } else if (e.target.value == 2) {
      this.setState({
        showFreightInfo: false,
        showSpecialInfo: true,
      });
    } else if (e.target.value == 3) {
      this.setState({
        showFreightInfo: false,
        showSpecialInfo: true,
      });
    }
  };

  onShopChange = value => {
    this.setState({
      shopId: value,
    });
  };

  onCategoryChange = value => {
    this.setState({
      categoryId: value[value.length - 1],
    });

    this.props.dispatch({
      type: 'form/info',
      payload: {
        actionUrl: 'admin/goods/attribute',
        categoryId: value[value.length - 1],
        shopId: this.state.shopId,
      },
      callback: res => {
        if (res) {
          this.setState({
            systemGoodsAttributes: res.data.systemGoodsAttributes,
            shopGoodsAttributes: res.data.shopGoodsAttributes,
            goodsAttributes: res.data.goodsAttributes,
          });
        }
      },
    });
  };

  onGoodsAttributeChange = value => {
    this.setState({
      checkedGoodsAttributes: value,
    });
  };

  onGoodsAttributeValueChange = (goodsAttributeValues, goodsAttributeId) => {
    let checkedGoodsAttributeValues = [];

    this.state.checkedGoodsAttributes.map(checkedGoodsAttribute => {
      let getCheckedGoodsAttributeValues = [];
      if (goodsAttributeId == checkedGoodsAttribute) {
        getCheckedGoodsAttributeValues['value'] = goodsAttributeValues;
      } else {
        getCheckedGoodsAttributeValues['value'] = this.props.form.getFieldValue(
          'goodsAttribute' + checkedGoodsAttribute,
        );
      }

      getCheckedGoodsAttributeValues['id'] = checkedGoodsAttribute;
      checkedGoodsAttributeValues.push(getCheckedGoodsAttributeValues);
    });

    let getColumns = [];

    let col = {
      title: 'ID',
      dataIndex: 'id',
    };
    getColumns.push(col);

    let tempCheckedGoodsAttributeValues = [];

    if (this.state.checkedGoodsAttributes) {
      this.state.goodsAttributes.map(value => {
        if (this.state.checkedGoodsAttributes.indexOf(value.id) != -1) {
          console.log(checkedGoodsAttributeValues)
          checkedGoodsAttributeValues.map((value1, index) => {
            if (value.id == value1['id'] && value1['value'].length != 0) {
              col = {
                title: value.name,
                dataIndex: value.id,
              };
              getColumns.push(col);
              tempCheckedGoodsAttributeValues.push(value1['value']);
            }
          });
        }
      });
    }

    let defaultColumns = [
      {
        title: '市场价',
        dataIndex: 'market_price',
        editable: true,
      },
      {
        title: '成本价',
        dataIndex: 'cost_price',
        editable: true,
      },
      {
        title: '店铺价',
        dataIndex: 'goods_price',
        editable: true,
      },
      {
        title: '库存',
        dataIndex: 'stock_num',
        editable: true,
      },
      {
        title: '商品货号',
        dataIndex: 'goods_sn',
        editable: true,
      },
      {
        title: '商品条形码',
        dataIndex: 'goods_barcode',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'status',
        render: (text, record) =>
        text != 0 ? (
            <Popconfirm title="确定要禁用吗？" onConfirm={() => this.handleChangeStatus(record.key)}>
              <a>禁用</a>
            </Popconfirm>
          ) : (
            <Popconfirm title="确定要启用吗？" onConfirm={() => this.handleChangeStatus(record.key)}>
              <a>启用</a>
            </Popconfirm>
          ),
      },
    ];

    defaultColumns.map(value => {
      getColumns.push(value);
    });

    let columns = getColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    let dataSource = [];
    let dataSourceLength = 0;

    let descarteValues = this.descartes(tempCheckedGoodsAttributeValues);

    if (descarteValues.length != 0) {
      descarteValues.map(descarteValue => {
        dataSourceLength = dataSourceLength + 1;

        let colValue = [];
        colValue['id'] = dataSourceLength;
        colValue['key'] = dataSourceLength;
        colValue['status'] = 1;

        this.state.goodsSkus.map(goodsSku => {
          if (goodsSku.goods_attribute_info.sort().toString() == descarteValue.sort().toString()) {
            colValue['market_price'] = goodsSku['market_price'];
            colValue['cost_price'] = goodsSku['cost_price'];
            colValue['goods_price'] = goodsSku['goods_price'];
            colValue['stock_num'] = goodsSku['stock_num'];
            colValue['goods_sn'] = goodsSku['goods_sn'];
            colValue['goods_barcode'] = goodsSku['goods_barcode'];
            colValue['status'] = goodsSku['status'];
          }
        });

        if (descarteValue.length != undefined) {
          descarteValue.map(mapDescarteValue => {
            this.state.goodsAttributes.map(goodsAttribute => {
              goodsAttribute.vname.map(vname => {
                if (vname.id == mapDescarteValue) {
                  colValue[goodsAttribute.id] = vname.vname;
                  colValue['goodsAttribute_' + goodsAttribute.id] =
                    'goodsAttribute_id:' +
                    goodsAttribute.id +
                    ';goodsAttribute_name:' +
                    goodsAttribute.name +
                    ';goodsAttribute_value_id:' +
                    vname.id +
                    ';goodsAttribute_value_name:' +
                    vname.vname;
                }
              });
            });
          });
        }

        dataSource.push(colValue);
      });
    } else {
      checkedGoodsAttributeValues.map((descarteValue, index) => {
        if (descarteValue.length != undefined) {
          descarteValue.map(mapDescarteValue => {
            dataSourceLength = dataSourceLength + 1;

            let colValue = [];
            colValue['id'] = dataSourceLength;
            colValue['key'] = dataSourceLength;
            colValue['status'] = 1;
            this.state.goodsSkus.map(goodsSku => {
              console.log(
                goodsSku.goods_attribute_info.sort().toString() +
                  '==' +
                  descarteValue.sort().toString(),
              );
              if (
                goodsSku.goods_attribute_info.sort().toString() == descarteValue.sort().toString()
              ) {
                colValue['market_price'] = goodsSku['market_price'];
                colValue['cost_price'] = goodsSku['cost_price'];
                colValue['goods_price'] = goodsSku['goods_price'];
                colValue['stock_num'] = goodsSku['stock_num'];
                colValue['goods_sn'] = goodsSku['goods_sn'];
                colValue['goods_barcode'] = goodsSku['goods_barcode'];
                colValue['status'] = goodsSku['status'];
              }
            });

            this.state.goodsAttributes.map(goodsAttribute => {
              goodsAttribute.vname.map(vname => {
                if (vname.id == mapDescarteValue) {
                  colValue[goodsAttribute.id] = vname.vname;
                  dataSource.push(colValue);
                }
              });
            });
          });
        }
      });
    }

    this.setState({
      dataSource: dataSource,
      columns: columns,
      checkedGoodsAttributeValues: checkedGoodsAttributeValues,
    });
  };

  initGoodsAttributeValue = () => {
    let checkedGoodsAttributeValues = this.state.data.checkedGoodsAttributeValues;

    let getColumns = [];

    let col = {
      title: 'ID',
      dataIndex: 'id',
    };
    getColumns.push(col);

    let tempCheckedGoodsAttributeValues = [];

    if (this.state.checkedGoodsAttributes) {
      this.state.goodsAttributes.map(value => {
        if (this.state.checkedGoodsAttributes.indexOf(value.id) != -1) {
          checkedGoodsAttributeValues.map((value1, index) => {
            if (value.id == value1['id'] && value1['value'].length != 0) {
              col = {
                title: value.name,
                dataIndex: value.id,
              };
              getColumns.push(col);
              tempCheckedGoodsAttributeValues.push(value1['value']);
            }
          });
        }
      });
    }

    let defaultColumns = [
      {
        title: '市场价',
        dataIndex: 'market_price',
        editable: true,
      },
      {
        title: '成本价',
        dataIndex: 'cost_price',
        editable: true,
      },
      {
        title: '店铺价',
        dataIndex: 'goods_price',
        editable: true,
      },
      {
        title: '库存',
        dataIndex: 'stock_num',
        editable: true,
      },
      {
        title: '商品货号',
        dataIndex: 'goods_sn',
        editable: true,
      },
      {
        title: '商品条形码',
        dataIndex: 'goods_barcode',
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'status',
        render: (text, record) =>
        text != 0 ? (
            <Popconfirm title="确定要禁用吗？" onConfirm={() => this.handleChangeStatus(record.key)}>
              <a>禁用</a>
            </Popconfirm>
          ) : (
            <Popconfirm title="确定要启用吗？" onConfirm={() => this.handleChangeStatus(record.key)}>
              <a>启用</a>
            </Popconfirm>
          ),
      },
    ];

    defaultColumns.map(value => {
      getColumns.push(value);
    });

    let columns = getColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    let dataSource = [];
    let dataSourceLength = 0;

    let descarteValues = this.descartes(tempCheckedGoodsAttributeValues);

    if (descarteValues.length != 0) {
      descarteValues.map(descarteValue => {
        dataSourceLength = dataSourceLength + 1;

        let colValue = [];
        colValue['id'] = dataSourceLength;
        colValue['key'] = dataSourceLength;
        this.state.goodsSkus.map(goodsSku => {
          if (goodsSku.goods_attribute_info.sort().toString() == descarteValue.sort().toString()) {
            colValue['market_price'] = goodsSku['market_price'];
            colValue['cost_price'] = goodsSku['cost_price'];
            colValue['goods_price'] = goodsSku['goods_price'];
            colValue['stock_num'] = goodsSku['stock_num'];
            colValue['goods_sn'] = goodsSku['goods_sn'];
            colValue['goods_barcode'] = goodsSku['goods_barcode'];
            colValue['status'] = goodsSku['status'];
          }
        });

        if (descarteValue.length != undefined) {
          descarteValue.map(mapDescarteValue => {
            this.state.goodsAttributes.map(goodsAttribute => {
              goodsAttribute.vname.map(vname => {
                if (vname.id == mapDescarteValue) {
                  colValue[goodsAttribute.id] = vname.vname;
                  colValue['goodsAttribute_' + goodsAttribute.id] =
                    'goodsAttribute_id:' +
                    goodsAttribute.id +
                    ';goodsAttribute_name:' +
                    goodsAttribute.name +
                    ';goodsAttribute_value_id:' +
                    vname.id +
                    ';goodsAttribute_value_name:' +
                    vname.vname;
                }
              });
            });
          });
        }

        dataSource.push(colValue);
      });
    } else {
      checkedGoodsAttributeValues.map((descarteValue, index) => {
        if (descarteValue.length != undefined) {
          descarteValue.map(mapDescarteValue => {
            dataSourceLength = dataSourceLength + 1;

            let colValue = [];
            colValue['id'] = dataSourceLength;
            colValue['key'] = dataSourceLength;

            this.state.goodsSkus.map(goodsSku => {
              console.log(
                goodsSku.goods_attribute_info.sort().toString() +
                  '==' +
                  descarteValue.sort().toString(),
              );
              if (
                goodsSku.goods_attribute_info.sort().toString() == descarteValue.sort().toString()
              ) {
                colValue['market_price'] = goodsSku['market_price'];
                colValue['cost_price'] = goodsSku['cost_price'];
                colValue['goods_price'] = goodsSku['goods_price'];
                colValue['stock_num'] = goodsSku['stock_num'];
                colValue['goods_sn'] = goodsSku['goods_sn'];
                colValue['goods_barcode'] = goodsSku['goods_barcode'];
                colValue['status'] = goodsSku['status'];
              }
            });

            this.state.goodsAttributes.map(goodsAttribute => {
              goodsAttribute.vname.map(vname => {
                if (vname.id == mapDescarteValue) {
                  colValue[goodsAttribute.id] = vname.vname;
                  dataSource.push(colValue);
                }
              });
            });
          });
        }
      });
    }

    this.setState({
      dataSource: dataSource,
      columns: columns,
      checkedGoodsAttributeValues: checkedGoodsAttributeValues,
    });
  };

  descartes = array => {
    let i = 0;
    array.map(value => {
      if (value && value.length > 0) {
        i = i + 1;
      }
    });

    if (i < 2) return [];

    return [].reduce.call(array, function(col, set) {
      var res = [];
      col.forEach(function(c) {
        set.forEach(function(s) {
          var t = [].concat(Array.isArray(c) ? c : [c]);
          t.push(s);
          res.push(t);
        });
      });
      return res;
    });
  };

  // todo
  getCheckedGoodsAttributeValues = goodsAttributeId => {
    var getCheckedGoodsAttributeValue = undefined;
    if(this.state.checkedGoodsAttributeValues) {
      this.state.checkedGoodsAttributeValues.map(checkedGoodsAttributeValue => {
        if (checkedGoodsAttributeValue['id'] == goodsAttributeId) {
          getCheckedGoodsAttributeValue = checkedGoodsAttributeValue['value'];
        }
      });
    }

    return getCheckedGoodsAttributeValue;
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

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };

    const attrFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };

    const goodsAttributeFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 },
      },
    };
    getFieldDecorator('keys', { initialValue: this.state.keys });

    const keys = getFieldValue('keys');

    const formItems = keys.map((k, index) => (
      <Form.Item {...formItemLayoutWithOutLabel} required={false} key={k}>
        {getFieldDecorator(`shop_goods_attribute_names[${k}]`, {
          initialValue: this.state.shopGoodsAttributes[k]
            ? this.state.shopGoodsAttributes[k]['attribute_name']
            : '',
        })(<Input placeholder="属性名" style={{ width: '100px', marginRight: 8 }} />)}
        :
        {getFieldDecorator(`shop_goods_attribute_values[${k}]`, {
          initialValue: this.state.shopGoodsAttributes[k]
            ? this.state.shopGoodsAttributes[k]['attribute_value']
            : '',
        })(
          <Input
            placeholder="属性值，多个值间用英文逗号分割"
            style={{ width: '400px', marginLeft: 8, marginRight: 8 }}
          />,
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

    const handleEditorUpload = param => {
      const serverURL = '/api/admin/picture/upload';
      const xhr = new XMLHttpRequest();
      const fd = new FormData();

      const successFn = response => {
        // 假设服务端直接返回文件上传后的地址
        // 上传成功后调用param.success并传入上传后的文件地址

        const responseObj = JSON.parse(xhr.responseText);

        if (responseObj.status === 'success') {
          param.success({
            url: responseObj.data.url,
            meta: {
              id: responseObj.data.id,
              title: responseObj.data.title,
              alt: responseObj.data.title,
              loop: true, // 指定音视频是否循环播放
              autoPlay: true, // 指定音视频是否自动播放
              controls: true, // 指定音视频是否显示控制栏
              poster: responseObj.data.url, // 指定视频播放器的封面
            },
          });
        } else {
          // 上传发生错误时调用param.error
          param.error({
            msg: responseObj.msg,
          });
        }
      };

      const progressFn = event => {
        // 上传进度发生变化时调用param.progress
        param.progress((event.loaded / event.total) * 100);
      };

      const errorFn = response => {
        // 上传发生错误时调用param.error
        param.error({
          msg: 'unable to upload.',
        });
      };

      xhr.upload.addEventListener('progress', progressFn, false);
      xhr.addEventListener('load', successFn, false);
      xhr.addEventListener('error', errorFn, false);
      xhr.addEventListener('abort', errorFn, false);

      fd.append('file', param.file);
      xhr.open('POST', serverURL, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage['token']);
      xhr.send(fd);
    };

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const tabOnChange = key => {
      if (key == 2) {
        router.push('/mall/goods/imageEdit?id=' + this.state.data.id);
      }
    };

    return (
      <PageHeaderWrapper title={false}>
        <div style={{ background: '#fff' }}>
          <Tabs
            defaultActiveKey="1"
            onChange={tabOnChange}
            tabBarExtraContent={
              <a href="javascript:history.go(-1)">返回上一页&nbsp;&nbsp;&nbsp;&nbsp;</a>
            }
          >
            <TabPane tab="编辑商品" key="1">
              <Spin spinning={this.state.loading} tip="Loading...">
                <div className="steps-content" style={{ width: '100%', margin: '40px auto' }}>
                  <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
                    <Form.Item {...formItemLayout} label="所属商家">
                      {getFieldDecorator('shop_id', {
                        initialValue: this.state.data.shop_id
                          ? this.state.data.shop_id.toString()
                          : undefined,
                      })(
                        <Select
                          placeholder="请选择所属商家"
                          style={{ width: 400 }}
                          onChange={this.onShopChange}
                        >
                          {!!this.state.data.shops &&
                            this.state.data.shops.map(option => {
                              return <Option key={option.id.toString()}>{option.title}</Option>;
                            })}
                        </Select>,
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品分类">
                      {getFieldDecorator('goods_category_id', {
                        initialValue: this.state.data.goods_category_id
                          ? this.state.data.goods_category_id
                          : undefined,
                      })(
                        <Cascader
                          style={{ width: 400 }}
                          options={this.state.data.categorys}
                          placeholder="请选择商品分类"
                          onChange={this.onCategoryChange}
                        />,
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品类别">
                      {getFieldDecorator('goods_mode', {
                        initialValue: this.state.data.goods_mode
                          ? this.state.data.goods_mode.toString()
                          : undefined,
                      })(
                        <Radio.Group onChange={this.onGoodsModeChange}>
                          <Radio value={'1'} disabled={true}>
                            实物商品（物流发货）
                          </Radio>
                          <Radio value={'2'} disabled={true}>
                            电子卡券（无需物流）
                          </Radio>
                          <Radio value={'3'} disabled={true}>
                            服务商品（无需物流）
                          </Radio>
                        </Radio.Group>,
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="扩展分类">
                      {getFieldDecorator('other_category_ids', {
                        initialValue: this.state.data.other_category_ids
                          ? this.state.data.other_category_ids
                          : undefined,
                      })(
                        <TreeSelect
                          treeData={this.state.data.categorys}
                          showSearch
                          style={{ width: 400 }}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="请选择扩展分类"
                          allowClear
                          multiple
                          treeDefaultExpandAll
                        ></TreeSelect>,
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品名称">
                      {getFieldDecorator('goods_name', {
                        initialValue: this.state.data.goods_name,
                      })(<Input style={{ width: 400 }} placeholder="请输入规格名称" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="关键词">
                      {getFieldDecorator('keywords', {
                        initialValue: this.state.data.keywords,
                      })(<Input style={{ width: 400 }} placeholder="请输入关键词" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品买点">
                      {getFieldDecorator('description', {
                        initialValue: this.state.data.description,
                      })(
                        <TextArea
                          style={{ width: 400 }}
                          placeholder="请输入商品买点"
                          autosize={{ minRows: 3, maxRows: 5 }}
                        />,
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="计价方式">
                      {getFieldDecorator('pricing_mode', {
                        initialValue: this.state.data.pricing_mode
                          ? this.state.data.pricing_mode.toString()
                          : undefined,
                      })(
                        <Radio.Group>
                          <Radio value={'1'}>计件</Radio>
                          <Radio value={'2'}>计重</Radio>
                        </Radio.Group>,
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品单位">
                      {getFieldDecorator('goods_unit_id', {
                        initialValue: this.state.data.goods_unit_id
                          ? this.state.data.goods_unit_id.toString()
                          : undefined,
                      })(
                        <Select placeholder="请选择商品单位" style={{ width: 200 }}>
                          {!!this.state.data.goodsUnits &&
                            this.state.data.goodsUnits.map(option => {
                              return <Option key={option.id.toString()}>{option.name}</Option>;
                            })}
                        </Select>,
                      )}
                      &nbsp;&nbsp;
                      <Button href="#/admin/mall/goods/unitCreate" target="_blank" type="primary">
                        新建商品单位
                      </Button>
                      &nbsp;&nbsp;
                      <Button onClick={this.reload} loading={this.state.unitLoading}>
                        重新加载
                      </Button>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品品牌">
                      {getFieldDecorator('goods_brand_id', {
                        initialValue: this.state.data.goods_brand_id
                          ? this.state.data.goods_brand_id.toString()
                          : undefined,
                      })(
                        <Select placeholder="请选择商品品牌" style={{ width: 200 }}>
                          {!!this.state.data.goodsBrands &&
                            this.state.data.goodsBrands.map(option => {
                              return <Option key={option.id.toString()}>{option.name}</Option>;
                            })}
                        </Select>,
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品属性">
                      <div
                        style={{
                          background: 'rgba(93,178,255,.1)',
                          border: '1px solid #bce8f1',
                          borderRadius: '2px',
                          padding: '10px',
                        }}
                      >
                        {this.state.systemGoodsAttributes ? (
                          <div
                            style={{
                              width: '100%',
                              borderBottom: 'solid 1px #22baa0',
                              lineHeight: '30px',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '0px 10px',
                                background: '#22baa0',
                                color: '#fff',
                                fontSize: '13px',
                                fontWeight: '700',
                                lineHeight: '30px',
                              }}
                            >
                              平台系统属性
                            </span>
                          </div>
                        ) : null}

                        <div style={{ marginTop: '20px' }}>
                          {!!this.state.systemGoodsAttributes &&
                            this.state.systemGoodsAttributes.map(systemGoodsAttribute => {
                              if (systemGoodsAttribute.style == 1) {
                                // 多选
                                return (
                                  <Form.Item
                                    {...attrFormItemLayout}
                                    label={systemGoodsAttribute.name}
                                  >
                                    {getFieldDecorator(
                                      'system_goods_attribute_' + systemGoodsAttribute.id,
                                      {
                                        initialValue: systemGoodsAttribute.goods_attribute_value_id,
                                      },
                                    )(
                                      <Checkbox.Group>
                                        {!!systemGoodsAttribute.vname &&
                                          systemGoodsAttribute.vname.map(option => {
                                            return (
                                              <Checkbox value={option.id}>{option.vname}</Checkbox>
                                            );
                                          })}
                                      </Checkbox.Group>,
                                    )}
                                  </Form.Item>
                                );
                              }

                              if (systemGoodsAttribute.style == 2) {
                                // 单选
                                return (
                                  <Form.Item
                                    {...attrFormItemLayout}
                                    label={systemGoodsAttribute.name}
                                  >
                                    {getFieldDecorator(
                                      'system_goods_attribute_' + systemGoodsAttribute.id,
                                      {
                                        initialValue: systemGoodsAttribute.goods_attribute_value_id,
                                      },
                                    )(
                                      <Select style={{ width: 200 }}>
                                        {!!systemGoodsAttribute.vname &&
                                          systemGoodsAttribute.vname.map(option => {
                                            return (
                                              <Option value={option.id}>{option.vname}</Option>
                                            );
                                          })}
                                      </Select>,
                                    )}
                                  </Form.Item>
                                );
                              }

                              if (systemGoodsAttribute.style == 3) {
                                // 输入框
                                return (
                                  <Form.Item
                                    {...attrFormItemLayout}
                                    label={systemGoodsAttribute.name}
                                  >
                                    {getFieldDecorator(
                                      'system_goods_attribute_' + systemGoodsAttribute.id,
                                      {
                                        initialValue: systemGoodsAttribute.goods_attribute_value_id,
                                      },
                                    )(<Input style={{ width: 200 }} />)}
                                  </Form.Item>
                                );
                              }
                            })}
                        </div>

                        <div
                          style={{
                            width: '100%',
                            borderBottom: 'solid 1px #22baa0',
                            lineHeight: '30px',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0px 10px',
                              background: '#22baa0',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '700',
                              lineHeight: '30px',
                            }}
                          >
                            店铺自定义属性
                          </span>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                          {formItems}
                          <Button type="primary" icon="plus" onClick={this.add}>
                            添加自定义属性
                          </Button>
                        </div>
                      </div>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品规格">
                      <div
                        style={{
                          background: 'rgba(93,178,255,.1)',
                          border: '1px solid #bce8f1',
                          borderRadius: '2px',
                          padding: '10px',
                        }}
                      >
                        {this.state.goodsAttributes ? (
                          <div style={{ marginTop: '20px' }}>
                            <Form.Item {...goodsAttributeFormItemLayout} label="选择规格">
                              {getFieldDecorator('goodsAttribute', {
                                initialValue: this.state.checkedGoodsAttributes
                                  ? this.state.checkedGoodsAttributes
                                  : undefined,
                              })(
                                <Checkbox.Group onChange={this.onGoodsAttributeChange}>
                                  {!!this.state.goodsAttributes &&
                                    this.state.goodsAttributes.map(goodsAttribute => {
                                      // 多选
                                      return (
                                        <Checkbox value={goodsAttribute.id}>
                                          {goodsAttribute.name}
                                        </Checkbox>
                                      );
                                    })}
                                </Checkbox.Group>,
                              )}
                            </Form.Item>
                          </div>
                        ) : null}

                        <div style={{ marginTop: '20px' }}>
                          {!!this.state.goodsAttributes &&
                            this.state.goodsAttributes.map(goodsAttribute => {
                              // 多选
                              if (
                                this.state.checkedGoodsAttributes.indexOf(goodsAttribute.id) != -1
                              ) {
                                return (
                                  <Form.Item {...attrFormItemLayout} label={goodsAttribute.name}>
                                    {getFieldDecorator('goodsAttribute' + goodsAttribute.id, {
                                      initialValue: this.getCheckedGoodsAttributeValues(
                                        goodsAttribute.id,
                                      ),
                                    })(
                                      <Checkbox.Group
                                        onChange={value =>
                                          this.onGoodsAttributeValueChange(value, goodsAttribute.id)
                                        }
                                      >
                                        {!!goodsAttribute.vname &&
                                          goodsAttribute.vname.map(option => {
                                            return (
                                              <Checkbox value={option.id}>{option.vname}</Checkbox>
                                            );
                                          })}
                                      </Checkbox.Group>,
                                    )}
                                  </Form.Item>
                                );
                              }
                            })}
                        </div>

                        {this.state.dataSource ? (
                          <div style={{ marginTop: '20px', background: '#fff' }}>
                            <Table
                              components={components}
                              rowClassName={styles.editableRow}
                              bordered
                              dataSource={this.state.dataSource}
                              columns={this.state.columns}
                              pagination={false}
                            />
                          </div>
                        ) : null}
                      </div>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="最小起订量">
                      {getFieldDecorator('goods_moq', {
                        initialValue: this.state.data.goods_moq,
                      })(<InputNumber style={{ width: 200 }} placeholder="最小起订量" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="店铺价">
                      {getFieldDecorator('goods_price', {
                        initialValue: this.state.data.goods_price,
                      })(
                        <InputNumber
                          step={0.01}
                          style={{ width: 200 }}
                          placeholder="请输入店铺价"
                        />,
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="市场价">
                      {getFieldDecorator('market_price', {
                        initialValue: this.state.data.market_price,
                      })(
                        <InputNumber
                          step={0.01}
                          style={{ width: 200 }}
                          placeholder="请输入市场价"
                        />,
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="成本价">
                      {getFieldDecorator('cost_price', {
                        initialValue: this.state.data.cost_price,
                      })(
                        <InputNumber
                          step={0.01}
                          style={{ width: 200 }}
                          placeholder="请输入成本价"
                        />,
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品库存">
                      {getFieldDecorator('stock_num', {
                        initialValue: this.state.data.stock_num,
                      })(<InputNumber style={{ width: 200 }} placeholder="请输入商品库存" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="库存警告数量">
                      {getFieldDecorator('warn_num', {
                        initialValue: this.state.data.warn_num,
                      })(<InputNumber style={{ width: 200 }} placeholder="请输入库存警告数量" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品货号">
                      {getFieldDecorator('goods_sn', {
                        initialValue: this.state.data.goods_sn,
                      })(<Input style={{ width: 400 }} placeholder="请输入商品货号" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品条形码">
                      {getFieldDecorator('goods_barcode', {
                        initialValue: this.state.data.goods_barcode,
                      })(<Input style={{ width: 400 }} placeholder="请输入商品条形码" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品库位码">
                      {getFieldDecorator('goods_stockcode', {
                        initialValue: this.state.data.goods_stockcode,
                      })(<Input style={{ width: 400 }} placeholder="请输入商品库位码" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品主图">
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
                              this.setState({ coverId: fileList });
                            } else {
                              message.error(info.file.response.msg);
                            }
                          }
                        }}
                      >
                        {this.state.coverId ? (
                          <img src={this.state.coverId[0]['url']} alt="avatar" width={80} />
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="主图视频">
                      <Upload
                        name={'file'}
                        fileList={this.state.fileId}
                        multiple={false}
                        action={'/api/admin/file/upload'}
                        headers={{ authorization: 'Bearer ' + sessionStorage['token'] }}
                        beforeUpload={file => {
                          let canUpload = false;
                          let limitType = [
                            'video/x-flv',
                            'video/mp4',
                            'video/x-msvideo',
                            'video/webm',
                            'video/mpeg',
                            'video/ogg',
                          ];
                          for (var i = 0; i < limitType.length; i++) {
                            if (limitType[i] == file.type) {
                              canUpload = true;
                            }
                          }
                          if (!canUpload) {
                            message.error('请上传正确格式的文件!');
                            return false;
                          }
                          const isLtSize = file.size / 1024 / 1024 < 200;
                          if (!isLtSize) {
                            message.error('文件大小不可超过' + 200 + 'MB!');
                            return false;
                          }
                          return true;
                        }}
                        onChange={info => {
                          let fileList = info.fileList;
                          fileList = fileList.slice(-1);
                          fileList = fileList.map(file => {
                            if (file.response) {
                              if (file.response.status === 'success') {
                                file.url = file.response.data.url;
                                file.uid = file.response.data.id;
                                file.id = file.response.data.id;
                              }
                            }
                            return file;
                          });

                          fileList = fileList.filter(file => {
                            if (file.response) {
                              return file.response.status === 'success';
                            }
                            return true;
                          });

                          fileList[0] = info.file;
                          this.setState({ fileId: fileList });
                        }}
                      >
                        <Button>
                          <Icon type="upload" /> 上传视频
                        </Button>
                      </Upload>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品内容">
                      <Tabs defaultActiveKey="1">
                        <TabPane tab="电脑端" key="1">
                          <div style={{ border: '1px solid #ccc;' }}>
                            {getFieldDecorator('pc_content', {
                              initialValue: BraftEditor.createEditorState(
                                this.state.data.pc_content,
                              ),
                            })(
                              <BraftEditor
                                contentStyle={{
                                  height: 400,
                                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)',
                                }}
                                media={{ uploadFn: handleEditorUpload }}
                              />,
                            )}
                          </div>
                        </TabPane>
                        <TabPane tab="手机端" key="2">
                          <div style={{ border: '1px solid #ccc;' }}>
                            {getFieldDecorator('mobile_content', {
                              initialValue: BraftEditor.createEditorState(
                                this.state.data.mobile_content,
                              ),
                            })(
                              <BraftEditor
                                contentStyle={{
                                  height: 400,
                                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)',
                                }}
                                media={{ uploadFn: handleEditorUpload }}
                              />,
                            )}
                          </div>
                        </TabPane>
                      </Tabs>
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="详情版式">
                      顶部模板&nbsp;
                      {getFieldDecorator('top_layout_id', {
                        initialValue: this.state.data.top_layout_id
                          ? this.state.data.top_layout_id.toString()
                          : '0',
                      })(
                        <Select placeholder="请选择顶部模板" style={{ width: 200 }}>
                          <Option key="0">不使用</Option>
                          {!!this.state.data.topLayouts &&
                            this.state.data.topLayouts.map(option => {
                              return (
                                <Option key={option.id.toString()}>{option.layout_name}</Option>
                              );
                            })}
                        </Select>,
                      )}
                      &nbsp;&nbsp; 底部模板&nbsp;
                      {getFieldDecorator('bottom_layout_id', {
                        initialValue: this.state.data.bottom_layout_id
                          ? this.state.data.bottom_layout_id.toString()
                          : '0',
                      })(
                        <Select placeholder="请选择底部模板" style={{ width: 200 }}>
                          <Option key="0">不使用</Option>
                          {!!this.state.data.bottomLayouts &&
                            this.state.data.bottomLayouts.map(option => {
                              return (
                                <Option key={option.id.toString()}>{option.layout_name}</Option>
                              );
                            })}
                        </Select>,
                      )}
                      <br></br>
                      包装清单版式&nbsp;
                      {getFieldDecorator('packing_layout_id', {
                        initialValue: this.state.data.packing_layout_id
                          ? this.state.data.packing_layout_id.toString()
                          : '0',
                      })(
                        <Select placeholder="请选择包装清单版式" style={{ width: 200 }}>
                          <Option key="0">不使用</Option>
                          {!!this.state.data.packingLayouts &&
                            this.state.data.packingLayouts.map(option => {
                              return (
                                <Option key={option.id.toString()}>{option.layout_name}</Option>
                              );
                            })}
                        </Select>,
                      )}
                      &nbsp;&nbsp; 售后保障版式&nbsp;
                      {getFieldDecorator('service_layout_id', {
                        initialValue: this.state.data.service_layout_id
                          ? this.state.data.service_layout_id.toString()
                          : '0',
                      })(
                        <Select placeholder="请选择售后保障版式" style={{ width: 200 }}>
                          <Option key="0">不使用</Option>
                          {!!this.state.data.serviceLayouts &&
                            this.state.data.serviceLayouts.map(option => {
                              return (
                                <Option key={option.id.toString()}>{option.layout_name}</Option>
                              );
                            })}
                        </Select>,
                      )}
                      <br></br>
                      <Button href="#/admin/mall/goods/layoutCreate" target="_blank" type="primary">
                        新建详情版式
                      </Button>
                      &nbsp;&nbsp;
                      <Button onClick={this.reload} loading={this.state.layoutLoading}>
                        重新加载
                      </Button>
                    </Form.Item>
                    <span style={{ display: this.state.showFreightInfo ? 'block' : 'none' }}>
                      <Form.Item {...formItemLayout} label="物流重量(Kg)">
                        {getFieldDecorator('goods_weight', {
                          initialValue: this.state.data.goods_weight,
                        })(<InputNumber style={{ width: 200 }} placeholder="物流重量" />)}
                        &nbsp;Kg
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="物流体积(m³)">
                        {getFieldDecorator('goods_volume', {
                          initialValue: this.state.data.goods_volume,
                        })(<InputNumber style={{ width: 200 }} placeholder="物流体积" />)}
                        &nbsp;m³
                      </Form.Item>
                    </span>
                    <span style={{ display: this.state.showSpecialInfo ? 'block' : 'none' }}>
                      <Form.Item {...formItemLayout} label="兑换生效期">
                        {getFieldDecorator('effective_type', {
                          initialValue: this.state.data.effective_type
                            ? this.state.data.effective_type.toString()
                            : undefined,
                        })(
                          <Radio.Group>
                            <Radio value={'1'}>付款完成立即生效</Radio>
                            <br></br>
                            <Radio value={'2'}>付款完成</Radio>
                            {getFieldDecorator('effective_hour', {
                              initialValue: this.state.data.effective_hour,
                            })(<InputNumber style={{ width: 60 }} />)}
                            &nbsp;&nbsp; 小时后生效<br></br>
                            <Radio value={'3'}>付款完成次日生效</Radio>
                          </Radio.Group>,
                        )}
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="使用有效期">
                        {getFieldDecorator('valid_period_type', {
                          initialValue: this.state.data.valid_period_type
                            ? this.state.data.valid_period_type.toString()
                            : undefined,
                        })(
                          <Radio.Group>
                            <Radio value={'1'}>长期有效</Radio>
                            <br></br>
                            <Radio value={'2'}>日期范围内有效</Radio>
                            {getFieldDecorator('add_time', {
                              initialValue: [
                                !!this.state.data.add_time_begin &&
                                  moment(this.state.data.add_time_begin, 'YYYY-MM-DD HH:mm:ss'),
                                !!this.state.data.add_time_end &&
                                  moment(this.state.data.add_time_end, 'YYYY-MM-DD HH:mm:ss'),
                              ],
                            })(
                              <RangePicker
                                showTime={{
                                  hideDisabledOptions: true,
                                  defaultValue: [
                                    moment('00:00:00', 'HH:mm:ss'),
                                    moment('23:59:59', 'HH:mm:ss'),
                                  ],
                                }}
                                format="YYYY-MM-DD HH:mm:ss"
                              />,
                            )}
                            <br></br>
                            <Radio value={'3'}> 自购买之日起，</Radio>
                            {getFieldDecorator('valid_period_hour', {
                              initialValue: this.state.data.valid_period_hour,
                            })(<InputNumber style={{ width: 60 }} />)}
                            &nbsp;&nbsp; 小时内有效<br></br>
                            <Radio value={'4'}> 自购买之日起，</Radio>
                            {getFieldDecorator('valid_period_day', {
                              initialValue: this.state.data.valid_period_day,
                            })(<InputNumber style={{ width: 60 }} />)}
                            &nbsp;&nbsp; 天内有效
                          </Radio.Group>,
                        )}
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="支持过期退款">
                        {getFieldDecorator('is_expired_refund', {
                          initialValue: this.state.data.is_expired_refund,
                          valuePropName: 'checked',
                        })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
                      </Form.Item>
                    </span>
                    <Form.Item {...formItemLayout} label="排序">
                      {getFieldDecorator('sort', {
                        initialValue: this.state.data.sort,
                      })(<InputNumber style={{ width: 200 }} placeholder="排序" />)}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="库存计数"
                      help="①拍下减库存：买家拍下商品即减少库存，存在恶拍风险。热销商品如需避免超卖可选此方式
  ②付款减库存：买家拍下并完成付款方可减少库存，存在超卖风险。如需减少恶拍、提高回款效率，可选此方式；货到付款时将在卖家确认订单时减库存
  ③出库减库存：卖家发货时减库存，如果库存充实，需要确保线上库存与线下库存保持一致，可选此方式"
                    >
                      {getFieldDecorator('pricing_mode', {
                        initialValue: this.state.data.pricing_mode
                          ? this.state.data.pricing_mode.toString()
                          : undefined,
                      })(
                        <Radio.Group>
                          <Radio value={'1'}>拍下减库存</Radio>
                          <Radio value={'2'}>付款减库存</Radio>
                          <Radio value={'3'}>出库减库存</Radio>
                        </Radio.Group>,
                      )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="状态">
                      {getFieldDecorator('status', {
                        initialValue: this.state.data.status,
                        valuePropName: 'checked',
                      })(<Switch checkedChildren="出售中" unCheckedChildren="已下架" />)}
                    </Form.Item>

                    <Affix offsetBottom={10}>
                      <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
                        <Button href="#/admin/mall/goods/index">返回商品列表</Button>
                        &nbsp;&nbsp;
                        <Button type="primary" htmlType="submit">
                          确认提交
                        </Button>
                      </Form.Item>
                    </Affix>
                  </Form>
                </div>
              </Spin>
            </TabPane>
            <TabPane tab="编辑图片" key="2"></TabPane>
          </Tabs>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CreatePage;
