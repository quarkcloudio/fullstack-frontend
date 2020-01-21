import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { Effect,Subscription } from 'dva';
import router from 'umi/router';
import { message } from 'antd';
import { 
  get,
  post,
} from '@/services/action';

export interface ModelType {
  namespace: string;
  state: {};
  reducers: {
    storeMenus: Reducer<{}>;
  };
  effects: {
    getMenus: Effect;
  };
  subscriptions:{ setup: Subscription };
}

const global : ModelType = {
  namespace: 'global',
  state: {
    menus:[]
  },
  reducers: {
    storeMenus(state, action) {
      return {
        menus:action.payload,
      };
    }
  },
  effects: {
    *getMenus({ payload, callback }, { call, put }) {

      const response = yield call(get, payload);
      if(!response) {
        return false;
      }

      yield put({
        type: 'storeMenus',
        payload: response.data,
      });

      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (!sessionStorage['token'] && pathname !== '/login') {
          router.push('/login');
        }
      });
    },
  },
};

export default global;
