import {setObjToUrlParams} from "@/utils";

// #ifdef H5 | WEB
const BASE_URL = ''
const TX_BASE_URL = ''
// #endif

// #ifdef MP-WEIXIN
const BASE_URL = 'http://62.234.35.7:8802'
const TX_BASE_URL = 'https://apis.map.qq.com'
// #endif


export const sendRequest = (target, config) => {
    let token = uni.getStorageSync('token')
    if (!target.url) throw new Error('url地址不能为空')
    let result = null
    let method = target.method.toUpperCase()
    switch (method) {
        case 'POST':
        case 'GET':
        case 'PUT':
            result = target.data
            break
        case 'DELETE':
            target.url = target.url + '/' + target.data
            break
    }
    return new Promise((resolve, reject) => {
        let json = {
            url: BASE_URL + target.url,
            data: result,
            method: method,
			header: {
                // #ifdef MP-WEIXIN
                Cookie: `satoken=${token}`
                // #endif
			},
            ...config
        }
        return uni.request({
            ...json,
			withCredentials: true,
			enableCookie: true,
            success: function (res) {
                if (res.statusCode === 500) {
                    uni.showToast({title: res.data || '服务器响应超时', icon: 'none'})
                    setTimeout(function () {
                        uni.reLaunch({url: '/pages/err-page/home/home'})
                    }, 500)
                }
                let data = res.data
                let code = Number(data.code)
                let result = data.result || {}

                switch (code) {
                    case 500:
                        uni.showToast({icon: 'none', title: data.message || '系统错误'})
                        reject(data)
                        break
                    case 200:
                        resolve(result)
                        break
                    case 401:
                        uni.showToast({title: data.message, icon: 'none'})
                        setTimeout(function () {
                            uni.reLaunch({url: '/pages/login/login'})
                        }, 500)
                        break
                }
            },
            fail(err) {
                uni.showToast({
                    title: '请求数据异常',
                    icon: 'none'
                })
                throw new Error(err.errMsg)
            }
        })
    })
}

// 微信接口请求
export const wxSendRequest = (target, config) => {
    if (!target.url) throw new Error('url地址不能为空')
    let result = null
    let method = target.method.toUpperCase()
    switch (method) {
        case 'POST':
        case 'GET':
        case 'PUT':
            result = target.data
            break
        case 'DELETE':
            target.url = target.url + '/' + target.data
            break
    }
    return new Promise((resolve, reject) => {
        let json = {
            url: target.url,
            data: result,
            method: method,
            ...config
        }
        return uni.request({
            ...json,
            success: function (res) {
                let data = res.data
                resolve(data)
            },
            fail(err) {
                uni.showToast({title: '请求数据异常', icon: 'none'})
                throw new Error(err.errMsg)
            }
        })
    })
}

// 上传图片
export const sendUpload = async (url, filePath, file) => {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: BASE_URL + url,
            filePath: filePath,
            file: file,
            name: 'file',
            success: res => {
                let data = JSON.parse(res.data)
                resolve(data)
            },
            fail(err) {
                console.log('err', err)
                reject(err)
            },
        })
    })
}

// 上传图片(多个)
export const sendUploads = async (url, fileList) => {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: BASE_URL + url,
            files: fileList,
            success: res => {
                let data = JSON.parse(res.data)
                resolve(data)
            },
            fail(err) {
                console.log('err', err)
                reject(err)
            },
        })
    })
}


// 腾讯地图接口请求
export const txSendRequest = (target, config) => {
    if (!target.url) throw new Error('url地址不能为空')
    let key = 'B3HBZ-DBPWU-YSZVK-GSVGQ-UQIWO-V6FE7'
    let result = null
    let method = target.method.toUpperCase()
    switch (method) {
        case 'POST':
        case 'PUT':
            result = target.data
            break
        case 'GET':
            target.url = setObjToUrlParams(target.url, { key, ...target.data })
            break
    }
    return new Promise((resolve, reject) => {
        let json = {
            url: TX_BASE_URL + target.url,
            data: result,
            method: method,
            ...config
        }
        return uni.request({
            ...json,
            success: function (res) {
                let data = res.data || {}
                let status = Number(data.status)
                if (status === 0) {
                    resolve(data.result)
                }else {
                    uni.showToast({title: data.message, icon: 'none'})
                    resolve(data)
                }
            },
            fail(err) {
                uni.showToast({title: '请求数据异常', icon: 'none'})
                reject(err.errMsg)
            }
        })
    })
}

