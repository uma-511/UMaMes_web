import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/customer',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/customer/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/customer',
    method: 'put',
    data
  })
}

export function downloadCustomer(params) {
  return request({
    url: 'api/customer/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
