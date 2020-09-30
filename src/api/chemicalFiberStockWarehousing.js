import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/chemicalFiberStockWarehousing',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/chemicalFiberStockWarehousing',
    method: 'put',
    data
  })
}

export function warehousing(data) {
  return request({
    url: 'api/chemicalFiberStockWarehousing/warehousing',
    method: 'put',
    data
  })
}

export function delWarehousing(id) {
  return request({
    url: 'api/chemicalFiberStockWarehousing/' + id,
    method: 'delete',
  })
}

export function getWarehousingSummaries(data) {
  return request({
    url: 'api/chemicalFiberStockWarehousing/getWarehousingSummaries',
    method: 'post',
    data
  })
}





