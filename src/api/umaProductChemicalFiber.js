import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/umaProductChemicalFiber',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/umaProductChemicalFiber/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/umaProductChemicalFiber',
    method: 'put',
    data
  })
}

export function downloadUmaProductChemicalFiber(params) {
  return request({
    url: 'api/umaProductChemicalFiber/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
