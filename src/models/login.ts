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
    changeSubmitStatus: Reducer<{}>;
  };
  effects: {
    login: Effect;
    logout: Effect;
  };
  subscriptions:{ setup: Subscription };
}

const login : ModelType = {
  namespace: 'login',
  state: {
    submitting:false
  },
  reducers: {
    changeSubmitStatus(state, action) {
      return {
        submitting:action.payload,
      };
    }
  },
  effects: {
    *login({ payload, callback }, { call, put }) {

      yield put({
        type: 'changeSubmitStatus',
        payload: true,
      });

      const response = yield call(post, payload);
      if(!response) {
        return false;
      }

      // 提示信息
      message.success(response.msg, 3);

      // 操作成功
      if (response.status === 'success') {
        // 记录登录凭据
        sessionStorage.setItem('token', response.token);
        // 跳转到后台
        router.push('/index');
      }

      yield put({
        type: 'changeSubmitStatus',
        payload: false,
      });

      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *logout(_, { put }) {
      // 注销登录凭据
      sessionStorage.removeItem('token');

      if (window.location.pathname !== '/login') {
        // 跳转到登录页面
        router.push('/login');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        // 已登录，跳转到主页
        if (sessionStorage['token'] && pathname == '/login') {
          router.push('/index');
        }
      });
    },
  },
};

export default login;
