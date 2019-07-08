import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { Effect,Subscription } from 'dva';
import { message } from 'antd';
import { 
  getFormInfo,
  formSubmit,
} from '@/services/builder';

export interface BasicFormModelState {
  pageTitle:string;
  name:string;
  pageRandom:string;
  previewImage:string;
  previewVisible:boolean;
  formLoading:boolean;
  controls: [];
  labelCol: [];
  wrapperCol: [];
  submitName: string;
  submitType: string;
  submitLayout: string;
  action: string;
}

export interface ModelType {
  namespace: string;
  state: {};
  subscriptions:{ setup: Subscription };
  effects: {
    getFormInfo: Effect;
    formSubmit: Effect;
    updateFileList: Effect;
  };
  reducers: {
    updateState: Reducer<{}>;
    updateList: Reducer<{}>;
    previewImage: Reducer<{}>;
  };
}

const BasicForm: ModelType = {

  namespace: 'basicForm',

  state: {
    pageTitle:'',
    name:'',
    pageRandom:null,
    previewImage:'',
    previewVisible:false,
    formLoading:false,
    controls: [],
    labelCol: [],
    wrapperCol: [],
    submitName: null,
    submitType: null,
    submitLayout: null,
    action: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        //打开页面时
      });
    },
  },

  effects: {
    *getFormInfo({ payload, callback }, { put, call, select }) {
      const response = yield call(getFormInfo, payload);
      if (response.status === 'success') {

        const data = { ...response.data, formLoading:false};

        yield put({
          type: 'updateState',
          payload: data,
        });

        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
      }
    },
    *formSubmit({ type, payload }, { put, call, select }) {
      const response = yield call(formSubmit, payload);
      // 操作成功
      if (response.status === 'success') {
        // 提示信息
        message.success(response.msg, 3);
        // 页面跳转
        yield put(
          routerRedux.push({
            pathname: response.url,
          }),
        );
      } else {
        message.error(response.msg, 3);
      }
    },
    *updateFileList({ payload, callback }, { put, call, select }) {
      yield put({
        type: 'updateList',
        payload: payload,
      });
    },
  },

  reducers: {
    updateState(state, action) {
      return {
        ...action.payload,
      };
    },
    updateList(state, action) {
      state.controls.map((control:any,key:any) => {
        if(control.name == action.payload.controlName) {
          state.controls[key]['list'] = action.payload.fileList;
        }
      })
      state.pageRandom = Math.random();
      return {
        ...state,
      };
    },
    previewImage(state, action) {
      state.previewVisible = action.payload.previewVisible;
      state.previewImage = action.payload.previewImage;
      return {
        ...state,
      };
    },
  },
};

export default BasicForm;
