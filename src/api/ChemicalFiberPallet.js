import request from '@/utils/request'

export function exportPoundExcel(data) {
  return request({
    url: 'api/chemicalFiberPallet/exportPoundExcel',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

