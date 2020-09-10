import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/attenceType',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/attenceType/' + id,
    method: 'delete'
  })
}

export function getAttenceTypesList(data) {
  return request({
    url: 'api/attenceType/getAttenceTypesList',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/attenceType',
    method: 'put',
    data
  })
}

export function downloadAttenceType(params) {
  return request({
    url: 'api/attenceType/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
