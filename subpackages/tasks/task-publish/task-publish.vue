<template>
  <view class="task-publish-page">


    <view class="content">
      <view class="form-section">
        <view class="form-item required">
          <text class="form-label">任务类型</text>
          <view class="type-selector">
            <view
              class="type-item"
              :class="{ active: formData.type === item.value }"
              v-for="item in taskTypes"
              :key="item.value"
              @click="selectType(item.value)"
            >
              <u-icon :name="item.icon" size="24" :color="formData.type === item.value ? '#fff' : item.color"></u-icon>
              <text>{{ item.label }}</text>
            </view>
          </view>
        </view>

        <view class="form-item required">
          <text class="form-label">任务标题</text>
          <input
            v-model="formData.title"
            class="form-input"
            placeholder="请简要描述您的任务需求"
            maxlength="50"
          />
          <text class="input-count">{{ formData.title.length }}/50</text>
        </view>

        <view class="form-item required">
          <text class="form-label">任务描述</text>
          <textarea
            v-model="formData.description"
            class="form-textarea"
            placeholder="请详细描述您的任务需求，包括具体要求、注意事项等"
            maxlength="500"
          ></textarea>
          <text class="input-count">{{ formData.description.length }}/500</text>
        </view>

        <view class="form-item">
          <text class="form-label">任务要求</text>
          <view class="requirements-list">
            <view class="requirement-item" v-for="(req, index) in formData.requirements" :key="index">
              <input
                v-model="formData.requirements[index]"
                class="requirement-input"
                placeholder="输入具体要求"
              />
              <button class="remove-btn" @click="removeRequirement(index)" v-if="formData.requirements.length > 1">
                <u-icon name="trash" size="16" color="#f5222d"></u-icon>
              </button>
            </view>
            <button class="add-btn" @click="addRequirement">
              <u-icon name="plus" size="16" color="#3b5598"></u-icon>
              <text>添加要求</text>
            </button>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">任务图片</text>
          <view class="image-upload">
            <view class="image-list">
              <view class="image-item" v-for="(image, index) in formData.images" :key="index">
                <image :src="image" mode="aspectFill" @click="previewImage(index)"></image>
                <button class="delete-image" @click="deleteImage(index)">
                  <u-icon name="close" size="14" color="#fff"></u-icon>
                </button>
              </view>
              <view class="upload-btn" @click="chooseImage" v-if="formData.images.length < 6">
                <u-icon name="camera" size="32" color="#999"></u-icon>
                <text class="upload-text">添加图片</text>
                <text class="upload-tips">最多6张</text>
              </view>
            </view>
          </view>
        </view>

        <view class="form-item required">
          <text class="form-label">截止时间</text>
          <picker
            mode="date"
            :value="formData.deadline"
            @change="onDeadlineChange"
            :start="minDate"
          >
            <view class="picker">
              {{ formData.deadline || '请选择截止时间' }}
            </view>
          </picker>
        </view>

        <view class="form-item required">
          <text class="form-label">任务奖励</text>
          <view class="reward-selector">
            <view
              class="reward-type"
              :class="{ active: formData.rewardType === item.value }"
              v-for="item in rewardTypes"
              :key="item.value"
              @click="selectRewardType(item.value)"
            >
              <text>{{ item.label }}</text>
            </view>
          </view>
          <view class="reward-input-wrapper" v-if="formData.rewardType">
            <input
              v-model="formData.reward"
              class="reward-input"
              :placeholder="'请输入' + getRewardPlaceholder(formData.rewardType)"
              type="digit"
            />
            <text class="reward-unit">{{ getRewardUnit(formData.rewardType) }}</text>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">奖励说明</text>
          <textarea
            v-model="formData.rewardDesc"
            class="form-textarea"
            placeholder="可选：补充说明奖励发放条件等"
            maxlength="200"
          ></textarea>
        </view>

        <view class="form-item">
          <text class="form-label">联系方式</text>
          <radio-group @change="onContactChange">
            <label class="contact-option">
              <radio value="app" :checked="formData.contactMethod === 'app'" />
              <text>通过APP内消息联系</text>
            </label>
            <label class="contact-option">
              <radio value="phone" :checked="formData.contactMethod === 'phone'" />
              <text>通过电话联系</text>
            </label>
            <label class="contact-option">
              <radio value="both" :checked="formData.contactMethod === 'both'" />
              <text>APP消息和电话都可以</text>
            </label>
          </radio-group>
        </view>
      </view>

      <view class="notice-section">
        <view class="notice-title">
          <u-icon name="info-circle" size="20" color="#3b5598"></u-icon>
          <text>发布须知</text>
        </view>
        <view class="notice-list">
          <text class="notice-item">• 请确保任务描述真实准确，避免误导</text>
          <text class="notice-item">• 任务内容需符合法律法规，禁止发布违法信息</text>
          <text class="notice-item">• 请合理设置任务奖励，过低奖励可能影响接单率</text>
          <text class="notice-item">• 发布后将扣除相应的诚信保证金</text>
          <text class="notice-item">• 任务完成后请及时确认并发放奖励</text>
        </view>
      </view>

      <view class="agreement">
        <checkbox-group @change="onAgreementChange">
          <checkbox value="agreed" :checked="agreedToTerms">
          </checkbox>
          <text class="agreement-text">
            我已阅读并同意《任务发布服务协议》
          </text>
        </checkbox-group>
      </view>

      <button class="submit-btn" :disabled="!canSubmit" @click="submitTask">
        发布任务
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      agreedToTerms: false,
      minDate: '',
      taskTypes: [
        { label: '维修服务', value: 'repair', icon: 'hammer', color: '#ff6b35' },
        { label: '家政服务', value: 'cleaning', icon: 'broom', color: '#07c160' },
        { label: '配送服务', value: 'delivery', icon: 'shopping-cart', color: '#3b5598' },
        { label: '其他服务', value: 'other', icon: 'help-circle', color: '#9c27b0' }
      ],
      rewardTypes: [
        { label: '现金奖励', value: 'cash' },
        { label: '积分奖励', value: 'points' },
        { label: '服务兑换', value: 'service' }
      ],
      formData: {
        type: '',
        title: '',
        description: '',
        requirements: [''],
        images: [],
        deadline: '',
        rewardType: '',
        reward: '',
        rewardDesc: '',
        contactMethod: 'app'
      }
    }
  },
  computed: {
    canSubmit() {
      return this.formData.type &&
             this.formData.title.trim() &&
             this.formData.description.trim() &&
             this.formData.deadline &&
             this.formData.rewardType &&
             this.formData.reward.trim() &&
             this.agreedToTerms
    }
  },
  onLoad() {
    this.initForm()
  },
  methods: {
    initForm() {
      // 设置最小日期为明天
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      this.minDate = this.formatDate(tomorrow)
    },

    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    selectType(type) {
      this.formData.type = type
    },

    selectRewardType(type) {
      this.formData.rewardType = type
      this.formData.reward = ''
    },

    getRewardPlaceholder(type) {
      const placeholders = {
        cash: '奖励金额',
        points: '积分数额',
        service: '服务内容'
      }
      return placeholders[type] || ''
    },

    getRewardUnit(type) {
      const units = {
        cash: '元',
        points: '积分',
        service: ''
      }
      return units[type] || ''
    },

    addRequirement() {
      this.formData.requirements.push('')
    },

    removeRequirement(index) {
      this.formData.requirements.splice(index, 1)
    },

    chooseImage() {
      const maxCount = 6 - this.formData.images.length
      uni.chooseImage({
        count: maxCount,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.formData.images.push(...res.tempFilePaths)
        }
      })
    },

    deleteImage(index) {
      this.formData.images.splice(index, 1)
    },

    previewImage(index) {
      uni.previewImage({
        urls: this.formData.images,
        current: index
      })
    },

    onDeadlineChange(e) {
      this.formData.deadline = e.detail.value
    },

    onContactChange(e) {
      this.formData.contactMethod = e.detail.value[0] || 'app'
    },

    onAgreementChange(e) {
      this.agreedToTerms = e.detail.value.includes('agreed')
    },

    validateForm() {
      if (!this.formData.type) {
        uni.showToast({
          title: '请选择任务类型',
          icon: 'none'
        })
        return false
      }

      if (!this.formData.title.trim()) {
        uni.showToast({
          title: '请输入任务标题',
          icon: 'none'
        })
        return false
      }

      if (!this.formData.description.trim()) {
        uni.showToast({
          title: '请输入任务描述',
          icon: 'none'
        })
        return false
      }

      if (!this.formData.deadline) {
        uni.showToast({
          title: '请选择截止时间',
          icon: 'none'
        })
        return false
      }

      if (!this.formData.rewardType) {
        uni.showToast({
          title: '请选择奖励类型',
          icon: 'none'
        })
        return false
      }

      if (!this.formData.reward.trim()) {
        uni.showToast({
          title: '请输入奖励内容',
          icon: 'none'
        })
        return false
      }

      if (!this.agreedToTerms) {
        uni.showToast({
          title: '请同意服务协议',
          icon: 'none'
        })
        return false
      }

      return true
    },

    submitTask() {
      if (!this.validateForm()) {
        return
      }

      // 过滤空的要求项
      this.formData.requirements = this.formData.requirements.filter(req => req.trim())

      uni.showLoading({
        title: '发布中...'
      })

      // 模拟提交
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '任务发布成功',
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
.task-publish-page {
  background: #f5f5f5;
  min-height: 100vh;

  .header {
    background: #3b5598;
    padding: 40rpx 30rpx;
    color: white;

    .title {
      font-size: 36rpx;
      font-weight: 600;
    }
  }

  .content {
    padding: 30rpx;

    .form-section {
      background: white;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 30rpx;

      .form-item {
        margin-bottom: 40rpx;

        &.required {
          .form-label::after {
            content: ' *';
            color: #f5222d;
          }
        }

        &:last-child {
          margin-bottom: 0;
        }

        .form-label {
          display: block;
          font-size: 28rpx;
          color: #333;
          margin-bottom: 15rpx;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          height: 80rpx;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          padding: 0 20rpx;
          font-size: 28rpx;
          background: #fafafa;
        }

        .form-textarea {
          width: 100%;
          min-height: 120rpx;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          padding: 20rpx;
          font-size: 28rpx;
          background: #fafafa;
          line-height: 1.5;
        }

        .input-count {
          font-size: 22rpx;
          color: #999;
          text-align: right;
          display: block;
          margin-top: 8rpx;
        }

        .type-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15rpx;

          .type-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 25rpx 15rpx;
            border: 2rpx solid #e0e0e0;
            border-radius: 12rpx;
            transition: all 0.3s;

            text {
              font-size: 24rpx;
              color: #666;
              margin-top: 12rpx;
            }

            &.active {
              border-color: #3b5598;
              background: rgba(59, 85, 152, 0.1);

              text {
                color: #3b5598;
                font-weight: 500;
              }
            }
          }
        }

        .requirements-list {
          .requirement-item {
            display: flex;
            align-items: center;
            margin-bottom: 15rpx;

            .requirement-input {
              flex: 1;
              height: 70rpx;
              border: 1rpx solid #e0e0e0;
              border-radius: 8rpx;
              padding: 0 20rpx;
              font-size: 26rpx;
              background: #fafafa;
              margin-right: 15rpx;
            }

            .remove-btn {
              width: 60rpx;
              height: 60rpx;
              border-radius: 50%;
              border: 1rpx solid #f5222d;
              background: white;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          .add-btn {
            width: 100%;
            height: 60rpx;
            border: 2rpx dashed #d9d9d9;
            border-radius: 8rpx;
            background: #fafafa;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;
            color: #3b5598;

            text {
              margin-left: 8rpx;
            }
          }
        }

        .image-upload {
          .image-list {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15rpx;

            .image-item {
              position: relative;
              width: 100%;
              padding-top: 100%;
              border-radius: 8rpx;
              overflow: hidden;

              image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              }

              .delete-image {
                position: absolute;
                top: 6rpx;
                right: 6rpx;
                width: 36rpx;
                height: 36rpx;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.6);
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }

            .upload-btn {
              padding-top: 100%;
              position: relative;
              border: 2rpx dashed #d9d9d9;
              border-radius: 8rpx;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;

              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }

              .upload-text {
                font-size: 24rpx;
                color: #999;
                margin-top: 8rpx;
              }

              .upload-tips {
                font-size: 20rpx;
                color: #ccc;
                margin-top: 4rpx;
              }
            }
          }
        }

        .picker {
          width: 100%;
          height: 80rpx;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          padding: 0 20rpx;
          font-size: 28rpx;
          color: #333;
          background: #fafafa;
          display: flex;
          align-items: center;
        }

        .reward-selector {
          display: flex;
          gap: 15rpx;
          margin-bottom: 15rpx;

          .reward-type {
            flex: 1;
            height: 60rpx;
            border: 1rpx solid #e0e0e0;
            border-radius: 8rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26rpx;
            color: #666;
            transition: all 0.3s;

            &.active {
              border-color: #3b5598;
              background: rgba(59, 85, 152, 0.1);
              color: #3b5598;
              font-weight: 500;
            }
          }
        }

        .reward-input-wrapper {
          display: flex;
          align-items: center;

          .reward-input {
            flex: 1;
            height: 80rpx;
            border: 1rpx solid #e0e0e0;
            border-radius: 8rpx 0 0 8rpx;
            padding: 0 20rpx;
            font-size: 28rpx;
            background: #fafafa;
            border-right: none;
          }

          .reward-unit {
            height: 80rpx;
            width: 80rpx;
            border: 1rpx solid #e0e0e0;
            border-radius: 0 8rpx 8rpx 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26rpx;
            color: #666;
            background: #fafafa;
          }
        }

        .contact-option {
          display: flex;
          align-items: center;
          margin-bottom: 15rpx;

          text {
            margin-left: 15rpx;
            font-size: 26rpx;
            color: #333;
          }
        }
      }
    }

    .notice-section {
      background: white;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 30rpx;

      .notice-title {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #333;
        font-weight: 600;
        margin-bottom: 20rpx;

        text {
          margin-left: 10rpx;
        }
      }

      .notice-list {
        .notice-item {
          display: block;
          font-size: 24rpx;
          color: #666;
          line-height: 1.6;
          margin-bottom: 10rpx;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .agreement {
      background: white;
      border-radius: 16rpx;
      padding: 25rpx 30rpx;
      margin-bottom: 30rpx;

      checkbox-group {
        display: flex;
        align-items: center;

        text {
          margin-left: 15rpx;
          font-size: 26rpx;
          color: #333;
          line-height: 1.5;
          flex: 1;
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
}
</style>
