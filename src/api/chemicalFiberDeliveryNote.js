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

export function editAll(data) {
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

export function sendOut(id) {
  return request({
    url: 'api/chemicalFiberDeliveryNote/sendOut/' + id,
    method: 'get',
    responseType: 'blob'
  })
}

export function doInvalid(id) {
  return request({
    url: 'api/chemicalFiberDeliveryNote/doInvalid/' + id,
    method: 'get',
    responseType: 'blob'
  })
}

export function unInvalid(id) {
  return request({
    url: 'api/chemicalFiberDeliveryNote/unInvalid/' + id,
    method: 'get',
    responseType: 'blob'
  })
}

export function recived(id) {
  return request({
    url: 'api/chemicalFiberDeliveryNote/recived/' + id,
    method: 'get',
    responseType: 'blob'
  })
}

export function reRecived(id) {
  return request({
    url: 'api/chemicalFiberDeliveryNote/reRecived/' + id,
    method: 'get'
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

export function getSummaryData(data) {
  return request({
    url: 'api/chemicalFiberDeliveryNote/getSummaryData',
    method: 'post',
    data
  })
}

