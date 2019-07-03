import request from '@/utils/request';
import { stringify } from 'qs';

export async function getFormInfo(params: any) {
  return request(`../../api/${params.url}?${stringify(params)}`);
}

export async function formSubmit(params: any) {
  return request(`../../api/${params.action}`, {
    method: 'post',
    body: params,
  });
}
