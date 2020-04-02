import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/chemicalFiberDeliveryDetail',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/chemicalFiberDeliveryDetail/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFiberDeliveryDetail',
    method: 'put',
    data
  })
}

export function downloadChemicalFiberDeliveryDetail(params) {
  return request({
    url: 'api/chemicalFiberDeliveryDetail/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function getChemicalFiberDeliveryDetailsList(data) {
  return request({
    url: 'api/chemicalFiberDeliveryDetail/getChemicalFiberDeliveryDetailsList',
    method: 'post',
    data
  })
}

export function getSalesReportSummaries(data) {
  return request({
    url: 'api/chemicalFiberDeliveryDetail/getSalesReportSummaries',
    method: 'post',
    data
  })
}
