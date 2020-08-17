import request from '@/utils/request'

export function getLnventoryDateil() {
  return request({
    url: 'api/chemicalFiberStockLnventoryDetail',
    method: 'get',
  })
}

export function getLnventoryDateilList(data) {
  return request({
    url: 'api/chemicalFiberStockLnventoryDetail/List',
    method: 'post',
    data
  })
}

export function addLnventoryDateil(data) {
  return request({
    url: 'api/chemicalFiberStockLnventoryDetail',
    method: 'post',
    data
  })
}

export function addLnventoryDateilList(data) {
  return request({
    url: 'api/chemicalFiberStockLnventoryDetail/addList',
    method: 'post',
    data
  })
}

export function balanceList(data) {
  return request({
    url: 'api/chemicalFiberStockLnventoryDetail/balance',
    method: 'post',
    data
  })
}
