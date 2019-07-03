import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { Effect,Subscription } from 'dva';
import { message } from 'antd';
import { 
  getFormInfo,
  formSubmit,
} from '@/services/builder';

export interface BuilderModelState {
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
  };
  reducers: {
    updateState: Reducer<{}>;
  };
}

const Builder: ModelType = {

  namespace: 'builder',

  state: {},

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
  },

  reducers: {
    updateState(state, action) {
      return {
        ...action.payload,
      };
    },
  },
};

export default Builder;
