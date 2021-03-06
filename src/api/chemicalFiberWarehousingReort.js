import request from '@/utils/request'

/*export function warehousingDetali(data) {
  return request({
    url: 'api/',
    method: 'post',
    data
  })
}*/
export function getSummaryData(data) {
  return request({
    url: 'api/chemicalFiberWarehousingReort/getSummaryData',
    method: 'post',
    data
  })
}
export function download(params) {
  return request({
    url: 'api/chemicalFiberWarehousingReort/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
