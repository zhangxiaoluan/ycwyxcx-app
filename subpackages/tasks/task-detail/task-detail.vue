<template>
  <view class="task-detail-page">
    <view class="content" v-if="taskDetail">
      <!-- 任务状态卡片 -->
      <view class="status-card" :class="'task-status-' + taskDetail.taskStatus">
        <view class="status-header">
          <view class="task-type" :class="'task-type-' + taskDetail.taskType">
            <text>{{ taskDetail.taskTypeName }}</text>
          </view>
          <view class="task-status-text">
            <text>{{ taskDetail.taskStatusName }}</text>
          </view>
        </view>
        <text class="task-title">{{ taskDetail.title }}</text>
      </view>

      <!-- 任务信息 -->
      <view class="info-section">
        <view class="section-title">任务描述</view>
        <text class="task-description">{{ taskDetail.content }}</text>
      </view>

      <!-- 任务图片 -->
      <view class="info-section" v-if="taskDetail.taskImages && taskDetail.taskImages.length > 0">
        <view class="section-title">任务图片</view>
        <view class="image-grid">
          <view
            class="image-item"
            v-for="(img, index) in taskDetail.taskImages"
            :key="index"
            @click="previewImage(taskDetail.taskImages, index)"
          >
            <image :src="img" mode="aspectFill"></image>
          </view>
        </view>
      </view>

      <!-- 发布者信息 -->
      <view class="info-section" v-if="taskDetail.publisherName">
        <view class="section-title">发布者信息</view>
        <view class="publisher-info">
          <view class="publisher-avatar">
            <u-icon name="user" size="40" color="#3b5598"></u-icon>
          </view>
          <view class="publisher-details">
            <text class="publisher-name">{{ taskDetail.publisherName }}</text>
            <text class="publisher-community" v-if="taskDetail.communityName">
              {{ taskDetail.communityName }}
            </text>
          </view>
        </view>
      </view>

      <!-- 时间信息 -->
      <view class="info-section">
        <view class="section-title">时间信息</view>
        <view class="info-grid">
          <view class="info-item">
            <text class="info-label">发布时间</text>
            <text class="info-value">{{ formatDateTime(taskDetail.publishTime) }}</text>
          </view>
          <view class="info-item" v-if="taskDetail.deadlineTime">
            <text class="info-label">截止时间</text>
            <text class="info-value deadline">{{ formatDateTime(taskDetail.deadlineTime) }}</text>
          </view>
          <view class="info-item" v-if="taskDetail.takeTime">
            <text class="info-label">领取时间</text>
            <text class="info-value">{{ formatDateTime(taskDetail.takeTime) }}</text>
          </view>
          <view class="info-item" v-if="taskDetail.completeTime">
            <text class="info-label">完成时间</text>
            <text class="info-value">{{ formatDateTime(taskDetail.completeTime) }}</text>
          </view>
        </view>
      </view>

      <!-- 联系信息 -->
      <view class="info-section" v-if="taskDetail.contactPhone || taskDetail.contactAddress">
        <view class="section-title">联系信息</view>
        <view class="contact-info">
          <view class="contact-item" v-if="taskDetail.contactPhone">
            <u-icon name="phone" size="16" color="#3b5598"></u-icon>
            <text>{{ taskDetail.contactPhone }}</text>
          </view>
          <view class="contact-item" v-if="taskDetail.contactAddress">
            <u-icon name="map-pin" size="16" color="#3b5598"></u-icon>
            <text>{{ taskDetail.contactAddress }}</text>
          </view>
        </view>
      </view>

      <!-- 领取者信息 -->
      <view class="info-section" v-if="taskDetail.takerName">
        <view class="section-title">领取者信息</view>
        <view class="taker-info">
          <view class="taker-avatar">
            <u-icon name="user" size="40" color="#3b5598"></u-icon>
          </view>
          <view class="taker-details">
            <text class="taker-name">{{ taskDetail.takerName }}</text>
            <text class="take-time">领取时间：{{ formatDateTime(taskDetail.takeTime) }}</text>
          </view>
        </view>
      </view>

      <!-- 备注 -->
      <view class="info-section" v-if="taskDetail.remark">
        <view class="section-title">备注</view>
        <text class="remark-text">{{ taskDetail.remark }}</text>
      </view>

      <!-- 奖励信息 -->
      <view class="info-section" v-if="taskDetail.rewardPoints > 0">
        <view class="section-title">任务奖励</view>
        <view class="reward-info">
          <text class="reward-value">{{ taskDetail.rewardPoints }} 积分</text>
          <text class="reward-desc">完成此任务可获得积分奖励</text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view class="loading-state" v-else-if="loading">
      <u-loading-icon mode="circle" color="#3b5598" size="40"></u-loading-icon>
      <text>加载中...</text>
    </view>

    <!-- 错误状态 -->
    <view class="error-state" v-else>
      <u-icon name="order" size="64" color="#ddd"></u-icon>
      <text class="error-text">加载失败</text>
      <button class="retry-btn" @click="loadTaskDetail">重试</button>
    </view>

    <!-- 操作按钮 -->
    <view class="action-section" v-if="taskDetail && showActions">
      <button
        class="action-btn primary"
        v-if="taskDetail.canTake && !taskDetail.hasApplied"
        @click="takeTask"
      >
        <u-icon name="checkmark" size="16" color="#fff"></u-icon>
        <text>领取任务</text>
      </button>

      <button
        class="action-btn primary"
        v-if="taskDetail.taskStatus === 2 && isTaskTaker"
        @click="completeTask"
      >
        <u-icon name="checkmark-circle" size="16" color="#fff"></u-icon>
        <text>完成任务</text>
      </button>

      <button
        class="action-btn secondary"
        v-if="taskDetail.taskStatus === 1 && isTaskPublisher"
        @click="cancelTask"
      >
        <u-icon name="close" size="16" color="#f5222d"></u-icon>
        <text>取消任务</text>
      </button>
    </view>
  </view>
