import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/viewScanRecord',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/viewScanRecord/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/viewScanRecord',
    method: 'put',
    data
  })
}

export function downloadViewScanRecord(params) {
  return request({
    url: 'api/viewScanRecord/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
