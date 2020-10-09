import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/configCode',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/configCode/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/configCode',
    method: 'put',
    data
  })
}

export function downloadConfigCode(params) {
  return request({
    url: 'api/configCode/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
