import { sendRequest } from '../request'

// 获取报修分类
export function getRepairCategories() {
    const json = {
        url: '/app/repair/categories',
        method: 'get'
    }
    return sendRequest(json)
}

// 获取报修列表
export function getRepairList(params) {
    const json = {
        url: '/app/repair/list',
        method: 'post',
        data: params
    }
    return sendRequest(json)
}

// 提交报修申请
export function submitRepairRequest(data) {
    const json = {
        url: '/app/repair/request',
        method: 'post',
        data: data
    }
    return sendRequest(json)
}

// 获取报修进度
export function getRepairProgress(requestId) {
    const json = {
        url: `/app/repair/progress/${requestId}`,
        method: 'get'
    }
    return sendRequest(json)
}

// 提交报修评价
export function submitRepairRate(id, data) {
    const json = {
        url: `/app/repair/rate/${id}`,
        method: 'post',
        data: data
    }
    return sendRequest(json)
}