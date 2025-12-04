import { sendRequest } from '../request'


export function articleCarousel() {
    const json = {
        url: '/app/community/article/carousel',
        method: 'get'
    }
    return sendRequest(json)
}

export function getArticleDetail(id) {
    const json = {
        url: `/app/community/article/${id}`,
        method: 'get'
    }
    return sendRequest(json)
}
