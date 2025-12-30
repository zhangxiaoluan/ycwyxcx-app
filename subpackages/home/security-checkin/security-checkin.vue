<template>
  <view class="security-checkin-page">

    <!-- 表单内容 -->
    <view class="form-container">
      <!-- 位置信息卡片 -->
      <view class="form-card">
        <view class="card-title">
          <u-icon name="map" size="20" color="#3b5598"></u-icon>
          <text>位置信息</text>
        </view>

        <view class="form-item">
          <text class="label">位置名称</text>
          <input
            class="input"
            v-model="formData.locationName"
            placeholder="请输入位置名称"
            maxlength="50"
          />
        </view>

        <view class="form-item">
          <text class="label">详细地址</text>
          <input
            class="input"
            v-model="formData.address"
            placeholder="请输入详细地址"
            maxlength="100"
          />
        </view>

        <view class="form-item">
          <map
              :zIndex="true"
              :enable-poi="true"
              :show-location="true"
              :enable-overlooking="true"
              :enable-rotate="true"
              :show-compass="true"
              :enable-3D="true"
              style="width: 100%; height: 300px;"
              :latitude="formData.latitude"
              :longitude="formData.longitude"
          >
          </map>
        </view>

        <view class="location-btn" @click="getCurrentLocation">
          <text>获取当前位置</text>
        </view>
      </view>

      <!-- 打卡类型 -->
      <view class="form-card">
        <view class="card-title">
          <u-icon name="grid" size="20" color="#3b5598"></u-icon>
          <text>打卡类型</text>
        </view>

        <view class="radio-group">
          <view
            class="radio-item"
            v-for="type in checkinTypes"
            :key="type.value"
            @click="selectCheckinType(type.value)"
          >
            <view class="radio-icon" :class="{ active: formData.checkinType === type.value }">
              <view v-if="formData.checkinType === type.value" class="radio-dot"></view>
            </view>
            <text class="radio-label">{{ type.label }}</text>
          </view>
        </view>
      </view>

      <!-- 图片上传 -->
      <view class="form-card">
        <view class="card-title">
          <u-icon name="camera" size="20" color="#3b5598"></u-icon>
          <text>现场照片</text>
          <text class="optional">（选填）</text>
        </view>

        <view class="image-upload">
          <view class="image-list">
            <view
              class="image-item"
              v-for="(image, index) in formData.imageUrls"
              :key="index"
            >
              <image :src="image" mode="aspectFill" class="uploaded-image"></image>
              <view class="delete-btn" @click="deleteImage(index)">
                <u-icon name="close" size="14" color="#fff"></u-icon>
              </view>
            </view>

            <view class="upload-btn" @click="chooseImage" v-if="formData.imageUrls.length < 3">
              <u-icon name="plus" size="24" color="#999"></u-icon>
              <text class="upload-text">添加照片</text>
            </view>
          </view>
          <text class="upload-tip">最多可上传3张照片</text>
        </view>
      </view>

      <!-- 备注 -->
      <view class="form-card">
        <view class="card-title">
          <u-icon name="edit-pen" size="20" color="#3b5598"></u-icon>
          <text>备注信息</text>
          <text class="optional">（选填）</text>
        </view>

        <textarea
          class="textarea"
          v-model="formData.remark"
          placeholder="请输入备注信息"
          maxlength="200"
        ></textarea>
        <view class="char-count">{{ formData.remark.length }}/200</view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button class="submit-btn" @click="submitCheckin">
          <u-icon name="checkmark" size="18" color="#fff" v-if="!loading"></u-icon>
          <u-loading-icon size="18" color="#fff" v-if="loading"></u-loading-icon>
          <text>{{ loading ? '提交中...' : '确认打卡' }}</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { securityCheckin } from '@/api/list/home'
