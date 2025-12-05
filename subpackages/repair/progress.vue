<template>
  <view class="page-container">
    <view class="repair-progress-page" v-if="!loading && !error">
      <view class="header">
        <text class="title">处理进度</text>
        <text class="request-no" v-if="requestNo">{{ requestNo }}</text>
      </view>

      <view class="content">
        <!-- 当前状态卡片 -->
        <view class="status-card" v-if="currentProgress">
          <view class="status-header">
            <view class="status-icon" :class="'status-' + currentProgress.status">
              <u-icon name="clock" size="32" color="#fff" v-if="currentProgress.status === 1"></u-icon>
              <u-icon name="reload" size="32" color="#fff" v-else-if="currentProgress.status === 2"></u-icon>
              <u-icon name="tools" size="32" color="#fff" v-else-if="currentProgress.status === 3"></u-icon>
              <u-icon name="checkmark" size="32" color="#fff" v-else></u-icon>
            </view>
            <view class="status-info">
              <text class="status-title">{{ currentProgress.statusDesc }}</text>
              <text class="status-time">{{ formatDateTime(currentProgress.createdAt) }}</text>
            </view>
          </view>
          <view class="status-desc" v-if="currentProgress.description">
            {{ currentProgress.description }}
          </view>
        </view>

        <!-- 进度时间线 -->
        <view class="timeline-section" v-if="progressList && progressList.length > 0">
          <view class="section-title">
            <u-icon name="clock" size="20" color="#3b5598"></u-icon>
            <text>处理进度</text>
          </view>

          <view class="timeline">
            <view
              class="timeline-item"
              v-for="(progress, index) in progressList"
              :key="progress.id"
            >
              <view class="timeline-dot" :class="'dot-' + progress.status">
                <u-icon name="checkmark" size="20" color="#fff" v-if="progress.status === 4"></u-icon>
              </view>
              <view class="timeline-content">
                <view class="timeline-header">
                  <text class="timeline-status">{{ progress.statusDesc }}</text>
                  <text class="timeline-time">{{ formatDateTime(progress.createdAt) }}</text>
                </view>
                <view class="timeline-operator" v-if="progress.operatorName">
                  <u-icon name="user" size="14" color="#666"></u-icon>
                  <text>{{ progress.operatorName }}</text>
                  <text class="operator-type">{{ progress.operatorTypeDesc }}</text>
                </view>
                <view class="timeline-desc" v-if="progress.description">
                  {{ progress.description }}
                </view>
                <view class="timeline-images" v-if="progress.imageList && progress.imageList.length > 0">
                  <image
                    v-for="(img, imgIndex) in progress.imageList.slice(0, 3)"
                    :key="imgIndex"
                    :src="img"
                    mode="aspectFill"
                    @click="previewImage(progress.imageList, imgIndex)"
                  ></image>
                  <view class="more-images" v-if="progress.imageList.length > 3">
                    <text>+{{ progress.imageList.length - 3 }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 处理人员信息 -->
        <view class="handler-section" v-if="handlerInfo">
          <view class="section-title">
            <u-icon name="user" size="20" color="#3b5598"></u-icon>
            <text>处理人员</text>
          </view>

          <view class="handler-card">
            <view class="handler-info">
              <view class="handler-avatar">
                <u-icon name="user" size="40" color="#3b5598"></u-icon>
              </view>
              <view class="handler-details">
                <text class="handler-name">{{ handlerInfo.handlerName }}</text>
                <text class="handler-role">维修工程师</text>
              </view>
            </view>
            <view class="handler-actions">
              <button class="contact-btn" @click="contactHandler">
                <u-icon name="phone" size="16" color="#3b5598"></u-icon>
                <text>联系</text>
              </button>
            </view>
          </view>
        </view>

        <!-- 预计完成时间 -->
        <view class="estimate-section" v-if="estimatedTime">
          <view class="section-title">
            <u-icon name="calendar" size="20" color="#3b5598"></u-icon>
            <text>预计完成</text>
          </view>

          <view class="estimate-card">
            <view class="estimate-time">
              <u-icon name="clock" size="24" color="#ffc107"></u-icon>
              <text>{{ estimatedTime }}</text>
            </view>
            <text class="estimate-desc">预计将在该时间完成维修工作</text>
          </view>
        </view>
      </view>
    </view>

    <view class="loading-state" v-else-if="loading">
      <u-loading-icon mode="circle" color="#3b5598" size="40"></u-loading-icon>
      <text>加载中...</text>
    </view>

    <view class="error-state" v-else>
      <u-icon name="alert-circle" size="64" color="#ddd"></u-icon>
      <text class="error-text">加载失败</text>
      <button class="retry-btn" @click="loadProgress">重试</button>
    </view>
  </view>
</template>

<script>
import { getRepairProgress, getRepairList } from '@/api/list/repair'

export default {
  name: 'repair-progress',
  data() {
    return {
      requestId: '',
      requestNo: '',
      progressList: [],
      repairInfo: null,
      handlerInfo: null,
      loading: false,
      error: false,
      estimatedTime: null
    }
  },
  computed: {
    currentProgress() {
      if (this.progressList && this.progressList.length > 0) {
        return this.progressList[0] // 最新的一条进度
      }
      return null
    }
  },
  onLoad(options) {
    if (options.requestId) {
      this.requestId = options.requestId
      this.requestNo = options.requestNo || ''
      this.loadProgress()
      this.loadRepairInfo()
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      })
      uni.navigateBack()
    }
  },
  methods: {
    async loadProgress() {
      if (this.loading) return

      this.loading = true
      try {
        const res = await getRepairProgress(this.requestId)
        this.progressList = Array.isArray(res) ? [res] : []
        this.calculateEstimatedTime()

      } catch (error) {
        uni.showToast({
          title: '加载进度失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    async loadRepairInfo() {
      try {
        const res = await getRepairList({
          page: 1,
          size: 100
        })

        const repair = res.records.find(item => item.id == this.requestId)
        if (repair) {
          this.repairInfo = repair
          if (repair.handlerName) {
            this.handlerInfo = {
              handlerName: repair.handlerName,
              handlerId: repair.handlerId
            }
          }
        }

      } catch (error) {
        console.error('加载报修信息失败:', error)
      }
    },
    calculateEstimatedTime() {
      if (this.repairInfo && this.repairInfo.status >= 2 && this.repairInfo.status <= 3) {
        // 根据紧急程度计算预计完成时间
        const now = new Date()
        let estimatedDate = new Date()

        switch (this.repairInfo.urgentLevel) {
          case 1: // 一般
            estimatedDate.setDate(now.getDate() + 3)
            break
          case 2: // 紧急
            estimatedDate.setDate(now.getDate() + 1)
            break
          case 3: // 非常紧急
            estimatedDate.setHours(now.getHours() + 4)
            break
        }

        this.estimatedTime = `${estimatedDate.getFullYear()}-${String(estimatedDate.getMonth() + 1).padStart(2, '0')}-${String(estimatedDate.getDate()).padStart(2, '0')} ${String(estimatedDate.getHours()).padStart(2, '0')}:${String(estimatedDate.getMinutes()).padStart(2, '0')}`
      }
    },
    getStatusClass(status) {
      const classes = {
        1: 'pending',
        2: 'processing',
        3: 'handling',
        4: 'completed'
      }
      return classes[status] || 'pending'
    },
    getStatusIcon(status) {
      const icons = {
        1: 'clock',
        2: 'reload',
        3: 'tools',
        4: 'checkmark'
      }
      return icons[status] || 'clock'
    },
    getDotClass(status) {
      const classes = {
        1: 'dot-pending',
        2: 'dot-processing',
        3: 'dot-handling',
        4: 'dot-completed'
      }
      return classes[status] || 'dot-pending'
    },
    getDotIcon(status) {
      return status === 4 ? 'checkmark' : ''
    },
    formatDateTime(time) {
      if (!time) return ''
      const date = new Date(time)
      const now = new Date()
      const diffTime = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        return `今天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      } else if (diffDays === 1) {
        return `昨天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      } else if (diffDays < 7) {
        return `${diffDays}天前`
      } else {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      }
    },
    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: current
      })
    },
    contactHandler() {
      if (this.handlerInfo && this.handlerInfo.handlerName) {
        uni.showModal({
          title: '联系处理人员',
          content: `是否联系 ${this.handlerInfo.handlerName}？`,
          success: (res) => {
            if (res.confirm) {
              // 这里可以调用拨号或其他联系功能
              uni.showToast({
                title: '联系功能开发中',
                icon: 'none'
              })
            }
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.repair-progress-page {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #3b5598 0%, #2c3e50 100%);
  padding: 20rpx 30rpx 40rpx;

  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #fff;
    display: block;
    margin-bottom: 8rpx;
  }

  .request-no {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
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
    gap: 20rpx;
    margin-bottom: 20rpx;

    .status-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &.status-1 {
        background: #f6f6f6;
      }

      &.status-2, &.status-3 {
        background: #1890ff;
      }

      &.status-4 {
        background: #52c41a;
      }
    }

    .status-info {
      flex: 1;

      .status-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }

      .status-time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .status-desc {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
    background: #f8f9fa;
    padding: 20rpx;
    border-radius: 12rpx;
  }
}

.timeline-section, .handler-section, .estimate-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 30rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #f0f0f0;

  text {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
  }
}

.timeline {
  .timeline-item {
    display: flex;
    gap: 20rpx;
    margin-bottom: 40rpx;
    position: relative;

    &:last-child {
      margin-bottom: 0;

      &::after {
        display: none;
      }
    }

    &::after {
      content: '';
      position: absolute;
      left: 24rpx;
      top: 50rpx;
      width: 2rpx;
      height: calc(100% + 20rpx);
      background: #f0f0f0;
    }

    .timeline-dot {
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;

      &.dot-1 {
        background: #f6f6f6;
      }

      &.dot-2 {
        background: #1890ff;
      }

      &.dot-3 {
        background: #fa8c16;
      }

      &.dot-4 {
        background: #52c41a;
      }
    }

    .timeline-content {
      flex: 1;
      padding-top: 4rpx;

      .timeline-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 12rpx;

        .timeline-status {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
        }

        .timeline-time {
          font-size: 24rpx;
          color: #999;
          white-space: nowrap;
          margin-left: 20rpx;
        }
      }

      .timeline-operator {
        display: flex;
        align-items: center;
        gap: 8rpx;
        margin-bottom: 12rpx;

        text {
          font-size: 24rpx;
          color: #666;
        }

        .operator-type {
          background: #f0f5ff;
          color: #3b5598;
          padding: 4rpx 8rpx;
          border-radius: 4rpx;
          font-size: 20rpx;
        }
      }

      .timeline-desc {
        font-size: 26rpx;
        color: #666;
        line-height: 1.6;
        margin-bottom: 12rpx;
      }

      .timeline-images {
        display: flex;
        gap: 12rpx;

        image {
          width: 100rpx;
          height: 100rpx;
          border-radius: 8rpx;
        }

        .more-images {
          width: 100rpx;
          height: 100rpx;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          text {
            color: #fff;
            font-size: 20rpx;
          }
        }
      }
    }
  }
}

.handler-card {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .handler-info {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .handler-avatar {
      width: 80rpx;
      height: 80rpx;
      background: #f0f5ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .handler-details {
      .handler-name {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }

      .handler-role {
        font-size: 24rpx;
        color: #666;
      }
    }
  }

  .contact-btn {
    height: 60rpx;
    background: #f0f5ff;
    color: #3b5598;
    border-radius: 30rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 26rpx;
    border: none;
  }
}

.estimate-card {
  .estimate-time {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 12rpx;

    text {
      font-size: 28rpx;
      font-weight: 500;
      color: #333;
    }
  }

  .estimate-desc {
    font-size: 24rpx;
    color: #666;
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