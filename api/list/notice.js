import {sendRequest} from "../request";

export function categories() {
    const json = {
        url: `/app/announcement/categories`,
        method: 'get'
    }
    return sendRequest(json)
}


export function categoriesList(params) {
    const json = {
        url: `/app/announcement/list`,
        method: 'get',
        data: params
    }
    return sendRequest(json)
}

export function categoriesRead(id) {
    const json = {
        url: `/app/announcement/${id}/read`,
        method: 'post',
    }
    return sendRequest(json)
}

export function categoriesReadAll(params) {
    const json = {
        url: `/app/announcement/batch/read`,
        method: 'post',
        data: params
    }
    return sendRequest(json)
}




