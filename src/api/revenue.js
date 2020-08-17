import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/revenue',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/revenue/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/revenue',
    method: 'put',
    data
  })
}

export function downloadRevenue(params) {
  return request({
    url: 'api/revenue/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
