<template>
  <view class="task-detail-page">

    <view class="content" v-if="taskDetail">
      <!-- 任务状态卡片 -->
      <view class="status-card" :class="taskDetail.status">
        <view class="status-header">
          <view class="task-type" :class="taskDetail.type">
            <u-icon :name="getTaskTypeIcon(taskDetail.type)" size="20" color="#fff"></u-icon>
            <text>{{ getTaskTypeText(taskDetail.type) }}</text>
          </view>
          <view class="task-status">
            <u-icon :name="getStatusIcon(taskDetail.status)" size="16" :color="getStatusColor(taskDetail.status)"></u-icon>
            <text :style="{ color: getStatusColor(taskDetail.status) }">{{ getTaskStatusText(taskDetail.status) }}</text>
          </view>
        </view>
        <text class="task-title">{{ taskDetail.title }}</text>
      </view>

      <!-- 任务信息 -->
      <view class="info-section">
        <view class="section-title">任务描述</view>
        <text class="task-description">{{ taskDetail.description }}</text>
      </view>

      <!-- 任务要求 -->
      <view class="info-section" v-if="taskDetail.requirements">
        <view class="section-title">任务要求</view>
        <view class="requirements-list">
          <text class="requirement-item" v-for="(req, index) in taskDetail.requirements" :key="index">
            • {{ req }}
          </text>
        </view>
      </view>

      <!-- 时间信息 -->
      <view class="info-section">
        <view class="section-title">时间信息</view>
        <view class="info-grid">
          <view class="info-item">
            <text class="info-label">发布时间</text>
            <text class="info-value">{{ taskDetail.createTime }}</text>
          </view>
          <view class="info-item" v-if="taskDetail.deadline">
            <text class="info-label">截止时间</text>
            <text class="info-value deadline">{{ taskDetail.deadline }}</text>
          </view>
          <view class="info-item" v-if="taskDetail.completeTime">
            <text class="info-label">完成时间</text>
            <text class="info-value">{{ taskDetail.completeTime }}</text>
          </view>
        </view>
      </view>

      <!-- 奖励信息 -->
      <view class="reward-section">
        <view class="section-title">任务奖励</view>
        <view class="reward-info">
          <view class="reward-amount">
            <text class="reward-value">{{ taskDetail.reward }}</text>
            <text class="reward-type">{{ getRewardTypeText(taskDetail.rewardType) }}</text>
          </view>
          <view class="reward-desc" v-if="taskDetail.rewardDesc">
            {{ taskDetail.rewardDesc }}
          </view>
        </view>
      </view>

      <!-- 发布者信息 -->
      <view class="publisher-section">
        <view class="section-title">发布者</view>
        <view class="publisher-info">
          <image :src="taskDetail.publisher.avatar" class="publisher-avatar" mode="aspectFill"></image>
          <view class="publisher-details">
            <text class="publisher-name">{{ taskDetail.publisher.name }}</text>
            <text class="publisher-rating">评分：{{ taskDetail.publisher.rating }}/5.0</text>
          </view>
          <button class="contact-btn" @click="contactPublisher">
            <u-icon name="message" size="16" color="#3b5598"></u-icon>
            <text>联系</text>
          </button>
        </view>
      </view>

      <!-- 接单者信息 -->
      <view class="assignee-section" v-if="taskDetail.assignee">
        <view class="section-title">接单者</view>
        <view class="assignee-info">
          <image :src="taskDetail.assignee.avatar" class="assignee-avatar" mode="aspectFill"></image>
          <view class="assignee-details">
            <text class="assignee-name">{{ taskDetail.assignee.name }}</text>
            <text class="assignee-rating">评分：{{ taskDetail.assignee.rating }}/5.0</text>
          </view>
          <button class="contact-btn" @click="contactAssignee">
            <u-icon name="message" size="16" color="#3b5598"></u-icon>
            <text>联系</text>
          </button>
        </view>
      </view>

      <!-- 任务进度 -->
      <view class="progress-section" v-if="taskDetail.status === 'pending' && taskDetail.progress">
        <view class="section-title">任务进度</view>
        <view class="progress-info">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: taskDetail.progress + '%' }"></view>
          </view>
          <text class="progress-text">{{ taskDetail.progress }}%</text>
        </view>
        <view class="progress-updates" v-if="taskDetail.updates">
          <view class="update-item" v-for="(update, index) in taskDetail.updates" :key="index">
            <text class="update-time">{{ update.time }}</text>
            <text class="update-content">{{ update.content }}</text>
          </view>
        </view>
      </view>

      <!-- 图片附件 -->
      <view class="attachments-section" v-if="taskDetail.images && taskDetail.images.length > 0">
        <view class="section-title">图片附件</view>
        <view class="images-grid">
          <image
            v-for="(image, index) in taskDetail.images"
            :key="index"
            :src="image"
            class="task-image"
            mode="aspectFill"
            @click="previewImage(index)"
          ></image>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-bar" v-if="taskDetail">
      <button class="action-btn cancel" v-if="canCancel" @click="cancelTask">取消任务</button>
      <button class="action-btn accept" v-if="canAccept" @click="acceptTask">接单</button>
      <button class="action-btn complete" v-if="canComplete" @click="completeTask">确认完成</button>
      <button class="action-btn contact" v-if="canContact" @click="contactUser">联系对方</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      taskId: null,
      taskDetail: null,
      currentUser: {
        id: 'user001',
        name: '当前用户'
      }
    }
  },
  computed: {
    canCancel() {
      return this.taskDetail &&
             this.taskDetail.publisher.id === this.currentUser.id &&
             this.taskDetail.status === 'pending'
    },
    canAccept() {
      return this.taskDetail &&
             this.taskDetail.publisher.id !== this.currentUser.id &&
             !this.taskDetail.assignee &&
             this.taskDetail.status === 'pending'
    },
    canComplete() {
      return this.taskDetail &&
             ((this.taskDetail.assignee && this.taskDetail.assignee.id === this.currentUser.id) ||
              (this.taskDetail.publisher.id === this.currentUser.id)) &&
             this.taskDetail.status === 'pending'
    },
    canContact() {
      return this.taskDetail &&
             this.taskDetail.status === 'pending' &&
             ((this.taskDetail.assignee && this.taskDetail.assignee.id === this.currentUser.id) ||
              (this.taskDetail.publisher.id === this.currentUser.id))
    }
  },
  onLoad(options) {
    this.taskId = options.id
    this.loadTaskDetail()
  },
  methods: {
    loadTaskDetail() {
      // 模拟加载任务详情
      this.taskDetail = {
        id: this.taskId,
        title: '修理水龙头漏水',
        description: '厨房水龙头漏水需要修理，已经持续了一周时间。漏水主要在水龙头底部连接处，需要更换密封圈。希望有相关维修经验的师傅能够处理，需要自备基本工具。',
        type: 'repair',
        status: 'pending',
        requirements: [
          '需要有水管维修经验',
          '能够自备基本维修工具',
          '工作态度认真负责',
          '维修后需要确保不漏水'
        ],
        reward: '50元',
        rewardType: 'cash',
        rewardDesc: '完成维修并确认不漏水后立即支付',
        createTime: '2024-11-15 10:30',
        deadline: '2024-11-20 18:00',
        publisher: {
          id: 'user002',
          name: '张先生',
          avatar: '/static/images/avatar1.png',
          rating: 4.8
        },
        assignee: null,
        progress: 0,
        updates: [],
        images: [
          '/static/images/leak1.jpg',
          '/static/images/leak2.jpg'
        ]
      }
    },

    getTaskTypeIcon(type) {
      const icons = {
        repair: 'hammer',
        cleaning: 'broom',
        delivery: 'shopping-cart',
        other: 'help-circle'
      }
      return icons[type] || 'help-circle'
    },

    getTaskTypeText(type) {
      const typeMap = {
        repair: '维修',
        cleaning: '家政',
        delivery: '配送',
        other: '其他'
      }
      return typeMap[type] || '其他'
    },

    getStatusIcon(status) {
      const icons = {
        pending: 'clock',
        completed: 'checkmark-circle',
        cancelled: 'close-circle'
      }
      return icons[status] || 'help-circle'
    },

    getStatusColor(status) {
      const colors = {
        pending: '#fa8c16',
        completed: '#52c41a',
        cancelled: '#f5222d'
      }
      return colors[status] || '#666'
    },

    getTaskStatusText(status) {
      const statusMap = {
        pending: '进行中',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || '未知'
    },

    getRewardTypeText(type) {
      const typeMap = {
        cash: '现金',
        points: '积分',
        service: '服务'
      }
      return typeMap[type] || ''
    },

    contactPublisher() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    contactAssignee() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    contactUser() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    cancelTask() {
      uni.showModal({
        title: '取消任务',
        content: '确定要取消这个任务吗？取消后将无法恢复。',
        success: (res) => {
          if (res.confirm) {
            this.taskDetail.status = 'cancelled'
            uni.showToast({
              title: '任务已取消',
              icon: 'success'
            })
          }
        }
      })
    },

    acceptTask() {
      uni.showModal({
        title: '确认接单',
        content: '确定要接取这个任务吗？接单后请及时联系发布者确认细节。',
        success: (res) => {
          if (res.confirm) {
            this.taskDetail.assignee = {
              id: this.currentUser.id,
              name: this.currentUser.name,
              avatar: '/static/logo.png',
              rating: 4.5
            }
            uni.showToast({
              title: '接单成功',
              icon: 'success'
            })
          }
        }
      })
    },

    completeTask() {
      uni.showModal({
        title: '确认完成',
        content: '确定任务已经完成了吗？请确保所有工作都已按要求完成。',
        success: (res) => {
          if (res.confirm) {
            this.taskDetail.status = 'completed'
            this.taskDetail.completeTime = this.formatTime(new Date())
            uni.showToast({
              title: '任务已完成',
              icon: 'success'
            })
          }
        }
      })
    },

    previewImage(index) {
      if (this.taskDetail.images) {
        uni.previewImage({
          urls: this.taskDetail.images,
          current: index
        })
      }
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
.task-detail-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;

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

    .status-card {
      background: white;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 30rpx;
      border-left: 6rpx solid #3b5598;

      &.completed {
        border-left-color: #52c41a;
      }

      &.cancelled {
        border-left-color: #f5222d;
      }

      .status-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;

        .task-type {
          display: flex;
          align-items: center;
          padding: 8rpx 16rpx;
          border-radius: 16rpx;
          font-size: 24rpx;
          color: white;

          text {
            margin-left: 8rpx;
          }

          &.repair {
            background: #ff6b35;
          }

          &.cleaning {
            background: #07c160;
          }

          &.delivery {
            background: #3b5598;
          }

          &.other {
            background: #9c27b0;
          }
        }

        .task-status {
          display: flex;
          align-items: center;

          text {
            margin-left: 6rpx;
            font-size: 24rpx;
            font-weight: 500;
          }
        }
      }

      .task-title {
        font-size: 32rpx;
        color: #333;
        font-weight: 600;
        line-height: 1.4;
      }
    }

    .info-section, .reward-section, .publisher-section, .assignee-section, .progress-section, .attachments-section {
      background: white;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;

      .section-title {
        font-size: 28rpx;
        color: #333;
        font-weight: 600;
        margin-bottom: 20rpx;
        position: relative;
        padding-left: 20rpx;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 6rpx;
          height: 24rpx;
          background: #3b5598;
          border-radius: 3rpx;
        }
      }

      .task-description {
        font-size: 26rpx;
        color: #666;
        line-height: 1.6;
      }

      .requirements-list {
        .requirement-item {
          display: block;
          font-size: 26rpx;
          color: #666;
          line-height: 1.6;
          margin-bottom: 10rpx;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      .info-grid {
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15rpx 0;
          border-bottom: 1rpx solid #f0f0f0;

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

            &.deadline {
              color: #ff6b35;
            }
          }
        }
      }
    }

    .reward-section {
      .reward-info {
        .reward-amount {
          display: flex;
          align-items: baseline;
          margin-bottom: 10rpx;

          .reward-value {
            font-size: 36rpx;
            color: #ff6b35;
            font-weight: 700;
          }

          .reward-type {
            font-size: 24rpx;
            color: #ff6b35;
            margin-left: 8rpx;
          }
        }

        .reward-desc {
          font-size: 24rpx;
          color: #999;
          line-height: 1.5;
        }
      }
    }

    .publisher-section, .assignee-section {
      .publisher-info, .assignee-info {
        display: flex;
        align-items: center;

        .publisher-avatar, .assignee-avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }

        .publisher-details, .assignee-details {
          flex: 1;

          .publisher-name, .assignee-name {
            display: block;
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
            margin-bottom: 6rpx;
          }

          .publisher-rating, .assignee-rating {
            font-size: 24rpx;
            color: #999;
          }
        }

        .contact-btn {
          display: flex;
          align-items: center;
          background: #f0f0f0;
          border: none;
          border-radius: 20rpx;
          padding: 12rpx 20rpx;
          font-size: 24rpx;
          color: #3b5598;

          text {
            margin-left: 6rpx;
          }
        }
      }
    }

    .progress-section {
      .progress-info {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;

        .progress-bar {
          flex: 1;
          height: 8rpx;
          background: #f0f0f0;
          border-radius: 4rpx;
          margin-right: 20rpx;
          overflow: hidden;

          .progress-fill {
            height: 100%;
            background: #3b5598;
            border-radius: 4rpx;
            transition: width 0.3s ease;
          }
        }

        .progress-text {
          font-size: 26rpx;
          color: #3b5598;
          font-weight: 600;
        }
      }

      .progress-updates {
        .update-item {
          margin-bottom: 15rpx;

          .update-time {
            display: block;
            font-size: 22rpx;
            color: #999;
            margin-bottom: 6rpx;
          }

          .update-content {
            font-size: 24rpx;
            color: #666;
            line-height: 1.5;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .attachments-section {
      .images-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15rpx;

        .task-image {
          width: 100%;
          height: 150rpx;
          border-radius: 8rpx;
        }
      }
    }
  }

  .action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f0f0f0;
    display: flex;
    gap: 20rpx;

    .action-btn {
      flex: 1;
      height: 80rpx;
      border-radius: 8rpx;
      font-size: 28rpx;
      font-weight: 600;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;

      text {
        margin-left: 8rpx;
      }

      &.cancel {
        background: #f0f0f0;
        color: #666;
      }

      &.accept {
        background: #07c160;
        color: white;
      }

      &.complete {
        background: #3b5598;
        color: white;
      }

      &.contact {
        background: #ff6b35;
        color: white;
      }
    }
  }
}
</style>
