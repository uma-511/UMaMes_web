import request from '@/utils/request'

export function getProductionReportSummaries(data) {
  return request({
    url: 'api/chemicalFiberProductionReport/getProductionReportSummaries',
    method: 'post',
    data
  })
}


export function exportPoundExcelProduct(params) {
  return request({
    url: 'api/chemicalFiberProductionReport/downloadProduct',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
