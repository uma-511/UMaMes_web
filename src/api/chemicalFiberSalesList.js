import request from '@/utils/request'

export function getSalesSummaries(data) {
  return request({
    url: 'api/chemicalFiberProduction/getSalesSummaries',
    method: 'post',
    data
  })
}
