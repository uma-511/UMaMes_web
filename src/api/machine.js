import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/machine',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/machine/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/machine',
    method: 'put',
    data
  })
}

export function downloadMachine(params) {
  return request({
    url: 'api/machine/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function getMachinesAllList() {
  return request({
    url: 'api/machine/getMachinesAllList',
    method: 'post'
  })
}

