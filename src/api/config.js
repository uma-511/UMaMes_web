import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/config',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/config/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/config',
    method: 'put',
    data
  })
}

export function downloadConfig(params) {
  return request({
    url: 'api/config/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
