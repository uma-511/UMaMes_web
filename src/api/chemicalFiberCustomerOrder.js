import request from '@/utils/request'

export function getProdction(data) {
  return request({
    url: 'api/chemicalFiberCustomerOrder/getProdction',
    method: 'post',
    data
  })
}

export function addCustomerOrder(data) {
  return request({
    url: 'api/chemicalFiberCustomerOrder',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFiberCustomerOrder',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/chemicalFiberCustomerOrder/' + id,
    method: 'delete'
  })
}

export function exportCustomerOrder(id) {
  return request({
    url: 'api/chemicalFiberCustomerOrder/exportCustomerOrder/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