import {uploadFile} from "@/api/list/login";
// import iconPath from '@/static/location.png'
import {geocoderLocation} from "@/api/list/user";
export default {
  data() {
    return {
      loading: false,
      formData: {
        locationName: '',
        address: '',
        longitude: 0,
        latitude: 0,
        imageUrls: [],
        markers: [],
        communityId: 1,
        checkinType: 1,
        remark: ''
      },
      checkinTypes: [
        { label: '正常巡逻', value: 1 },
        { label: '异常情况', value: 2 },
        { label: '紧急处理', value: 3 }
      ]
    }
  },
  computed: {
    canSubmit() {
      return this.formData.locationName.trim() && this.formData.address.trim() && !this.loading
    }
  },
  onLoad() {
    this.getCurrentLocation()
    // let longitude = 106.28847
    // let latitude = 38.47371
    // this.formData.longitude = longitude
    // this.formData.latitude = latitude
    // this.formData.markers = [{ longitude, latitude, iconPath: iconPath, width: 35, height: 35 }]
  },
  methods: {
    getCurrentLocation() {
      uni.showLoading({title: '获取位置中...'})

      // #ifdef MP-WEIXIN
      // 先检查用户是否已授权位置权限
      uni.getSetting({
        success: (settingRes) => {
          if (settingRes.authSetting['scope.userLocation'] === false) {
            // 用户之前拒绝过位置权限，引导用户去设置页面开启
            uni.hideLoading()
            uni.showModal({
              title: '位置权限未开启',
              content: '需要获取您的位置信息用于打卡记录，请在设置中开启位置权限',
              confirmText: '去设置',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  uni.openSetting({
                    success: (openRes) => {
                      if (openRes.authSetting['scope.userLocation']) {
                        this.getLocation()
                      }
                    }
                  })
                }
              }
            })
          } else {
            // 直接获取位置（会自动请求权限）
            this.getLocation()
          }
        },
        fail: () => {
          // 获取设置失败，直接尝试获取位置
          this.getLocation()
        }
      })
      // #endif

      // #ifdef H5 | WEB
      this.getLocation()
      // #endif
    },

    // 实际获取位置的方法
    getLocation() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          console.log('获取位置成功:', res)
          let longitude = res.longitude
          let latitude = res.latitude
          this.formData.longitude = longitude
          this.formData.latitude = latitude
          // 可以根据经纬度逆地理编码获取详细地址
          this.getAddressByLocation(longitude, latitude)
          uni.hideLoading()
          uni.showToast({ title: '位置获取成功', icon: 'success' })
        },
        fail: (error) => {
          console.error('获取位置失败:', error)
          uni.hideLoading()
          if (error.errMsg.includes('auth deny')) {
            // 用户拒绝授权
            uni.showModal({
              title: '位置权限被拒绝',
              content: '需要位置权限才能获取当前位置，您可以手动输入地址信息',
              showCancel: true,
              confirmText: '重新授权',
              cancelText: '手动输入',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  this.getCurrentLocation()
                }
              }
            })
          } else {
            // 其他错误
            uni.showModal({
              title: '位置获取失败',
              content: `无法获取当前位置：${error.errMsg || '未知错误'}，请检查定位权限或手动输入地址`,
              showCancel: false
            })
          }
        }
      })
    },

    // 获取详细地址
    getAddressByLocation(longitude, latitude) {
      // this.formData.markers = [{ longitude, latitude, iconPath: iconPath, width: 35, height: 35 }]
      geocoderLocation({ location: latitude + ',' + longitude }).then(res => {
        let address = res.address || {}
        let formatted_addresses = res.formatted_addresses || {}
        this.formData.address = address
        this.formData.locationName = formatted_addresses.recommend
      })
    },

    selectCheckinType(type) {
      this.formData.checkinType = type
    },

    // 上传图片
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.formData.imageUrls.length,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          let tempFiles = res.tempFiles[0]
          uploadFile(tempFiles.path, tempFiles).then(res => {
            let url = res.url
            this.formData.imageUrls.push(url)
          })
        }
      })
    },


    deleteImage(index) {
      this.formData.imageUrls.splice(index, 1)
    },

    // 提交打卡
    submitCheckin() {
      if (!this.canSubmit) {
        uni.showToast({title: '请填写必要信息', icon: 'none'})
        return
      }

      this.loading = true

      const submitData = {
        ...this.formData,
        longitude: this.formData.longitude || 0,
        latitude: this.formData.latitude || 0
      }

      securityCheckin(submitData)
        .then(response => {
          console.log('打卡成功:', response)
          uni.showToast({ title: '打卡成功', icon: 'success', duration: 2000 })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        })
        .catch(error => {
          console.error('打卡失败:', error)
          uni.showToast({
            title: '打卡失败，请重试',
            icon: 'none',
            duration: 2000
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.security-checkin-page {
  min-height: 100vh;
  background: linear-gradient(to right, #e0ecfa 0%, #f4f6f9 50%, #f6f4fc 100%);


  .form-container {
    padding: 50rpx 30rpx 200rpx 30rpx;
  }

  .form-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    backdrop-filter: blur(10px);
    border: 1rpx solid rgba(255, 255, 255, 0.3);

    .card-title {
      display: flex;
      align-items: center;
      margin-bottom: 25rpx;
      padding-bottom: 15rpx;
      border-bottom: 1rpx solid rgba(59, 85, 152, 0.1);

      text {
        margin-left: 10rpx;
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }

      .optional {
        margin-left: 10rpx;
        font-size: 24rpx;
        color: #999;
        font-weight: normal;
      }
    }

    .form-item {
      margin-bottom: 25rpx;

      .label {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 15rpx;
        font-weight: 500;
      }

      .input {
        width: auto;
        height: 80rpx;
        background: #f8f9fa;
        border-radius: 15rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #333;
        border: 1rpx solid #e9ecef;

        &:focus {
          border-color: #3b5598;
          background: #fff;
        }
      }
    }

    .location-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80rpx;
      background: linear-gradient(135deg, #3b5598 0%, #5a7bcd 100%);
      border-radius: 15rpx;
      color: white;
      font-size: 28rpx;
      transition: all 0.3s ease;

      text {
        margin-left: 10rpx;
      }

      &:active {
        transform: translateY(2rpx);
        opacity: 0.9;
      }
    }

    .radio-group {
      .radio-item {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);

        &:last-child {
          border-bottom: none;
        }

        .radio-icon {
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
          border: 2rpx solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20rpx;
          transition: all 0.3s ease;

          &.active {
            border-color: #3b5598;
            background: #3b5598;

            .radio-dot {
              width: 20rpx;
              height: 20rpx;
              border-radius: 50%;
              background: white;
            }
          }
        }

        .radio-label {
          font-size: 28rpx;
          color: #333;
        }
      }
    }

    .image-upload {
      .image-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        margin-bottom: 15rpx;

        .image-item {
          position: relative;
          width: 160rpx;
          height: 160rpx;
          border-radius: 15rpx;
          overflow: hidden;

          .uploaded-image {
            width: 100%;
            height: 100%;
          }

          .delete-btn {
            position: absolute;
            top: -10rpx;
            right: -10rpx;
            width: 40rpx;
            height: 40rpx;
            background: #f5222d;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3rpx solid white;
          }
        }

        .upload-btn {
          width: 160rpx;
          height: 160rpx;
          border: 2rpx dashed #ddd;
          border-radius: 15rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;

          .upload-text {
            font-size: 24rpx;
            color: #999;
            margin-top: 10rpx;
          }
        }
      }

      .upload-tip {
        font-size: 24rpx;
        color: #999;
      }
    }

    .textarea {
      width: auto;
      min-height: 200rpx;
      background: #f8f9fa;
      border-radius: 15rpx;
      padding: 20rpx;
      font-size: 28rpx;
      color: #333;
      border: 1rpx solid #e9ecef;
      resize: none;

      &:focus {
        border-color: #3b5598;
        background: #fff;
      }
    }

    .char-count {
      text-align: right;
      font-size: 24rpx;
      color: #999;
      margin-top: 10rpx;
    }
  }

  .submit-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1rpx solid rgba(0, 0, 0, 0.05);

    .submit-btn {
      width: 100%;
      height: 88rpx;
      background: linear-gradient(135deg, #3b5598 0%, #5a7bcd 100%);
      border-radius: 25rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 32rpx;
      font-weight: 600;
      border: none;
      transition: all 0.3s ease;

      &:disabled {
        opacity: 0.6;
        transform: none;
      }

      &:active:not(:disabled) {
        transform: translateY(2rpx);
      }

      text {
        margin-left: 10rpx;
      }
    }
  }
}
</style>
