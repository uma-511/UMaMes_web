import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/umaProductionChemicalFiber',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/umaProductionChemicalFiber/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/umaProductionChemicalFiber',
    method: 'put',
    data
  })
}

export function downloadUmaProductionChemicalFiber(params) {
  return request({
    url: 'api/umaProductionChemicalFiber/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
