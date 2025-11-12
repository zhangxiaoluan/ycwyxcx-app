export const sendRequest = (target, config)=> {
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
      target.url = target.url + '/'+ target.data
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
      success: function(res) {
        if(res.statusCode === 500) {
          uni.showToast({title: res.data || '服务器响应超时', icon: 'none'})
          setTimeout(function() { uni.reLaunch({ url: '/pages/err-page/home/home' }) }, 500)
        }
        let data = res.data
        switch (data.code) {
          case 500:
            uni.showToast({ icon: 'none', title: data.message || '系统错误' })
            reject(data)
            break
          case 200:
            resolve(data)
            break
          case 401:
            uni.showToast({ title: data.message,  icon: 'none' })
            setTimeout(function() {
              uni.reLaunch({ url: '/pages/single-login/single-login' })
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

// 上传图片
export const sendUpload = async (url, filePath, file) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: url,
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
      url: url,
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


export default {
  sendRequest, sendUpload, sendUploads
}
