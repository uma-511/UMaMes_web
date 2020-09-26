import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/overArrearsPayDetail',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/overArrearsPayDetail/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/overArrearsPayDetail',
    method: 'put',
    data
  })
}

export function getPayDetailList(data) {
  return request({
    url: 'api/overArrearsPayDetail/getPayDetailList',
    method: 'post',
    data
  })
}

export function downloadOverArrearsPayDetail(params) {
  return request({
    url: 'api/overArrearsPayDetail/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
