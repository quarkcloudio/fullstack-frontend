import request from '@/utils/request';
import { stringify } from 'qs';

export async function getFormInfo(params: any) {
  return request(`../../api/${params.actionUrl}`);
}

export async function formSubmit(params: any) {
  return request(`../../api/${params.actionUrl}`, {
    method: 'post',
    data: params,
  });
}

export async function getListInfo(params: any) {
  let actionUrl = '';
  if(params.actionUrl.indexOf("?") != -1) {
    actionUrl = `../../api/${params.actionUrl}&${stringify(params)}`;
  } else {
    actionUrl = `../../api/${params.actionUrl}?${stringify(params)}`;
  }

  return request(actionUrl);
}

export async function changeStatus(params: any) {
  return request(`../../api/${params.actionUrl}`, {
    method: 'post',
    data: params,
  });
}

export async function get(params: any) {
  let actionUrl = '';
  if(params.actionUrl.indexOf("?") != -1) {
    actionUrl = `../../api/${params.actionUrl}&${stringify(params)}`;
  } else {
    actionUrl = `../../api/${params.actionUrl}?${stringify(params)}`;
  }
  
  return request(actionUrl);
}

export async function post(params: any) {
  return request(`../../api/${params.actionUrl}`, {
    method: 'post',
    data: params,
  });
}

function removeActionUrl(params) {
  var index = params.indexOf('actionUrl');
  if(index>-1){
    params.splice(index,1);
  }  
}