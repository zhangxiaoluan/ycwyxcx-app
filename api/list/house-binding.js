import { sendRequest, sendUpload } from '../request'

// 绑定记录
export function houseBindings(params) {
    const json = {
        url: '/app/property/binding/my-bindings',
        method: 'post',
        data: params
    }
    return sendRequest(json)
}

// 获取小区列表
export function getCommunities() {
    const json = {
        url: '/app/property/selection/communities',
        method: 'get'
    }
    return sendRequest(json)
}

// 获取楼栋列表
export function getBuildings(communityId) {
    const json = {
        url: '/app/property/selection/buildings',
        method: 'get',
        data: { communityId }
    }
    return sendRequest(json)
}

// 获取房间列表
export function getRooms(communityId, buildingId) {
    const json = {
        url: '/app/property/selection/rooms',
        method: 'get',
        data: { communityId, buildingId }
    }
    return sendRequest(json)
}

// 提交房屋绑定
export function submitHouseBinding(params) {
    const json = {
        url: '/app/property/binding/apply',
        method: 'post',
        data: params
    }
    return sendRequest(json)
}
