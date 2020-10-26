import request from '@/utils/request'

export function edit(data) {
  return request({
    url: 'api/equipment',
    method: 'put',
    data
  })
}
