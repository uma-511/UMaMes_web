import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/umaLabelChemicalFiber',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/umaLabelChemicalFiber/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/umaLabelChemicalFiber',
    method: 'put',
    data
  })
}

export function downloadUmaLabelChemicalFiber(params) {
  return request({
    url: 'api/umaLabelChemicalFiber/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
