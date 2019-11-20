import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/umaDeliveryDetailChemicalFiber',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/umaDeliveryDetailChemicalFiber/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/umaDeliveryDetailChemicalFiber',
    method: 'put',
    data
  })
}

export function downloadUmaDeliveryDetailChemicalFiber(params) {
  return request({
    url: 'api/umaDeliveryDetailChemicalFiber/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
