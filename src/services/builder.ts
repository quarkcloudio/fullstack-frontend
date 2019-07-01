import request from '@/utils/request';
import { stringify } from 'qs';

export async function index(params: any) {
  return request(`../../api/admin/${params.controllerName}/index?${stringify(params)}`);
}

export async function destroy(params: any) {
  return request(`../../api/admin/${params.controllerName}/destroy`, {
    method: 'post',
    body: params,
  });
}

export async function changeStatus(params: any) {
  return request(`../../api/admin/${params.controllerName}/changeStatus`, {
    method: 'post',
    body: params,
  });
}

export async function create(params: any) {
  return request(`../../api/${params.controllerName}?${stringify(params)}`);
}

export async function edit(params: any) {
  return request(`../../api/${params.controllerName}?${stringify(params)}`);
}

export async function submit(params: any) {
  return request(`../../api/${params.action}`, {
    method: 'post',
    body: params,
  });
}
