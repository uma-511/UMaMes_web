import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/chemicalFiberProduct',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/chemicalFiberProduct/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFiberProduct',
    method: 'put',
    data
  })
}

export function downloadChemicalFiberProduct(params) {
  return request({
    url: 'api/chemicalFiberProduct/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
