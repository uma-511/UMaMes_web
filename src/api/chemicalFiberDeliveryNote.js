import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/chemicalFiberDeliveryNote',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/chemicalFiberDeliveryNote/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFiberDeliveryNote',
    method: 'put',
    data
  })
}

export function downloadChemicalFiberDeliveryNote(params) {
  return request({
    url: 'api/chemicalFiberDeliveryNote/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
