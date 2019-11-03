import request from '@/utils/request';
import { stringify } from 'qs';

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