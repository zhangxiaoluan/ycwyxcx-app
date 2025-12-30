import {sendRequest, txSendRequest} from '../request'

// 物业申请
export function propertyApply(params) {
    const json = {
        url: '/app/property/application/apply',
        method: 'post',
        data: params
    }
    return sendRequest(json)
}

// 物业申请角色
export function propertyRoles() {
    const json = {
        url: '/app/property/application/roles',
        method: 'get'
    }
    return sendRequest(json)
}


// 根据经纬度进行地址逆解析
export function geocoderLocation(params) {
    const json = {
        url: '/ws/geocoder/v1/',
        method: 'get',
        data: params,
    }
    return txSendRequest(json)
}


