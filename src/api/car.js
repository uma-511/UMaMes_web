import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/car',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/car/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/car',
    method: 'put',
    data
  })
}

export function downloadCar(params) {
  return request({
    url: 'api/car/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
