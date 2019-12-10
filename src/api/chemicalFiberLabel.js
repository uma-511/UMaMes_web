import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/chemicalFiberLabel',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/chemicalFiberLabel/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFiberLabel',
    method: 'put',
    data
  })
}

export function downloadChemicalFiberLabel(params) {
  return request({
    url: 'api/chemicalFiberLabel/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function getSummaryData(data) {
  return request({
    url: 'api/chemicalFiberLabel/getSummaryData',
    method: 'post',
    data
  })
}
