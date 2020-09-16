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

// 获取岗位的菜单树
export function getBonusJobsTree() {
  return request({
    url: 'api/bonusType/getBonusJobsTree',
    method: 'get'
  })
}

export function get(id) {
  return request({
    url: 'api/bonusType/' + id,
    method: 'get'
  })
}

export function editCycle(data) {
  return request({
    url: 'api/bonusType/cycle',
    method: 'put',
    data
  })
}

export function editBonusJob(data) {
  return request({
    url: 'api/bonusType/job',
    method: 'put',
    data
  })
}
