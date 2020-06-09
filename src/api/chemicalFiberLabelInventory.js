import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/chemicalFiberLabelInventory',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/chemicalFiberLabelInventory/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFiberLabelInventory',
    method: 'put',
    data
  })
}

export function downloadChemicalFiberLabelInventory(params) {
  return request({
    url: 'api/chemicalFiberLabelInventory/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
