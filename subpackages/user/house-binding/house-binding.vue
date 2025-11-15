<template>
  <view class="house-binding-page">
    <view class="content">
      <view class="binding-steps">
        <view class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <view class="step-number">1</view>
          <text class="step-text">基本信息</text>
        </view>
        <view class="step-line"></view>
        <view class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <view class="step-number">2</view>
          <text class="step-text">上传房产证</text>
        </view>
        <view class="step-line"></view>
        <view class="step-item" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
          <view class="step-number">3</view>
          <text class="step-text">身份验证</text>
        </view>
      </view>

      <view class="form-section" v-if="currentStep === 1">
        <view class="form-item">
          <text class="label">小区名称</text>
          <input v-model="formData.communityName" class="input" placeholder="请输入小区名称" />
        </view>

        <view class="form-item">
          <text class="label">楼栋号</text>
          <input v-model="formData.buildingNumber" class="input" placeholder="请输入楼栋号" />
        </view>

        <view class="form-item">
          <text class="label">单元号</text>
          <input v-model="formData.unitNumber" class="input" placeholder="请输入单元号" />
        </view>

        <view class="form-item">
          <text class="label">房号</text>
          <input v-model="formData.roomNumber" class="input" placeholder="请输入房号" />
        </view>

        <button class="next-btn" @click="nextStep">下一步</button>
      </view>

      <view class="upload-section" v-if="currentStep === 2">
        <view class="upload-title">
          <text>上传房产证照片</text>
          <text class="upload-tips">请上传清晰的房产证照片，确保信息完整可见</text>
        </view>

        <view class="upload-area" @click="chooseImage">
          <image v-if="formData.propertyImage" :src="formData.propertyImage" class="preview-image" mode="aspectFit"></image>
          <view v-else class="upload-placeholder">
            <text class="upload-icon">📷</text>
            <text class="upload-text">点击上传房产证</text>
          </view>
        </view>

        <view class="upload-tips-detail">
          <text>• 请确保照片清晰完整</text>
          <text>• 所有信息必须可识别</text>
          <text>• 支持jpg、png格式</text>
          <text>• 文件大小不超过5MB</text>
        </view>

        <view class="button-group">
          <button class="prev-btn" @click="prevStep">上一步</button>
          <button class="next-btn" @click="nextStep">下一步</button>
        </view>
      </view>

      <view class="verify-section" v-if="currentStep === 3">
        <view class="verify-info">
          <text class="verify-title">身份验证</text>
          <text class="verify-desc">请确认您的身份信息，我们将进行核实</text>
        </view>

        <view class="info-card">
          <text class="card-title">房屋信息</text>
          <view class="info-item">
            <text class="info-label">小区：</text>
            <text class="info-value">{{ formData.communityName }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">地址：</text>
            <text class="info-value">{{ formData.buildingNumber }}-{{ formData.unitNumber }}-{{ formData.roomNumber }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">房产证：</text>
            <text class="info-value">{{ formData.propertyImage ? '已上传' : '未上传' }}</text>
          </view>
        </view>

        <view class="agreement">
          <checkbox-group @change="onAgreementChange">
            <checkbox value="agreed" color="#3b5598" :checked="agreedToTerms" style="transform:scale(0.7)" ></checkbox>
            <text class="agreement-text">
              我已阅读并同意《房屋绑定服务协议》和《隐私政策》
            </text>
          </checkbox-group>
        </view>

        <view class="button-group">
          <button class="prev-btn" @click="prevStep">上一步</button>
          <button class="submit-btn" :disabled="!canSubmit" @click="submitBinding">提交审核</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1,
      agreedToTerms: false,
      formData: {
        communityName: '',
        buildingNumber: '',
        unitNumber: '',
        roomNumber: '',
        propertyImage: ''
      }
    }
  },
  computed: {
    canSubmit() {
      return this.formData.communityName &&
             this.formData.buildingNumber &&
             this.formData.unitNumber &&
             this.formData.roomNumber &&
             this.formData.propertyImage &&
             this.agreedToTerms
    }
  },
  methods: {
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.formData.propertyImage = res.tempFilePaths[0]
        }
      })
    },

    onAgreementChange(e) {
      this.agreedToTerms = e.detail.value.includes('agreed')
    },

    submitBinding() {
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
    }
  }
}
</script>

