<template>
  <view class="feedback-page">
    <view class="content">
      <view class="form-section">
        <view class="form-item required">
          <text class="form-label">反馈类型</text>
          <view class="type-selector">
            <view
              class="type-item"
              :class="{ active: formData.type === item.value }"
              v-for="item in feedbackTypes"
              :key="item.value"
              @click="selectType(item.value)"
            >
              <u-icon :name="item.icon" size="24" :color="formData.type === item.value ? '#fff' : item.color"></u-icon>
              <text>{{ item.label }}</text>
            </view>
          </view>
        </view>

        <view class="form-item required">
          <text class="form-label">反馈标题</text>
          <input
            v-model="formData.title"
            class="form-input"
            placeholder="请简要描述您的问题或建议"
            maxlength="50"
          />
          <text class="input-count">{{ formData.title.length }}/50</text>
        </view>

        <view class="form-item required">
          <text class="form-label">详细描述</text>
          <textarea
            v-model="formData.content"
            class="form-textarea"
            placeholder="请详细描述您的问题或建议，我们会认真处理每一条反馈"
            maxlength="500"
          ></textarea>
          <text class="input-count">{{ formData.content.length }}/500</text>
        </view>

        <view class="form-item">
          <text class="form-label">相关图片</text>
          <view class="image-upload">
            <view class="image-list">
              <view class="image-item" v-for="(image, index) in formData.images" :key="index">
                <image :src="image" mode="aspectFill" @click="previewImage(index)"></image>
                <button class="delete-image" @click="deleteImage(index)">
                  <u-icon name="close" size="14" color="#fff"></u-icon>
                </button>
              </view>
              <view class="upload-btn" @click="chooseImage" v-if="formData.images.length < 4">
                <u-icon name="camera" size="32" color="#999"></u-icon>
                <text class="upload-text">添加图片</text>
                <text class="upload-tips">最多4张</text>
              </view>
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">联系方式</text>
          <view class="contact-info">
            <input
              v-model="formData.contact"
              class="form-input"
              placeholder="手机号或邮箱（可选，便于我们回复）"
            />
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">紧急程度</text>
          <view class="urgency-selector">
            <view
              class="urgency-item"
              :class="{ active: formData.urgency === item.value }"
              v-for="item in urgencyLevels"
              :key="item.value"
              @click="selectUrgency(item.value)"
            >
              <view class="urgency-dot" :class="item.color"></view>
              <text>{{ item.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="history-section" v-if="feedbackHistory.length > 0">
        <view class="section-title">
          <text>历史反馈</text>
          <text class="history-count">({{ feedbackHistory.length }}条)</text>
        </view>

        <view class="history-list">
          <view class="history-item" v-for="item in feedbackHistory" :key="item.id" @click="viewFeedbackDetail(item)">
            <view class="history-header">
              <view class="feedback-type" :class="item.type">
                <u-icon :name="getTypeIcon(item.type)" size="16" color="#fff"></u-icon>
                <text>{{ getTypeText(item.type) }}</text>
              </view>
              <view class="feedback-status" :class="item.status">
                {{ getStatusText(item.status) }}
              </view>
            </view>

            <text class="feedback-title">{{ item.title }}</text>
            <text class="feedback-summary">{{ item.content.substring(0, 50) }}...</text>

            <view class="history-footer">
              <text class="submit-time">{{ item.submitTime }}</text>
              <view class="urgency-indicator" :class="item.urgency">
                {{ getUrgencyText(item.urgency) }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="tips-section">
        <view class="tips-title">
          <u-icon name="info-circle" size="20" color="#3b5598"></u-icon>
          <text>反馈须知</text>
        </view>
        <view class="tips-list">
          <text class="tip-item">• 请客观、真实地描述问题，避免情绪化表达</text>
          <text class="tip-item">• 如有相关图片，请一并提供，有助于我们更好地理解问题</text>
          <text class="tip-item">• 我们会在1-3个工作日内处理您的反馈</text>
          <text class="tip-item">• 紧急问题请拨打物业热线：400-123-4567</text>
          <text class="tip-item">• 恶意举报、虚假信息将被严肃处理</text>
        </view>
      </view>

<!--      :disabled="!canSubmit"-->
      <button class="submit-btn"  @click="submitFeedback">
        提交反馈
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      feedbackTypes: [
        { label: '物业服务', value: 'property', icon: 'home', color: '#3b5598' },
        { label: '设施维修', value: 'maintenance', icon: 'home', color: '#ff6b35' },
        { label: '环境卫生', value: 'environment', icon: 'home', color: '#07c160' },
        { label: '安全管理', value: 'security', icon: 'home', color: '#9c27b0' },
        { label: '投诉建议', value: 'complaint', icon: 'home', color: '#f5222d' },
        { label: '其他问题', value: 'other', icon: 'home', color: '#666' }
      ],
      urgencyLevels: [
        { label: '一般', value: 'normal', color: 'blue' },
        { label: '重要', value: 'important', color: 'orange' },
        { label: '紧急', value: 'urgent', color: 'red' }
      ],
      formData: {
        type: '',
        title: '',
        content: '',
        images: [],
        contact: '',
        urgency: 'normal'
      },
      feedbackHistory: [
        {
          id: 1,
          type: 'maintenance',
          title: '电梯按钮失灵',
          content: '3号楼电梯的5楼按钮经常失灵，需要按很多次才有反应',
          status: 'processing',
          urgency: 'normal',
          submitTime: '2024-11-10 14:30'
        },
        {
          id: 2,
          type: 'environment',
          title: '垃圾清理不及时',
          content: '小区垃圾桶经常满溢，影响环境卫生',
          status: 'resolved',
          urgency: 'important',
          submitTime: '2024-11-08 09:15'
        },
        {
          id: 3,
          type: 'property',
          title: '物业费缴纳流程复杂',
          content: '建议简化物业费缴纳流程，支持更多支付方式',
          status: 'resolved',
          urgency: 'normal',
          submitTime: '2024-11-05 16:45'
        }
      ]
    }
  },
  computed: {
    canSubmit() {
      return this.formData.type &&
             this.formData.title.trim() &&
             this.formData.content.trim()
    }
  },
  methods: {
    selectType(type) {
      this.formData.type = type
    },

    selectUrgency(urgency) {
      this.formData.urgency = urgency
    },

    getTypeIcon(type) {
      const icons = {
        property: 'home',
        maintenance: 'home',
        environment: 'home',
        security: 'shield',
        complaint: 'message-circle',
        other: 'help-circle'
      }
      return icons[type] || 'help-circle'
    },

    getTypeText(type) {
      const typeMap = {
        property: '物业',
        maintenance: '维修',
        environment: '环境',
        security: '安全',
        complaint: '投诉',
        other: '其他'
      }
      return typeMap[type] || '其他'
    },

    getStatusText(status) {
      const statusMap = {
        pending: '待处理',
        processing: '处理中',
        resolved: '已解决',
        rejected: '已拒绝'
      }
      return statusMap[status] || '未知'
    },

    getUrgencyText(urgency) {
      const urgencyMap = {
        normal: '一般',
        important: '重要',
        urgent: '紧急'
      }
      return urgencyMap[urgency] || '一般'
    },

    chooseImage() {
      const maxCount = 4 - this.formData.images.length
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

    validateForm() {
      if (!this.formData.type) {
        uni.showToast({ title: '请选择反馈类型', icon: 'none' })
        return false
      }

      if (!this.formData.title.trim()) {
        uni.showToast({
          title: '请输入反馈标题',
          icon: 'none'
        })
        return false
      }

      if (!this.formData.content.trim()) {
        uni.showToast({ title: '请输入详细描述', icon: 'none' })
        return false
      }

      return true
    },

    submitFeedback() {
      if (!this.validateForm()) {
        return
      }

      if (this.formData.urgency === 'urgent') {
        uni.showModal({
          title: '紧急反馈',
          content: '您选择了紧急反馈，建议直接拨打物业热线：400-123-4567\n\n是否继续提交？',
          success: (res) => {
            if (res.confirm) {
              this.doSubmit()
            }
          }
        })
      } else {
        this.doSubmit()
      }
    },

    doSubmit() {
      uni.showLoading({
        title: '提交中...'
      })

      // 模拟提交
      setTimeout(() => {
        uni.hideLoading()

        // 添加到历史记录
        const newFeedback = {
          id: Date.now(),
          type: this.formData.type,
          title: this.formData.title,
          content: this.formData.content,
          status: 'pending',
          urgency: this.formData.urgency,
          submitTime: this.formatTime(new Date())
        }

        this.feedbackHistory.unshift(newFeedback)

        // 清空表单
        this.resetForm()

        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })
      }, 2000)
    },

    resetForm() {
      this.formData = {
        type: '',
        title: '',
        content: '',
        images: [],
        contact: '',
        urgency: 'normal'
      }
    },

    viewFeedbackDetail(item) {
      uni.showModal({
        title: item.title,
        content: item.content,
        showCancel: false,
        confirmText: '知道了'
      })
    },

    formatTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    }
  }
}
</script>

