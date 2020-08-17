import request from '@/utils/request'

export function addLnventory() {
  return request({
    url: 'api/chemicalFiberStockLnventory',
    method: 'post',
  })
}
