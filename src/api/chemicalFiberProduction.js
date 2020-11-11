import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/chemicalFiberProduction',
    method: 'post',
    data
  })
}

export function addex(data) {
  return request({
    url: 'api/chemicalFiberProduction',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/chemicalFiberProduction/' + id,
    method: 'delete'
  })
}

export function delex(id) {
  return request({
    url: 'api/chemicalFiberProduction/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFiberProduction',
    method: 'put',
    data
  })
}

export function editPrductionList(data) {
  return request({
    url: 'api/chemicalFiberProduction/PrductionList',
    method: 'put',
    data
  })
}

export function downloadChemicalFiberProduction(params) {
  return request({
    url: 'api/chemicalFiberProduction/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function setMachines(data) {
  return request({
    url: 'api/chemicalFiberProduction/setMachines',
    method: 'post',
    data
  })
}

export function setProductionStatus(data) {
  return request({
    url: 'api/chemicalFiberProduction/setProductionStatus',
    method: 'post',
    data
  })
}

export function getProductionReportSummaries(data) {
  return request({
    url: 'api/chemicalFiberProduction/getProductionReportSummaries',
    method: 'post',
    data
  })
}

export function exportPoundExcelProduct(params) {
  return request({
    url: 'api/chemicalFiberProduction/downloadProduct',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

