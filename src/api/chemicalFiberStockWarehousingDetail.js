import request from '@/utils/request'

export function warehousingDetali(data) {
  return request({
    url: 'api/chemicalFiberStockWarehousingDetail',
    method: 'post',
    data
  })
}

export function warehousingDetaliList(data) {
  return request({
    url: 'api/chemicalFiberStockWarehousingDetail/chemicalFiberStockWarehousingDetailList',
    method: 'post',
    data
  })
}

export function warehousingEdit(data) {
  return request({
    url: 'api/chemicalFiberStockWarehousingDetail',
    method: 'put',
    data
  })
}

export function delDetail(id) {
  return request({
    url: 'api/chemicalFiberStockWarehousingDetail/' + id,
    method: 'delete',
  })
}



