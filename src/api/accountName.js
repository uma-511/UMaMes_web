import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/accountName',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/accountName/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/accountName',
    method: 'put',
    data
  })
}

export function downloadAccountName(params) {
  return request({
    url: 'api/accountName/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function getAccountList(params) {
  return request({
    url: 'api/accountName/getAccountList',
    method: 'get',
    params
  })
}
