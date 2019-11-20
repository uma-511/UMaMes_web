import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/configClassify',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/configClassify/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/configClassify',
    method: 'put',
    data
  })
}

export function downloadConfigClassify(params) {
  return request({
    url: 'api/configClassify/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
