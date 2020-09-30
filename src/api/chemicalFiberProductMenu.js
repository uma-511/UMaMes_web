import request from '@/utils/request'

export function getMenu(params) {
  return request({
    url: 'api/chemicalFiberProductMenus',
    method: 'get',
    params
  })
}

export function addMenu(params) {
  return request({
    url: 'api/chemicalFiberProductMenus/add',
    method: 'get',
    params
  })
}

export function delectMenu(params) {
  return request({
    url: 'api/chemicalFiberProductMenus/delect',
    method: 'get',
    params
  })
}
