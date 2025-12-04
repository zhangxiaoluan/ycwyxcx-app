import { sendRequest, sendUpload } from '../request'


export function categoriesType() {
    const json = {
        url: '/app/convenient/phone/categories',
        method: 'get'
    }
    return sendRequest(json)
}


export function categoriesList(id) {
    const json = {
        url: '/app/convenient/phone/category/' + id,
        method: 'get'
    }
    return sendRequest(json)
}
