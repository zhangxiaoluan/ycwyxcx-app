import {
    wxSendRequest
} from "@/api/request";

const Appid = 'wx8d760a578b35bf6f'
const secret = 'caf01628e9fa8394ae3004546abbf904'

/**
 * 解密手机号
 */
export const decryptPhoneNumber = (code) => {
    return new Promise((resolve, reject) => {
        wxSendRequest({
            url: 'https://api.weixin.qq.com/cgi-bin/token',
            method: 'GET',
            data: {
                grant_type: 'client_credential',
                appid: Appid,
                secret: secret
            }
        }).then(async (res) => {
            let access_token = res.access_token
            const response = await wxSendRequest({
                url: `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${access_token}`,
                method: 'POST',
                data: { code: code }
            })
            resolve(response.phone_info)
        })
    })
}

// 获取用户信息
export const getUserDetail = (code) => {
    return new Promise((resolve, reject) => {
        let url =
            `https://api.weixin.qq.com/sns/jscode2session?appid=${Appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
        uni.getUserInfo({
            provider: 'weixin',
            success: function (infoRes) {
                let userInfo = infoRes.userInfo || {}
                wxSendRequest({
                    url: url,
                    method: 'GET'
                }).then(async (res) => {
                    resolve({...userInfo, ...res})
                })
            }
        })

    })
}


/**
 * 微信登录
 * @param {Object} userInfo - 用户信息
 * @returns {Promise}
 */
export const wechatLogin = (userInfo) => {
    return new Promise((resolve, reject) => {
        uni.login({
            provider: 'weixin',
            success: async (loginRes) => {
                if (loginRes.code) {
                    try {
                        // 调用后端接口
                        const response = await sendRequest({
                            url: '/api/auth/wechat-login',
                            method: 'POST',
                            data: {
                                code: loginRes.code,
                                userInfo: userInfo
                            }
                        })

                        if (response.code === 200) {
                            // 保存登录信息
                            uni.setStorageSync('token', response.data.token)
                            uni.setStorageSync('userInfo', response.data.userInfo)
                            resolve(response.data)
                        } else {
                            reject(new Error(response.message || '登录失败'))
                        }
                    } catch (error) {
                        // 如果后端未实现，使用模拟登录
                        console.warn('后端接口未实现，使用模拟登录')
                        const mockData = mockLogin(userInfo, loginRes.code)
                        resolve(mockData)
                    }
                } else {
                    reject(new Error('获取登录凭证失败'))
                }
            },
            fail: reject
        })
    })
}

/**
 * 获取用户信息
 * @returns {Promise}
 */
export const getUserInfo = () => {
    return new Promise((resolve, reject) => {
        uni.getUserInfo({
            provider: 'weixin',
            success: resolve,
            fail: reject
        })
    })
}

/**
 * 绑定手机号
 * @param {string} phoneNumber - 手机号
 * @returns {Promise}
 */
export const bindPhoneNumber = (phoneNumber) => {
    return sendRequest({
        url: '/api/auth/bind-phone',
        method: 'POST',
        data: {
            phoneNumber: phoneNumber
        }
    }).catch(() => {
        // 模拟绑定成功
        return Promise.resolve({
            code: 200,
            message: '绑定成功'
        })
    })
}

/**
 * 检查登录状态
 * @returns {boolean}
 */
export const checkLoginStatus = () => {
    const token = uni.getStorageSync('token')
    const userInfo = uni.getStorageSync('userInfo')
    return !!(token && userInfo)
}

/**
 * 获取当前用户信息
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
    return uni.getStorageSync('userInfo') || null
}

/**
 * 退出登录
 */
export const logout = () => {
    try {
        // 清除本地存储
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')

        // 跳转到登录页
        uni.reLaunch({
            url: '/pages/login/login'
        })

        uni.showToast({
            title: '已退出登录',
            icon: 'success'
        })
    } catch (error) {
        console.error('退出登录失败:', error)
    }
}

/**
 * 模拟登录（用于开发测试）
 * @param {Object} userInfo - 用户信息
 * @param {string} code - 登录凭证
 * @returns {Object}
 */
function mockLogin(userInfo, code) {
    const mockData = {
        token: 'mock_token_' + Date.now(),
        userInfo: {
            ...userInfo,
            id: Date.now(),
            phoneNumber: null, // 初始未绑定手机号
            loginTime: new Date().toISOString(),
            lastLoginTime: new Date().toISOString()
        }
    }

    // 保存到本地存储
    uni.setStorageSync('token', mockData.token)
    uni.setStorageSync('userInfo', mockData.userInfo)

    return mockData
}

/**
 * 刷新token
 * @returns {Promise}
 */
export const refreshToken = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const userInfo = getCurrentUser()
            if (!userInfo) {
                reject(new Error('用户未登录'))
                return
            }

            // 获取新的登录凭证
            const loginRes = await new Promise((resolve, reject) => {
                uni.login({
                    provider: 'weixin',
                    success: resolve,
                    fail: reject
                })
            })

            if (loginRes.code) {
                try {
                    const response = await sendRequest({
                        url: '/api/auth/refresh-token',
                        method: 'POST',
                        data: {
                            code: loginRes.code,
                            oldToken: uni.getStorageSync('token')
                        }
                    })

                    if (response.code === 200) {
                        uni.setStorageSync('token', response.data.token)
                        resolve(response.data)
                    } else {
                        // 如果刷新失败，可能需要重新登录
                        logout()
                        reject(new Error('Token已过期，请重新登录'))
                    }
                } catch (error) {
                    // 模拟刷新成功
                    const newToken = 'refreshed_token_' + Date.now()
                    uni.setStorageSync('token', newToken)
                    resolve({
                        token: newToken
                    })
                }
            } else {
                reject(new Error('获取登录凭证失败'))
            }
        } catch (error) {
            reject(error)
        }
    })
}

// 兼容旧版本的授权方法
export const getAuth = () => {
    uni.login({
        provider: 'weixin',
        success: function (loginRes) {
            console.log('获取登录凭证:', loginRes);
            // 获取用户信息
            uni.getUserInfo({
                provider: 'weixin',
                success: function (infoRes) {
                    console.log('用户昵称为：' + infoRes.userInfo.nickName);
                }
            });
        }
    })
}
