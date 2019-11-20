import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/umaCustomer',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/umaCustomer/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/umaCustomer',
    method: 'put',
    data
  })
}

export function downloadUmaCustomer(params) {
  return request({
    url: 'api/umaCustomer/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
