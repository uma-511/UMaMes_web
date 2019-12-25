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

export function downloadDeliveryNote(id) {
  return request({
    url: 'api/chemicalFiberDeliveryNote/downloadDeliveryNote/' + id,
    method: 'get',
    responseType: 'blob'
  })
}

export function exportPoundExcel(data) {
  return request({
    url: 'api/chemicalFiberDeliveryNote/exportPoundExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function getSalesReportSummaries(data) {
  return request({
    url: 'api/chemicalFiberDeliveryNote/getSalesReportSummaries',
    method: 'post',
    data
  })
}
