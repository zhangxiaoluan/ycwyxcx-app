<template>
  <view class="identity-verification-page">
    <view class="content">
      <view class="verification-status" :class="{ verified: isVerified }">
        <view class="status-icon">
          <u-icon name="checkmark-circle" size="60" :color="isVerified ? '#07c160' : '#ccc'"></u-icon>
        </view>
        <text class="status-text">{{ isVerified ? '已认证' : '未认证' }}</text>
        <text class="status-desc">{{ isVerified ? '您已完成实名认证' : '请完成实名认证以使用更多功能' }}</text>
      </view>

      <view class="verification-form" v-if="!isVerified">
        <view class="form-title">
          <text>身份信息</text>
          <text class="required">*</text>
          <text class="required-text">为必填项</text>
        </view>

        <view class="form-item">
          <text class="form-label">姓名<text class="required">*</text></text>
          <input v-model="formData.name" class="form-input" placeholder="请输入真实姓名" />
        </view>

        <view class="form-item">
          <text class="form-label">身份证号<text class="required">*</text></text>
          <input v-model="formData.idCard" class="form-input" placeholder="请输入18位身份证号" maxlength="18" />
        </view>

        <view class="form-item">
          <text class="form-label">手机号<text class="required">*</text></text>
          <input v-model="formData.phone" class="form-input" placeholder="请输入手机号" type="number" />
        </view>

        <view class="upload-section">
          <view class="upload-title">
            <text>证件照片</text>
            <text class="required">*</text>
          </view>

          <view class="upload-grid">
            <view class="upload-item" @click="uploadIdCard('front')">
              <image v-if="formData.idCardFront" :src="formData.idCardFront" class="preview-image" mode="aspectFit"></image>
              <view v-else class="upload-placeholder">
                <u-icon name="camera" size="40" color="#999"></u-icon>
                <text class="upload-text">身份证正面</text>
              </view>
            </view>

            <view class="upload-item" @click="uploadIdCard('back')">
              <image v-if="formData.idCardBack" :src="formData.idCardBack" class="preview-image" mode="aspectFit"></image>
              <view v-else class="upload-placeholder">
                <u-icon name="camera" size="40" color="#999"></u-icon>
                <text class="upload-text">身份证反面</text>
              </view>
            </view>
          </view>
        </view>

        <view class="agreement">
          <checkbox-group @change="onAgreementChange">
            <checkbox value="agreed" color="#3b5598" style="transform:scale(0.7)" :checked="agreedToTerms">
            </checkbox>
            <text class="agreement-text">
              我已阅读并同意
              <text class="link-a">《实名认证服务协议》</text>
            </text>
          </checkbox-group>
        </view>

        <!--  :disabled="!canSubmit"  -->
        <button class="submit-btn"  @click="submitVerification">
          提交认证
        </button>
      </view>

      <view class="verified-info" v-else>
        <view class="info-card">
          <view class="info-item">
            <text class="info-label">认证姓名：</text>
            <text class="info-value">{{ verifiedInfo.name }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">身份证号：</text>
            <text class="info-value">{{ maskIdCard(verifiedInfo.idCard) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">认证时间：</text>
            <text class="info-value">{{ verifiedInfo.verifiedTime }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isVerified: false,
      agreedToTerms: false,
      formData: {
        name: '',
        idCard: '',
        phone: '',
        idCardFront: '',
        idCardBack: ''
      },
      verifiedInfo: {
        name: '张三',
        idCard: '110101199001011234',
        verifiedTime: '2024-11-10 14:30'
      }
    }
  },
  computed: {
    canSubmit() {
      return this.formData.name &&
             this.formData.idCard &&
             this.formData.phone &&
             this.formData.idCardFront &&
             this.formData.idCardBack &&
             this.agreedToTerms &&
             this.validateIdCard(this.formData.idCard) &&
             this.validatePhone(this.formData.phone)
    }
  },
  onLoad() {
    // 检查是否已认证
    this.checkVerificationStatus()
  },
  methods: {
    checkVerificationStatus() {
      // 实际应用中这里会调用接口检查认证状态
      this.isVerified = false
    },

    uploadIdCard(type) {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          if (type === 'front') {
            this.formData.idCardFront = res.tempFilePaths[0]
          } else {
            this.formData.idCardBack = res.tempFilePaths[0]
          }
        }
      })
    },

    onAgreementChange(e) {
      this.agreedToTerms = e.detail.value.includes('agreed')
    },

    validateIdCard(idCard) {
      return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(idCard)
    },

    validatePhone(phone) {
      return /^1[3-9]\d{9}$/.test(phone)
    },

    submitVerification() {
      if (!this.canSubmit) {
        uni.showToast({
          title: '请完善所有信息',
          icon: 'none'
        })
        return
      }

      uni.showLoading({
        title: '提交中...'
      })

      // 模拟提交
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 2000)
    },

    maskIdCard(idCard) {
      if (!idCard || idCard.length < 10) return idCard
      return idCard.substring(0, 6) + '********' + idCard.substring(idCard.length - 4)
    }
  }
}
</script>

