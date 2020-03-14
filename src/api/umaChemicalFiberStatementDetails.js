import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/umaChemicalFiberStatementDetails',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/umaChemicalFiberStatementDetails/' + id,
    method: 'delete'
  })
}

export function statementDetailsEdit(data) {
  return request({
    url: 'api/umaChemicalFiberStatementDetails',
    method: 'put',
    data
  })
}

export function downloadUmaChemicalFiberStatementDetails(params) {
  return request({
    url: 'api/umaChemicalFiberStatementDetails/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
