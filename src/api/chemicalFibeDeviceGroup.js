import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/chemicalFibeDeviceGroup',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/chemicalFibeDeviceGroup/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFibeDeviceGroup',
    method: 'put',
    data
  })
}

export function downloadChemicalFibeDeviceGroup(params) {
  return request({
    url: 'api/chemicalFibeDeviceGroup/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
