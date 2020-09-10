import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/bonusType',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/bonusType/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/bonusType',
    method: 'put',
    data
  })
}

export function downloadBonusType(params) {
  return request({
    url: 'api/bonusType/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 获取周期的菜单树
export function getCycleMenusTree() {
  return request({
    url: 'api/bonusType/getCycleMenusTree',
    method: 'get'
  })
}
