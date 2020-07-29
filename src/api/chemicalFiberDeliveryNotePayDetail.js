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

export function downloadChemicalFiberDeliveryNotePayDetail(params) {
  return request({
    url: 'api/chemicalFiberDeliveryNotePayDetail/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
