<template>
  <view class="repair-detail-page" v-if="repairInfo">
    <view class="header">
      <text class="title">报修详情</text>
    </view>

    <view class="content">
      <!-- 基本信息 -->
      <view class="info-section">
        <view class="section-title">
          <u-icon name="info-circle" size="20" color="#3b5598"></u-icon>
          <text>基本信息</text>
        </view>

        <view class="info-item">
          <text class="label">报修单号</text>
          <text class="value">{{ repairInfo.requestNo }}</text>
        </view>

        <view class="info-item">
          <text class="label">报修分类</text>
          <text class="value">{{ repairInfo.categoryName }}</text>
        </view>

        <view class="info-item">
          <text class="label">紧急程度</text>
          <view class="urgency-badge" :class="'urgency-' + repairInfo.urgentLevel">
            {{ repairInfo.urgentLevelDesc }}
          </view>
        </view>

        <view class="info-item">
          <text class="label">当前状态</text>
          <view class="status-badge" :class="'status-' + repairInfo.status">
            {{ repairInfo.statusDesc }}
          </view>
        </view>

        <view class="info-item">
          <text class="label">报修位置</text>
          <text class="value">{{ repairInfo.location }}</text>
        </view>

        <view class="info-item" v-if="repairInfo.contactTime">
          <text class="label">方便联系时间</text>
          <text class="value">{{ repairInfo.contactTime }}</text>
        </view>

        <view class="info-item">
          <text class="label">申请时间</text>
          <text class="value">{{ formatDateTime(repairInfo.createdAt) }}</text>
        </view>
      </view>

      <!-- 问题描述 -->
      <view class="section">
        <view class="section-title">
          <u-icon name="file-text" size="20" color="#3b5598"></u-icon>
          <text>问题描述</text>
        </view>

        <view class="problem-content">
          <text class="problem-title">{{ repairInfo.title }}</text>
          <text class="problem-desc">{{ repairInfo.description }}</text>
        </view>
      </view>

      <!-- 现场照片 -->
      <view class="section" v-if="repairInfo.imageList && repairInfo.imageList.length > 0">
        <view class="section-title">
          <u-icon name="image" size="20" color="#3b5598"></u-icon>
          <text>现场照片</text>
        </view>

        <view class="image-grid">
          <view
            class="image-item"
            v-for="(img, index) in repairInfo.imageList"
            :key="index"
            @click="previewImage(repairInfo.imageList, index)"
          >
            <image :src="img" mode="aspectFill"></image>
          </view>
        </view>
      </view>

      <!-- 处理信息 -->
      <view class="section" v-if="repairInfo.handlerName">
        <view class="section-title">
          <u-icon name="user" size="20" color="#3b5598"></u-icon>
          <text>处理信息</text>
        </view>

        <view class="info-item">
          <text class="label">处理人员</text>
          <text class="value">{{ repairInfo.handlerName }}</text>
        </view>

        <view class="info-item" v-if="repairInfo.handleTime">
          <text class="label">受理时间</text>
          <text class="value">{{ formatDateTime(repairInfo.handleTime) }}</text>
        </view>

        <view class="info-item" v-if="repairInfo.startTime">
          <text class="label">开始处理时间</text>
          <text class="value">{{ formatDateTime(repairInfo.startTime) }}</text>
        </view>

        <view class="info-item" v-if="repairInfo.completeTime">
          <text class="label">完成时间</text>
          <text class="value">{{ formatDateTime(repairInfo.completeTime) }}</text>
        </view>

        <view class="info-item" v-if="repairInfo.remark">
          <text class="label">处理备注</text>
          <text class="value">{{ repairInfo.remark }}</text>
        </view>
      </view>

      <!-- 评价信息 -->
      <view class="section" v-if="repairInfo.rating">
        <view class="section-title">
          <u-icon name="star" size="20" color="#3b5598"></u-icon>
          <text>评价信息</text>
        </view>

        <view class="rating-info">
          <view class="rating-stars">
            <u-icon
              v-for="i in 5"
              :key="i"
              :name="i <= repairInfo.rating ? 'star-fill' : 'star'"
              size="32"
              :color="i <= repairInfo.rating ? '#ffc107' : '#ddd'"
            ></u-icon>
          </view>
          <text class="rating-text">{{ getRatingText(repairInfo.rating) }}</text>
        </view>

        <view class="feedback-content" v-if="repairInfo.feedback">
          <text class="feedback-label">评价内容：</text>
          <text class="feedback-text">{{ repairInfo.feedback }}</text>
        </view>

        <view class="feedback-time" v-if="repairInfo.feedbackTime">
          <text>评价时间：{{ formatDateTime(repairInfo.feedbackTime) }}</text>
        </view>
      </view>

      <!-- 处理进度 -->
      <view class="section" v-if="repairInfo.progressList && repairInfo.progressList.length > 0">
        <view class="section-title">
          <u-icon name="clock" size="20" color="#3b5598"></u-icon>
          <text>处理进度</text>
        </view>

        <view class="progress-list">
          <view
            class="progress-item"
            v-for="(progress, index) in repairInfo.progressList"
            :key="progress.id"
          >
            <view class="progress-dot" :class="{ active: progress.status === 4 }"></view>
            <view class="progress-content">
              <view class="progress-header">
                <text class="progress-status">{{ progress.statusDesc }}</text>
                <text class="progress-time">{{ formatDateTime(progress.createdAt) }}</text>
              </view>
              <view class="progress-operator" v-if="progress.operatorName">
                <text>操作人：{{ progress.operatorName }}</text>
                <text class="operator-type">{{ progress.operatorTypeDesc }}</text>
              </view>
              <view class="progress-desc" v-if="progress.description">
                {{ progress.description }}
              </view>
              <view class="progress-images" v-if="progress.imageList && progress.imageList.length > 0">
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

      <!-- 操作按钮 -->
      <view class="actions-section" v-if="showActions">
        <button
          class="action-btn primary"
          v-if="repairInfo.status === 4 && repairInfo.canRate"
          @click="rateRepair"
        >
          <u-icon name="star" size="16" color="#fff"></u-icon>
          <text>评价服务</text>
        </button>

        <button
          class="action-btn secondary"
          @click="viewProgress"
          v-if="repairInfo.status !== 1"
        >
          <u-icon name="clock" size="16" color="#3b5598"></u-icon>
          <text>查看进度</text>
        </button>
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
    <button class="retry-btn" @click="loadRepairDetail">重试</button>
  </view>
