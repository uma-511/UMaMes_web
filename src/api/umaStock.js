import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/umaStock',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/umaStock/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/umaStock',
    method: 'put',
    data
  })
}

export function downloadUmaStock(params) {
  return request({
    url: 'api/umaStock/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
