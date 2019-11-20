import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/scanRecord',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/scanRecord/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/scanRecord',
    method: 'put',
    data
  })
}

export function downloadScanRecord(params) {
  return request({
    url: 'api/scanRecord/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
