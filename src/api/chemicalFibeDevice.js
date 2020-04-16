import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/chemicalFibeDevice',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/chemicalFibeDevice/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFibeDevice',
    method: 'put',
    data
  })
}

export function downloadChemicalFibeDevice(params) {
  return request({
    url: 'api/chemicalFibeDevice/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
