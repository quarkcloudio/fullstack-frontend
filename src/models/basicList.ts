import { routerRedux } from 'dva/router';
import { Reducer } from 'redux';
import { Effect,Subscription } from 'dva';
import { message } from 'antd';
import { 
  getListInfo,
  changeStatus,
} from '@/services/builder';

export interface BasicListModelState {
  pageTitle:string;
  pageRandom:string;
  pageLoading:boolean;
  headerButtons: [];
  toolbarButtons: [];
  search: [];
  advancedSearch: [];
  advancedSearchExpand:boolean;
  table: [];
  selectedRowKeys:[]
  modalTitle:string;
  modalWidth:string;
  modalFormUrl:string;
  modalVisible:boolean;
  action: string;
}

export interface ModelType {
  namespace: string;
  state: {};
  subscriptions:{ setup: Subscription };
  effects: {
    getListInfo: Effect;
    changeStatus: Effect;
  };
  reducers: {
    updateState: Reducer<{}>;
    pageLoading: Reducer<{}>;
    selectedRowKeys: Reducer<{}>;
    advancedSearchExpand: Reducer<{}>;
    modalVisible: Reducer<{}>;
    resetState: Reducer<{}>;
  };
}

const BasicList: ModelType = {

  namespace: 'basicList',

  state: {
    pageTitle:'',
    pageRandom:null,
    pageLoading:true,
    headerButtons: [],
    toolbarButtons: [],
    search: [],
    advancedSearch: false,
    advancedSearchExpand:false,
    table: [],
    selectedRowKeys:[],
    modalTitle:'',
    modalWidth:'',
    modalFormUrl:'',
    modalVisible:false,
    action: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        let historyUrl = window.localStorage.getItem('historyUrl')
        if(pathname != historyUrl) {
          window.localStorage.setItem('historyUrl', pathname);
          dispatch({
            type: 'basicList/resetState',
          });
        }
      });
    },
  },

  effects: {
    *getListInfo({ payload, callback }, { put, call, select }) {
      const data = { pageLoading:true};
      yield put({
        type: 'pageLoading',
        payload: data,
      });

      const response = yield call(getListInfo, payload);
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
    *changeStatus({ payload, callback }, { put, call, select }) {
      const response = yield call(changeStatus, payload);

      const data = { pageLoading:true};
      yield put({
        type: 'pageLoading',
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
        headerButtons: [],
        toolbarButtons: [],
        search: [],
        advancedSearch: false,
        advancedSearchExpand:false,
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

export default BasicList;
