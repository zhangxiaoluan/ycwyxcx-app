import { sendRequest } from '../request'

// 获取任务列表
export function getTaskList() {
    const json = {
        url: '/app/community/task/list',
        method: 'get'
    }
    return sendRequest(json)
}

// 获取任务详情
export function getTaskDetail(taskId) {
    const json = {
        url: `/app/community/task/detail/${taskId}`,
        method: 'get'
    }
    return sendRequest(json)
}

// 领取任务
export function takeTask(params) {
    const json = {
        url: `/app/community/task/take`,
        method: 'post',
        data: params
    }
    return sendRequest(json)
}

// 获取我发布的任务
export function getMyPublishedTasks() {
    const json = {
        url: '/app/community/task/my-published',
        method: 'get'
    }
    return sendRequest(json)
}

// 获取我已领取的任务
export function getMyTakenTasks() {
    const json = {
        url: '/app/community/task/my-taken',
        method: 'get'
    }
    return sendRequest(json)
}

// 获取任务状态列表
export function getTaskStatuses() {
    const json = {
        url: '/app/community/task/task-statuses',
        method: 'get'
    }
    return sendRequest(json)
}

// 获取任务类型列表
export function getTaskTypes() {
    const json = {
        url: '/app/community/task/task-types',
        method: 'get'
    }
    return sendRequest(json)
}

// 取消任务
export function cancelTask(taskId) {
    const json = {
        url: `/app/community/task/cancel/${taskId}`,
        method: 'post'
    }
    return sendRequest(json)
}

// 完成任务
export function completeTask(taskId) {
    const json = {
        url: `/app/community/task/complete/${taskId}`,
        method: 'post'
    }
    return sendRequest(json)
}

// 发布任务
export function publishTask(data) {
    const json = {
        url: '/app/community/task/publish',
        method: 'post',
        data: data
    }
    return sendRequest(json)
}
