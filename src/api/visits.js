import request from '@/utils/request'

export function count() {
  return request({
    url: 'api/visits',
    method: 'post'
  })
}

export function get(data) {
  return request({
    url: 'api/visits/get',
    method: 'post',
    data
  })
}

export function getChartData() {
  return request({
    url: 'api/visits/chartData',
    method: 'get'
  })
}
