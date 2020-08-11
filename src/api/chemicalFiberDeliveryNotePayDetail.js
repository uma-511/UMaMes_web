import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/chemicalFiberDeliveryNotePayDetail',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/chemicalFiberDeliveryNotePayDetail/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFiberDeliveryNotePayDetail',
    method: 'put',
    data
  })
}

export function doPay(data) {
  return request({
    url: 'api/chemicalFiberDeliveryNotePayDetail/doPay',
    method: 'post',
    data
  })
}

export function finalPay(data) {
  return request({
    url: 'api/chemicalFiberDeliveryNotePayDetail/finalPay',
    method: 'post',
    data
  })
}

export function getPayDetailList(data) {
  return request({
    url: 'api/chemicalFiberDeliveryNotePayDetail/getPayDetailList',
    method: 'post',
    data
  })
}

export function downloadChemicalFiberDeliveryNotePayDetail(params) {
  return request({
    url: 'api/chemicalFiberDeliveryNotePayDetail/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
