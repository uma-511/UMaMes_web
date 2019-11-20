import request from '@/utils/request'

export function add(data) {
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

export function edit(data) {
  return request({
    url: 'api/chemicalFiberProduction',
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
