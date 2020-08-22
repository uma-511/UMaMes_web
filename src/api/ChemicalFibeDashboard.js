import request from '@/utils/request'

export function get(data) {
  return request({
    url: 'api/chemicalFibeDashboard',
    method: 'post',
    data
  })
}
