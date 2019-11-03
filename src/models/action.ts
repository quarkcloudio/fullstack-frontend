import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { Effect,Subscription } from 'dva';
import { message } from 'antd';
import {
  get,
  post,
} from '@/services/action';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    get: Effect;
    post: Effect;
  };
  reducers: {
    updateState: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'action',

  state: {
    msg: '',
    url: '',
    data: [],
    status: '',
  },

  effects: {
    *get({ payload, callback }, { put, call }) {
      const response = yield call(get, payload);
      if (response.status === 'success') {
        yield put({
          type: 'updateState',
          payload: response,
        });
        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
      }
    },
    *post({ payload, callback }, { put, call, select }) {
      const response = yield call(post, payload);
      // 操作成功
      if (response.status === 'success') {
        // 提示信息
        message.success(response.msg, 3);

        // 页面跳转
        if(response.url) {
          yield put(
            routerRedux.push({
              pathname: response.url,
            }),
          );
        }

        yield put({
          type: 'updateState',
          payload: response,
        });
        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
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

export default Model;
