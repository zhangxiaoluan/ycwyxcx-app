import { sendRequest, sendUpload } from '../request'

// 获取社区动态列表
export function getPostList(params) {
    const json = {
        url: '/app/community/post/list',
        method: 'post',
        data: params
    }
    return sendRequest(json)
}

// 获取社区动态详情
export function getPostDetail(postId) {
    const json = {
        url: '/app/community/post/' + postId,
        method: 'get'
    }
    return sendRequest(json)
}

// 点赞动态
export function likePost(postId) {
    const json = {
        url: '/app/community/post/like/' + postId,
        method: 'post'
    }
    return sendRequest(json)
}

// 取消点赞
export function unlikePost(postId) {
    const json = {
        url: '/app/community/post/unlike/' + postId,
        method: 'post'
    }
    return sendRequest(json)
}

// 发布社区动态
export function createPost(params) {
    const json = {
        url: '/app/community/post/create',
        method: 'post',
        data: params
    }
    return sendRequest(json)
}

// 获取我的动态列表
export function getMyPosts(params) {
    const json = {
        url: '/app/community/post/my',
        method: 'post',
        data: params
    }
    return sendRequest(json)
}

// 删除我的动态
export function deletePost(postId) {
    const json = {
        url: '/app/community/post/delete/' + postId,
        method: 'post'
    }
    return sendRequest(json)
}

// 获取我的点赞列表
export function getLikedPosts(params) {
    const json = {
        url: '/app/community/post/liked',
        method: 'post',
        data: params
    }
    return sendRequest(json)
}

// 上传媒体文件
export function uploadMedia(filePath, file) {
    let url = '/app/community/upload/media'
    return sendUpload(url, filePath, file)
}
