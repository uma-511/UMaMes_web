import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/bookAccountType',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/bookAccountType/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/bookAccountType',
    method: 'put',
    data
  })
}

export function downloadBookAccountType(params) {
  return request({
    url: 'api/bookAccountType/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function getBookAccountList(params) {
  return request({
    url: 'api/bookAccountType/getBookAccountList',
    method: 'get',
    params
  })
}
