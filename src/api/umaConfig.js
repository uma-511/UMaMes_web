import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/umaConfig',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/umaConfig/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/umaConfig',
    method: 'put',
    data
  })
}

export function downloadUmaConfig(params) {
  return request({
    url: 'api/umaConfig/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
