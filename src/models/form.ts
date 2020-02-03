import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { Effect,Subscription } from 'dva';
import router from 'umi/router';
import { message } from 'antd';
import { 
  get,
  post,
} from '@/services/action';

export interface FormModelState {
  title:string;
  loading:boolean;
  controls: [];
}

export interface ModelType {
  namespace: string;
  state: {loading:boolean};
  subscriptions:{ setup: Subscription };
  effects: {
    info: Effect;
    submit: Effect;
  };
  reducers: {
    updateState: Reducer<{}>;
    pageLoading: Reducer<{}>;
    resetState: Reducer<{}>;
  };
}

const form: ModelType = {
  namespace: 'form',
  state: {
    url:'',
    title:'',
    loading:true,
    controls: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {

      });
    },
  },
  effects: {
    *info({ payload, callback }, { put, call, select }) {
      yield put({
        type: 'pageLoading',
        payload: { loading:true},
      });
      const response = yield call(get, payload);
      if(!response) {
        return false;
      }
      if (response.status === 'success') {
        const data = { ...response.data, loading:false};
        yield put({
          type: 'updateState',
          payload: data,
        });
        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
      }
    },
    *submit({ payload, callback }, { put, call, select }) {
      const response = yield call(post, payload);
      if(!response) {
        return false;
      }
      // 操作成功
      if (response.status === 'success') {
        // 提示信息
        message.success(response.msg, 3);
        // 页面跳转
        if(response.url) {
          router.push(response.url);
        }
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
    resetState(state, action) {
      let resetState = {
          title:'',
          loading:true,
          controls: [],
        }
        return {
          ...resetState,
        };
      },
    pageLoading(state, action) {
      state.loading = action.payload.loading;
      return {
        ...state,
      };
    },
  },
};

export default form;
