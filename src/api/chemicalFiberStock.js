import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/chemicalFiberStock',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/chemicalFiberStock/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFiberStock',
    method: 'put',
    data
  })
}

export function downloadChemicalFiberStock(params) {
  return request({
    url: 'api/chemicalFiberStock/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function getSummaryData(data) {
  return request({
    url: 'api/chemicalFiberStock/getSummaryData',
    method: 'post',
    data
  })
}
