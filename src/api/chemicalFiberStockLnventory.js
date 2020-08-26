import request from '@/utils/request'

export function addLnventory() {
  return request({
    url: 'api/chemicalFiberStockLnventory',
    method: 'post',
  })
}

export function delectsStock(id) {
  return request({
    url: 'api/chemicalFiberStockLnventory/' + id,
    method: 'delete'
  })
}