</template>

<script>
import { getRepairList } from '@/api/list/repair'

export default {
  name: 'repair-detail',
  data() {
    return {
      repairId: '',
      repairInfo: null,
      loading: false
    }
  },
  computed: {
    showActions() {
      return this.repairInfo && (this.repairInfo.status === 4 || this.repairInfo.status !== 1)
    }
  },
  onLoad(options) {
    if (options.id) {
      this.repairId = options.id
      this.loadRepairDetail()
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      })
      uni.navigateBack()
    }
  },
  methods: {
    async loadRepairDetail() {
      if (this.loading) return

      this.loading = true
      try {
        const res = await getRepairList({
          page: 1,
          size: 100
        })

        const repair = res.records.find(item => item.id == this.repairId)
        if (repair) {
          this.repairInfo = repair
        } else {
          throw new Error('报修记录不存在')
        }

      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    getUrgencyClass(level) {
      const classes = {
        1: 'normal',
        2: 'urgent',
        3: 'very-urgent'
      }
      return classes[level] || 'normal'
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
    getRatingText(rating) {
      const texts = {
        1: '非常不满意',
        2: '不满意',
        3: '一般',
        4: '满意',
        5: '非常满意'
      }
      return texts[rating] || '未评价'
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
    rateRepair() {
      uni.navigateTo({
        url: `/subpackages/repair/rate?id=${this.repairId}`
      })
    },
    viewProgress() {
      uni.navigateTo({
        url: `/subpackages/repair/progress?requestId=${this.repairInfo.id}&requestNo=${this.repairInfo.requestNo}`
      })
    }
  }
}
</script>

<style scoped lang="scss">
.repair-detail-page {
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

.info-section, .section {
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

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .label {
    font-size: 26rpx;
    color: #666;
    min-width: 160rpx;
  }

  .value {
    font-size: 26rpx;
    color: #333;
    flex: 1;
    text-align: right;
  }
}

.urgency-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;

  &.urgency-1 {
    background: #e6f7ff;
    color: #1890ff;
  }

  &.urgency-2 {
    background: #fff7e6;
    color: #fa8c16;
  }

  &.urgency-3 {
    background: #fff1f0;
    color: #f5222d;
  }
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;

  &.status-1 {
    background: #f6f6f6;
    color: #999;
  }

  &.status-2, &.status-3 {
    background: #e6f7ff;
    color: #1890ff;
  }

  &.status-4 {
    background: #f6ffed;
    color: #52c41a;
  }
}

.problem-content {
  .problem-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 16rpx;
  }

  .problem-desc {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
  }
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

.rating-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 20rpx;

  .rating-stars {
    display: flex;
    gap: 8rpx;
  }

  .rating-text {
    font-size: 26rpx;
    color: #666;
  }
}

.feedback-content {
  margin-bottom: 16rpx;

  .feedback-label {
    font-size: 26rpx;
    color: #666;
    display: block;
    margin-bottom: 8rpx;
  }

  .feedback-text {
    font-size: 26rpx;
    color: #333;
    line-height: 1.6;
  }
}

.feedback-time {
  text {
    font-size: 24rpx;
    color: #999;
  }
}

.progress-list {
  .progress-item {
    display: flex;
    gap: 20rpx;
    margin-bottom: 30rpx;
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
      left: 14rpx;
      top: 32rpx;
      width: 2rpx;
      height: calc(100% + 20rpx);
      background: #f0f0f0;
    }

    .progress-dot {
      width: 30rpx;
      height: 30rpx;
      border-radius: 50%;
      background: #f0f0f0;
      margin-top: 4rpx;
      position: relative;
      z-index: 1;

      &.active {
        background: #52c41a;
      }
    }

    .progress-content {
      flex: 1;
      padding-bottom: 20rpx;

      .progress-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12rpx;

        .progress-status {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
        }

        .progress-time {
          font-size: 24rpx;
          color: #999;
        }
      }

      .progress-operator {
        display: flex;
        align-items: center;
        gap: 16rpx;
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

      .progress-desc {
        font-size: 26rpx;
        color: #666;
        line-height: 1.6;
        margin-bottom: 12rpx;
      }

      .progress-images {
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

.actions-section {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;

  .action-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
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
      color: #3b5598;
      border: 2rpx solid #3b5598;

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