<style lang="scss">
.house-binding-page {
  background: #f5f5f5;
  min-height: 100vh;


  .content {
    padding: 35rpx;

    .binding-steps {
      background: white;
      border-radius: 16rpx;
      padding: 40rpx 30rpx;
      margin-bottom: 30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .step-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;

        .step-number {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          background: #f0f0f0;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24rpx;
          font-weight: 600;
          margin-bottom: 10rpx;
        }

        .step-text {
          font-size: 24rpx;
          color: #666;
        }

        &.active .step-number {
          background: #3b5598;
          color: white;
        }

        &.active .step-text {
          color: #3b5598;
          font-weight: 600;
        }

        &.completed .step-number {
          background: #52c41a;
          color: white;
        }
      }

      .step-line {
        flex: 1;
        height: 2rpx;
        background: #e0e0e0;
        margin: 0 10rpx;
      }
    }

    .form-section, .upload-section, .verify-section {
      background: white;
      border-radius: 16rpx;
      padding: 40rpx 30rpx;

      .form-item {
        margin-bottom: 30rpx;

        .label {
          display: block;
          font-size: 28rpx;
          color: #333;
          margin-bottom: 15rpx;
          font-weight: 500;
        }

        .input {
          height: 80rpx;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          padding: 0 20rpx;
          font-size: 28rpx;
        }
      }

      .next-btn, .submit-btn {
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

      .prev-btn {
        width: 45%;
        height: 80rpx;
        background: #f0f0f0;
        color: #333;
        border: none;
        border-radius: 8rpx;
        font-size: 28rpx;
        font-weight: 600;
      }

      .button-group {
        display: flex;
        gap: 20rpx;
        margin-top: 40rpx;

        .next-btn, .submit-btn {
          flex: 1;
        }
      }
    }

    .upload-section {
      .upload-title {
        text {
          display: block;
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 10rpx;
        }

        .upload-tips {
          font-size: 24rpx;
          color: #999;
        }
      }

      .upload-area {
        border: 2rpx dashed #d9d9d9;
        border-radius: 12rpx;
        padding: 60rpx 30rpx;
        text-align: center;
        margin: 30rpx 0;

        .preview-image {
          width: 400rpx;
          height: 300rpx;
          border-radius: 8rpx;
        }

        .upload-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          .upload-icon {
            font-size: 60rpx;
            margin-bottom: 20rpx;
          }

          .upload-text {
            font-size: 28rpx;
            color: #999;
            margin-left: 15rpx;
            margin-top: -8rpx;
          }
        }
      }

      .upload-tips-detail {
        background: #f8f9fa;
        border-radius: 8rpx;
        padding: 20rpx;
        margin-top: 20rpx;

        text {
          display: block;
          font-size: 24rpx;
          color: #666;
          line-height: 1.6;
          margin-bottom: 8rpx;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .verify-section {
      .verify-info {
        text-align: center;
        margin-bottom: 40rpx;

        .verify-title {
          display: block;
          font-size: 32rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 10rpx;
        }

        .verify-desc {
          font-size: 26rpx;
          color: #666;
        }
      }

      .info-card {
        background: #f8f9fa;
        border-radius: 12rpx;
        padding: 30rpx;
        margin-bottom: 30rpx;

        .card-title {
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 20rpx;
        }

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
            font-size: 26rpx;
            color: #666;
          }

          .info-value {
            font-size: 26rpx;
            color: #333;
            font-weight: 500;
          }
        }
      }

      .agreement {
        display: flex;
        align-items: flex-start;
        margin-bottom: 30rpx;
        justify-content: center;

        .agreement-text {
          font-size: 24rpx;
          color: #666;
          line-height: 1.5;
          flex: 1;
        }
      }
    }
  }
}
</style>
