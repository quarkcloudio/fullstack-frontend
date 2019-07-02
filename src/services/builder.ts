import request from '@/utils/request';
import { stringify } from 'qs';

export async function getFieldsAndData(params: any) {
  return request(`../../api/${params.fieldsAndDataUrl}?${stringify(params)}`);
}

export async function submit(params: any) {
  return request(`../../api/${params.action}`, {
    method: 'post',
    body: params,
  });
}