<style lang="scss">
.identity-verification-page {
  background: #f5f5f5;
  min-height: 100vh;


  .content {
    padding: 30rpx;

    .verification-status {
      background: white;
      border-radius: 16rpx;
      padding: 60rpx 30rpx;
      text-align: center;
      margin-bottom: 30rpx;

      &.verified {
        .status-icon {
          .u-icon {
            color: #07c160 !important;
            justify-content: center;
          }
        }

        .status-text {
          color: #07c160;
        }
      }

      .status-icon {
        margin-bottom: 20rpx;
        .u-icon {
          color: #07c160 !important;
          justify-content: center;
        }
      }

      .status-text {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        color: #8c1a11;
        margin-bottom: 10rpx;
      }

      .status-desc {
        font-size: 26rpx;
        color: #999;
      }
    }

    .verification-form {
      background: white;
      border-radius: 16rpx;
      padding: 40rpx 30rpx;

      .form-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 30rpx;
        display: flex;
        align-items: center;

        .required {
          color: #f5222d;
          margin-left: 4rpx;
        }

        .required-text {
          font-size: 24rpx;
          color: #999;
          font-weight: normal;
          margin-left: 10rpx;
        }
      }

      .form-item {
        margin-bottom: 30rpx;

        .form-label {
          display: block;
          font-size: 28rpx;
          color: #333;
          margin-bottom: 15rpx;
          font-weight: 500;

          .required {
            color: #f5222d;
            margin-left: 4rpx;
          }
        }

        .form-input {
          height: 80rpx;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          padding: 0 20rpx;
          font-size: 28rpx;
          background: #fafafa;
        }
      }

      .upload-section {
        margin-bottom: 30rpx;

        .upload-title {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 20rpx;
          font-weight: 500;
          display: flex;
          align-items: center;

          .required {
            color: #f5222d;
            margin-left: 4rpx;
          }
        }

        .upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20rpx;

          .upload-item {
            border: 2rpx dashed #d9d9d9;
            border-radius: 12rpx;
            padding: 20rpx;
            text-align: center;
            transition: border-color 0.3s;

            &:active {
              border-color: #3b5598;
            }

            .preview-image {
              width: 100%;
              height: 200rpx;
              border-radius: 8rpx;
            }

            .upload-placeholder {
              .u-icon{
                justify-content: center;
              }
              .upload-text {
                display: block;
                font-size: 24rpx;
                color: #999;
                margin-top: 16rpx;
              }
            }
          }
        }
      }

      .agreement {
        display: flex;
        align-items: flex-start;
        margin-bottom: 40rpx;

        checkbox-group {
          margin-right: 15rpx;
        }

        .agreement-text {
          font-size: 24rpx;
          color: #666;
          line-height: 1.5;
          flex: 1;
          .link-a{
            color: #3b5598;
          }
        }
      }

      .submit-btn {
        width: 100%;
        height: 80rpx;
        background: #3b5598;
        color: white;
        border: none;
        border-radius: 8rpx;
        font-size: 30rpx;
        font-weight: 600;

        &:disabled {
          background: #ccc;
        }
      }
    }

    .verified-info {
      background: white;
      border-radius: 16rpx;
      padding: 40rpx 30rpx;

      .info-card {
        background: #f8f9fa;
        border-radius: 12rpx;
        padding: 30rpx;

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15rpx 0;
          border-bottom: 1rpx solid #e0e0e0;

          &:last-child {
            border-bottom: none;
          }

          .info-label {
            font-size: 28rpx;
            color: #666;
          }

          .info-value {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
