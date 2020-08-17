import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/receipt',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/receipt/' + id,
    method: 'delete'
  })
}

export function doFinish(id) {
  return request({
    url: 'api/receipt/doFinish/' + id,
    method: 'get',
    responseType: 'blob'
  })
}

export function edit(params) {
  return request({
    url: 'api/receipt',
    method: 'put',
    params
  })
}

export function downloadReceipt(params) {
  return request({
    url: 'api/receipt/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
