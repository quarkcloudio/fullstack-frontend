import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { Effect,Subscription } from 'dva';
import { message } from 'antd';
import { 
  getListInfo,
  formSubmit,
} from '@/services/builder';

export interface BasicListModelState {
  pageRandom:string;
  previewImage:string;
  previewVisible:boolean;
  pageTitle:string;
  table: [];
  headerButtons: [];
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
    getListInfo: Effect;
    formSubmit: Effect;
  };
  reducers: {
    updateState: Reducer<{}>;
    previewImage: Reducer<{}>;
  };
}

const BasicList: ModelType = {

  namespace: 'basicList',

  state: {
    pageRandom:null,
    previewImage:'',
    previewVisible:false,
    pageTitle:'',
    table: [],
    headerButtons: [],
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
    *getListInfo({ payload, callback }, { put, call, select }) {
      const response = yield call(getListInfo, payload);
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
  },

  reducers: {
    updateState(state, action) {
      return {
        ...action.payload,
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

export default BasicList;
