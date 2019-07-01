import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { Effect,Subscription } from 'dva';
import { message } from 'antd';
import { 
  index,
  destroy,
  changeStatus,
  create,
  edit,
  submit,
} from '@/services/builder';

export interface ModelType {
  namespace: string;
  state: {};
  subscriptions:{ setup: Subscription };
  effects: {
    index: Effect;
    destroy: Effect;
    changeStatus: Effect;
    create: Effect;
    edit: Effect;
    submit: Effect;
    modalCreate: Effect;
    modalEdit: Effect;
    modalSubmit: Effect;
    myPublished: Effect;
  };
  reducers: {
    updateState: Reducer<{}>;
  };
}

const Builder: ModelType = {
  namespace: 'builder',

  state: {
    msg: '',
    url: '',
    data: [],
    pagination: [],
    status: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        //打开页面时，进行操作
        console.log('subscriptions');
      });
    },
  },

  effects: {
    *index({ payload, callback }, { put, call }) {
      const response = yield call(index, payload);
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
    *destroy({ type, payload }, { put, call, select }) {
      const response = yield call(destroy, payload);
      // 操作成功
      if (response.status === 'success') {
        // 提示信息
        message.success(response.msg, 3);
      } else {
        message.error(response.msg, 3);
      }
    },
    *changeStatus({ payload, callback }, { put, call, select }) {
      const response = yield call(changeStatus, payload);
      // 操作成功
      if (response.status === 'success') {
        // 提示信息
        message.success(response.msg, 3);

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
    *create({ payload, callback }, { put, call, select }) {
      const response = yield call(create, payload);
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
    *edit({ payload, callback }, { put, call, select }) {
      const response = yield call(edit, payload);
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
    *submit({ type, payload }, { put, call, select }) {
      const response = yield call(submit, payload);
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
    // 弹窗创建数据
    *modalCreate({ payload, callback }, { put, call, select }) {
      const response = yield call(create, payload);
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
    // 弹窗编辑数据
    *modalEdit({ payload, callback }, { put, call, select }) {
      const response = yield call(edit, payload);
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
    // 弹窗保存编辑数据
    *modalSubmit({ type, payload }, { put, call, select }) {
      const response = yield call(submit, payload);
      // 操作成功
      if (response.status === 'success') {
        // 提示信息
        message.success(response.msg, 3);
      } else {
        message.error(response.msg, 3);
      }
    },

    *myPublished({ payload, callback }, { put, call }) {
      const response = yield call(myPublished, payload);
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