<style lang="scss">
.feedback-page {
  background: #f5f5f5;
  min-height: 100vh;

  .content {
    padding: 35rpx;

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
          height: 80rpx;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          padding: 0 20rpx;
          font-size: 28rpx;
          background: #fafafa;
        }

        .form-textarea {
          min-height: 150rpx;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          padding: 20rpx;
          font-size: 28rpx;
          background: #fafafa;
          line-height: 1.5;
          width: calc(100% - 40rpx);
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
          grid-template-columns: repeat(3, 1fr);
          gap: 15rpx;

          .type-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20rpx 10rpx;
            border: 2rpx solid #e0e0e0;
            border-radius: 12rpx;
            transition: all 0.3s;

            text {
              font-size: 22rpx;
              color: #666;
              margin-top: 8rpx;
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

        .image-upload {
          .image-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15rpx;


            .image-item {
              position: relative;
              width: 100%;
              padding-top: 75%;
              border-radius: 8rpx;
              overflow: hidden;
              border: 1px solid #ebebeb;

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
                border-radius: 100rpx;
                background: rgba(0, 0, 0, 0.6);
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
              }
            }

            .upload-btn {
              position: relative;
              border: 2rpx dashed #d9d9d9;
              border-radius: 8rpx;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 40rpx;

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

        .urgency-selector {
          display: flex;
          gap: 20rpx;

          .urgency-item {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20rpx;
            border: 2rpx solid #e0e0e0;
            border-radius: 12rpx;
            transition: all 0.3s;

            .urgency-dot {
              width: 16rpx;
              height: 16rpx;
              border-radius: 50%;
              margin-right: 10rpx;

              &.blue {
                background: #3b5598;
              }

              &.orange {
                background: #ff6b35;
              }

              &.red {
                background: #f5222d;
              }
            }

            text {
              font-size: 26rpx;
              color: #666;
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
      }
    }

    .history-section {
      background: white;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 30rpx;

      .section-title {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #333;
        font-weight: 600;
        margin-bottom: 20rpx;

        .history-count {
          font-size: 22rpx;
          color: #999;
          font-weight: normal;
          margin-left: 8rpx;
        }
      }

      .history-list {
        .history-item {
          border: 1rpx solid #f0f0f0;
          border-radius: 12rpx;
          padding: 20rpx;
          margin-bottom: 15rpx;
          transition: background-color 0.2s;

          &:last-child {
            margin-bottom: 0;
          }

          &:active {
            background-color: #f8f9fa;
          }

          .history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12rpx;

            .feedback-type {
              display: flex;
              align-items: center;
              padding: 4rpx 10rpx;
              border-radius: 10rpx;
              font-size: 20rpx;
              color: white;

              text {
                margin-left: 6rpx;
              }

              &.property { background: #3b5598; }
              &.maintenance { background: #ff6b35; }
              &.environment { background: #07c160; }
              &.security { background: #9c27b0; }
              &.complaint { background: #f5222d; }
              &.other { background: #666; }
            }

            .feedback-status {
              font-size: 20rpx;
              padding: 4rpx 10rpx;
              border-radius: 10rpx;

              &.pending {
                background: #fff7e6;
                color: #fa8c16;
              }

              &.processing {
                background: #e6f7ff;
                color: #1890ff;
              }

              &.resolved {
                background: #f6ffed;
                color: #52c41a;
              }

              &.rejected {
                background: #fff2f0;
                color: #f5222d;
              }
            }
          }

          .feedback-title {
            display: block;
            font-size: 26rpx;
            color: #333;
            font-weight: 500;
            margin-bottom: 8rpx;
            line-height: 1.3;
          }

          .feedback-summary {
            display: block;
            font-size: 22rpx;
            color: #666;
            line-height: 1.5;
            margin-bottom: 12rpx;
          }

          .history-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .submit-time {
              font-size: 20rpx;
              color: #999;
            }

            .urgency-indicator {
              font-size: 18rpx;
              padding: 2rpx 8rpx;
              border-radius: 8rpx;

              &.normal {
                background: #e6f7ff;
                color: #1890ff;
              }

              &.important {
                background: #fff7e6;
                color: #fa8c16;
              }

              &.urgent {
                background: #fff2f0;
                color: #f5222d;
              }
            }
          }
        }
      }
    }

    .tips-section {
      background: white;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 30rpx;

      .tips-title {
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

      .tips-list {
        .tip-item {
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
