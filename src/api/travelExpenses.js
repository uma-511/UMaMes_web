import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/travelExpenses',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/travelExpenses/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/travelExpenses',
    method: 'put',
    data
  })
}

export function downloadTravelExpenses(params) {
  return request({
    url: 'api/travelExpenses/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
