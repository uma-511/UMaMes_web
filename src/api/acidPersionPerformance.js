import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/acidPersionPerformance',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/acidPersionPerformance/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/acidPersionPerformance',
    method: 'put',
    data
  })
}

export function downloadAcidPersionPerformance(params) {
  return request({
    url: 'api/acidPersionPerformance/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
