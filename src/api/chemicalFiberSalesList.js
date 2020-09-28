import request from '@/utils/request'

export function getSalesSummaries(data) {
  return request({
    url: 'api/chemicalFiberSalesList/getSalesSummaries',
    method: 'post',
    data
  })
}
