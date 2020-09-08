import request from '@/utils/request'

export function getPalletDateilList(data) {
  return request({
    url: 'api/chemicalFiberPalletDetail',
    method: 'post',
    data
  })
}

