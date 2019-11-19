import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { Effect,Subscription } from 'dva';
import { message } from 'antd';
import { 
  get,
  post,
} from '@/services/action';

export interface ListModelState {
  pageTitle:string;
  pageRandom:string;
  pageLoading:boolean;
  tableLoading:boolean;
  headerButtons: [];
  toolbarButtons: [];
  search: [];
  advancedSearch: [];
  advancedSearchExpand:boolean;
  searchValues:[];
  table: [];
  selectedRowKeys:[]
  modalTitle:string;
  modalWidth:string;
  modalFormUrl:string;
  modalVisible:boolean;
}

export interface ModelType {
  namespace: string;
  state: {};
  subscriptions:{ setup: Subscription };
  effects: {
    info: Effect;
    data: Effect;
    submit: Effect;
    changeStatus: Effect;
  };
  reducers: {
    updateState: Reducer<{}>;
    pageLoading: Reducer<{}>;
    tableLoading: Reducer<{}>;
    selectedRowKeys: Reducer<{}>;
    advancedSearchExpand: Reducer<{}>;
    modalVisible: Reducer<{}>;
    resetState: Reducer<{}>;
  };
}

const List: ModelType = {

  namespace: 'list',

  state: {
    pageTitle:'',
    pageRandom:null,
    pageLoading:true,
    tableLoading:true,
    headerButtons: [],
    toolbarButtons: [],
    search: [],
    advancedSearch: false,
    advancedSearchExpand:false,
    searchValues:[],
    table: [],
    selectedRowKeys:[],
    modalTitle:'',
    modalWidth:'',
    modalFormUrl:'',
    modalVisible:false,
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *info({ payload, callback }, { put, call, select }) {
      const data = { pageLoading:true};
      yield put({
        type: 'pageLoading',
        payload: data,
      });

      const response = yield call(get, payload);

      if(!response) {
        return false;
      }

      if (response.status === 'success') {
        const data = { ...response.data, pageLoading:false};
        yield put({
          type: 'updateState',
          payload: data,
        });
        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
      }
    },
    *data({ payload, callback }, { put, call, select }) {
      const data = { tableLoading:true};
      yield put({
        type: 'tableLoading',
        payload: data,
      });

      const response = yield call(get, payload);

      if(!response) {
        return false;
      }

      if (response.status === 'success') {
        const data = { ...response.data, tableLoading:false,pageLoading:false,searchValues:payload.search};
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
          yield put(
            routerRedux.push({
              pathname: response.url,
            }),
          );
        }

        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
      } else {
        message.error(response.msg, 3);
      }
    },
    *changeStatus({ payload, callback }, { put, call, select }) {
      const response = yield call(post, payload);

      if(!response) {
        return false;
      }

      const data = { tableLoading:true};
      yield put({
        type: 'tableLoading',
        payload: data,
      });

      // 操作成功
      if (response.status === 'success') {
        // 提示信息
        message.success(response.msg, 3);

        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
      } else {

        const data = { tableLoading:false};
        yield put({
          type: 'tableLoading',
          payload: data,
        });

        message.error(response.msg, 3);
      }
    },
  },

  reducers: {
    updateState(state, action) {
      action.payload.advancedSearchExpand = state.advancedSearchExpand;
      return {
        ...action.payload,
      };
    },
    resetState(state, action) {
    let resetState = {
        pageTitle:'',
        pageRandom:null,
        pageLoading:true,
        tableLoading:true,
        headerButtons: [],
        toolbarButtons: [],
        search: [],
        advancedSearch: false,
        advancedSearchExpand:false,
        searchValues:[],
        table: [],
        selectedRowKeys:[],
        modalTitle:'',
        modalWidth:'',
        modalFormUrl:'',
        modalVisible:false,
        action: null,
      }
      return {
        ...resetState,
      };
    },
    pageLoading(state, action) {
      state.pageLoading = action.payload.pageLoading;
      return {
        ...state,
      };
    },
    tableLoading(state, action) {
      state.tableLoading = action.payload.tableLoading;
      return {
        ...state,
      };
    },
    advancedSearchExpand(state, action) {
      state.advancedSearchExpand = action.payload.advancedSearchExpand;
      return {
        ...state,
      };
    },
    modalVisible(state, action) {
      state.modalTitle = action.payload.modalTitle;
      state.modalWidth = action.payload.modalWidth;
      state.modalVisible = action.payload.modalVisible;
      state.modalFormUrl = action.payload.modalFormUrl;
      return {
        ...state,
      };
    },
    selectedRowKeys(state, action) {
      state.selectedRowKeys = action.payload.selectedRowKeys;
      return {
        ...state,
      };
    },
  },
};

export default List;
