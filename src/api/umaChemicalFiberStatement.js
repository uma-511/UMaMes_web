import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/umaChemicalFiberStatement',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/umaChemicalFiberStatement/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/umaChemicalFiberStatement',
    method: 'put',
    data
  })
}

export function downloadUmaChemicalFiberStatement(params) {
  return request({
    url: 'api/umaChemicalFiberStatement/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function getStatementDetailsList(data) {
  return request({
    url: 'api/umaChemicalFiberStatement/getStatementDetailsList',
    method: 'post',
    data
  })
}

export function getStatementDetailsAllList(data) {
  return request({
    url: 'api/umaChemicalFiberStatement/getStatementDetailsAllList',
    method: 'post',
    data
  })
}

export function getSums(data) {
  return request({
    url: 'api/umaChemicalFiberStatement/getSums',
    method: 'post',
    data
  })
}

export function exportStatementFun(id) {
  return request({
    url: 'api/umaChemicalFiberStatement/exportStatement/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