</template>

<script>
import { getTaskDetail, takeTask as apiTakeTask, cancelTask as apiCancelTask, completeTask as apiCompleteTask } from '@/api/list/tasks'

export default {
  name: 'task-detail',
  data() {
    return {
      taskId: '',
      taskDetail: null,
      loading: false,
      userInfo: null // 这里应该从全局状态获取用户信息
    }
  },
  computed: {
    showActions() {
      if (!this.taskDetail) return false
      return (this.taskDetail.canTake && !this.taskDetail.hasApplied) ||
             (this.taskDetail.taskStatus === 2 && this.isTaskTaker) ||
             (this.taskDetail.taskStatus === 1 && this.isTaskPublisher)
    },
    isTaskPublisher() {
      return this.userInfo && this.taskDetail && this.userInfo.id === this.taskDetail.publisherId
    },
    isTaskTaker() {
      return this.userInfo && this.taskDetail && this.userInfo.id === this.taskDetail.takerId
    }
  },
  onLoad(options) {
    if (options.id) {
      this.taskId = options.id
      this.loadTaskDetail()
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      })
      uni.navigateBack()
    }
  },
  methods: {
    async loadTaskDetail() {
      if (this.loading) return

      this.loading = true
      try {
        const res = await getTaskDetail(this.taskId)
        this.taskDetail = res
      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    formatDateTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: current
      })
    },
    async takeTask() {
      try {
        uni.showLoading({ title: '领取中...' })
        await apiTakeTask(this.taskId)

        uni.showToast({
          title: '领取成功',
          icon: 'success'
        })

        // 重新加载详情
        await this.loadTaskDetail()

      } catch (error) {
        uni.showToast({
          title: '领取失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    async cancelTask() {
      try {
        const confirm = await new Promise((resolve) => {
          uni.showModal({
            title: '确认取消',
            content: '确定要取消这个任务吗？',
            success: (res) => {
              resolve(res.confirm)
            }
          })
        })

        if (!confirm) return

        uni.showLoading({ title: '取消中...' })
        await apiCancelTask(this.taskId)

        uni.showToast({
          title: '取消成功',
          icon: 'success'
        })

        // 重新加载详情
        await this.loadTaskDetail()

      } catch (error) {
        uni.showToast({
          title: '取消失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    async completeTask() {
      try {
        const confirm = await new Promise((resolve) => {
          uni.showModal({
            title: '确认完成',
            content: '确定要标记这个任务为已完成吗？',
            success: (res) => {
              resolve(res.confirm)
            }
          })
        })

        if (!confirm) return

        uni.showLoading({ title: '提交中...' })
        await apiCompleteTask(this.taskId)

        uni.showToast({
          title: '任务已完成',
          icon: 'success'
        })

        // 重新加载详情
        await this.loadTaskDetail()

      } catch (error) {
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.task-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background: linear-gradient(135deg, #3b5598 0%, #2c3e50 100%);
  padding: 20rpx 30rpx 40rpx;

  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #fff;
  }
}

.content {
  padding: 20rpx;
}

.status-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(59, 85, 152, 0.1);

  .status-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .task-type {
      padding: 8rpx 16rpx;
      border-radius: 12rpx;
      font-size: 22rpx;
      color: white;

      &.task-type-1 {
        background: #ff6b35;
      }

      &.task-type-2 {
        background: #07c160;
      }

      &.task-type-3 {
        background: #3b5598;
      }

      &.task-type-4 {
        background: #9c27b0;
      }
    }

    .task-status-text {
      font-size: 22rpx;
      color: #666;
    }
  }

  .task-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    line-height: 1.4;
  }
}

.info-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-title {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 20rpx;
    padding-bottom: 12rpx;
    border-bottom: 2rpx solid #f0f0f0;

    text {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
    }
  }

  .task-description {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
  }

  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .image-item {
      width: 200rpx;
      height: 200rpx;
      border-radius: 12rpx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .publisher-info, .taker-info {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .publisher-avatar, .taker-avatar {
      width: 80rpx;
      height: 80rpx;
      background: #f0f5ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .publisher-details, .taker-details {
      flex: 1;

      .publisher-name, .taker-name {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }

      .publisher-community, .take-time {
        font-size: 24rpx;
        color: #666;
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20rpx;

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8rpx;

      .info-label {
        font-size: 24rpx;
        color: #999;
      }

      .info-value {
        font-size: 26rpx;
        color: #333;
        font-weight: 500;

        &.deadline {
          color: #fa8c16;
        }
      }
    }
  }

  .contact-info {
    .contact-item {
      display: flex;
      align-items: center;
      gap: 12rpx;
      margin-bottom: 16rpx;

      &:last-child {
        margin-bottom: 0;
      }

      text {
        font-size: 26rpx;
        color: #666;
      }
    }
  }

  .remark-text {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
    background: #f8f9fa;
    padding: 20rpx;
    border-radius: 12rpx;
  }

  .reward-info {
    text-align: center;
    padding: 30rpx;
    background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
    border-radius: 12rpx;

    .reward-value {
      font-size: 36rpx;
      font-weight: 700;
      color: #fa8c16;
      display: block;
      margin-bottom: 12rpx;
    }

    .reward-desc {
      font-size: 24rpx;
      color: #8a6d3b;
    }
  }
}

.action-section {
  padding: 20rpx;
  display: flex;
  gap: 20rpx;

  .action-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 500;
    border: none;

    &.primary {
      background: linear-gradient(135deg, #3b5598 0%, #2c3e50 100%);
      color: #fff;

      u-icon {
        margin-right: 12rpx;
      }
    }

    &.secondary {
      background: #fff;
      color: #f5222d;
      border: 2rpx solid #f5222d;

      u-icon {
        margin-right: 12rpx;
      }
    }
  }
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40rpx;

  text {
    font-size: 28rpx;
    color: #999;
    margin-top: 20rpx;
  }

  .error-text {
    color: #666;
    margin-bottom: 40rpx;
  }

  .retry-btn {
    height: 80rpx;
    background: #3b5598;
    color: #fff;
    border-radius: 40rpx;
    padding: 0 60rpx;
    font-size: 28rpx;
    border: none;
  }
}
</style>
