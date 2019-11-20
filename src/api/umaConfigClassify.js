import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/umaConfigClassify',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/umaConfigClassify/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/umaConfigClassify',
    method: 'put',
    data
  })
}

export function downloadUmaConfigClassify(params) {
  return request({
    url: 'api/umaConfigClassify/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
