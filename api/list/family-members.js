import { sendRequest } from '../request'

//
export function familyMembers(params) {
    const json = {
        url: '/app/property/binding/family-members',
        method: 'get',
        data: params
    }
    return sendRequest(json)
}
