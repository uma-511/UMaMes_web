import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/umaDeliveryNote',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/umaDeliveryNote/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/umaDeliveryNote',
    method: 'put',
    data
  })
}

export function downloadUmaDeliveryNote(params) {
  return request({
    url: 'api/umaDeliveryNote/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
