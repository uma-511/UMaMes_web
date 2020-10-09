import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/monthlyWageStatistics',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/monthlyWageStatistics/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/monthlyWageStatistics',
    method: 'put',
    data
  })
}

export function downloadMonthlyWageStatistics(params) {
  return request({
    url: 'api/monthlyWageStatistics/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function generateWage() {
  return request({
    url: 'api/monthlyWageStatistics/generateWage',
    method: 'get'
  })
}



export function doFinish(id) {
  return request({
    url: 'api/monthlyWageStatistics/doFinish/' + id,
    method: 'get'
  })
}
