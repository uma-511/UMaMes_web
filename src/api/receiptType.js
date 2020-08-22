import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/receiptType',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/receiptType/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/receiptType',
    method: 'put',
    data
  })
}

export function downloadReceiptType(params) {
  return request({
    url: 'api/receiptType/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function getReceiptTypeList(params) {
  return request({
    url: 'api/receiptType/getReceiptTypeList',
    method: 'get',
    params
  })
}
