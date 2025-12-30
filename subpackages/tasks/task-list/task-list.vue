<template>
  <view class="task-list-page">

    <view class="content">
      <view class="task-tabs">
        <view
          class="tab-item"
          :class="{ active: currentTab === 'all' }"
          @click="switchTab('all')"
        >
          <text>全部</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: currentTab === 'pending' }"
          @click="switchTab('pending')"
        >
          <text>进行中</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: currentTab === 'completed' }"
          @click="switchTab('completed')"
        >
          <text>已完成</text>
        </view>
      </view>

      <view class="task-actions">
        <button class="action-btn publish" @click="publishTask">
          <u-icon name="plus" size="16" color="#fff"></u-icon>
          <text>发布任务</text>
        </button>
        <button class="action-btn my-tasks" @click="viewMyTasks">
          <u-icon name="account-fill" size="16" color="#3b5598"></u-icon>
          <text>我的任务</text>
        </button>
      </view>

      <view class="task-list" v-if="filteredTasks.length > 0">
        <view
          class="task-item"
          v-for="task in filteredTasks"
          :key="task.id"
          @click="viewTaskDetail(task)"
        >
          <view class="task-header">
            <view class="task-type" :class="'task-type-' + task.taskType">
              <text>{{ task.taskTypeName }}</text>
            </view>
            <view class="task-status" :class="'task-status-' + task.taskStatus">
              {{ task.taskStatusName }}
            </view>
          </view>

          <view class="task-content">
            <text class="task-title">{{ task.title }}</text>
            <text class="task-desc">{{ task.content }}</text>
          </view>

          <view class="task-info">
            <view class="task-meta">
              <view class="meta-item">
                <u-icon name="clock" size="14" color="#999"></u-icon>
                {{ formatTime(task.publishTime) }}
              </view>
              <view class="meta-item" v-if="task.remainingHours > 0">
                <u-icon name="clock" size="14" color="#ff6b35"></u-icon>
                剩余{{ task.remainingHours }}小时
              </view>
              <view class="meta-item" v-if="task.deadlineTime">
                <u-icon name="calendar" size="14" color="#999"></u-icon>
                截止: {{ formatTime(task.deadlineTime) }}
              </view>
            </view>
            <view class="task-reward" v-if="task.rewardPoints > 0">
              <text class="reward-label">奖励</text>
              <text class="reward-value">{{ task.rewardPoints }}积分</text>
            </view>
          </view>

          <view class="task-footer">
            <view class="publisher-info" v-if="task.publisherName">
              <u-icon name="man-add-fill" size="16" color="#999"></u-icon>
              <text>{{ task.publisherName }}</text>
            </view>
            <view class="task-actions">
              <button
                class="take-btn"
                v-if="task.canTake && !task.hasApplied"
                @click.stop="handleTakeTask(task)"
              >
                领取任务
              </button>
              <text
                class="applied-text"
                v-else-if="task.hasApplied"
              >
                已申请
              </text>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else-if="!loading">
        <view class="empty-icon">📋</view>
        <text class="empty-text">暂无任务</text>
        <text class="empty-desc">快去发布或参与任务吧</text>
        <button class="empty-action-btn" @click="publishTask">
          <u-icon name="plus" size="20" color="#3b5598"></u-icon>
          <text>发布第一个任务</text>
        </button>
      </view>

      <view class="loading-more" v-if="loading">
        <u-loading-icon mode="circle" color="#3b5598"></u-loading-icon>
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getTaskList, takeTask as apiTakeTask } from '@/api/list/tasks'
export default {
  data() {
    return {
      currentTab: 'all',
      taskList: [],
      loading: false,
    }
  },
  computed: {
    // taskStats() {
    //   const pending = this.taskList.filter(task => task.taskStatus === 1 || task.taskStatus === 2).length
    //   const completed = this.taskList.filter(task => task.taskStatus === 3).length
    //   return {
    //     pending,
    //     completed,
    //     total: this.taskList.length
    //   }
    // },
    filteredTasks() {
      switch (this.currentTab) {
        case 'pending':
          return this.taskList.filter(task => task.taskStatus === 1 || task.taskStatus === 2)
        case 'completed':
          return this.taskList.filter(task => task.taskStatus === 3)
        default:
          return this.taskList
      }
    }
  },
  onLoad() {
    this.loadTasks()
  },
  onPullDownRefresh() {
    this.refreshTasks()
  },
  methods: {

    async loadTasks() {
      if (this.loading) return
      this.loading = true
      try {
        const res = await getTaskList()
        this.taskList = res.records || []
      } finally {
        this.loading = false
        uni.stopPullDownRefresh()
      }
    },

    async refreshTasks() {
      await this.loadTasks()
    },

    switchTab(tab) {
      this.currentTab = tab
    },

    // getTabCount(tab) {
    //   switch (tab) {
    //     case 'all':
    //       return this.taskList.length
    //     case 'pending':
    //       return this.taskStats.pending
    //     case 'completed':
    //       return this.taskStats.completed
    //     default:
    //       return 0
    //   }
    // },
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },

    publishTask() {
      uni.navigateTo({
        url: '/subpackages/tasks/task-publish/task-publish'
      })
    },

    viewTaskDetail(task) {
      uni.navigateTo({
        url: `/subpackages/tasks/task-detail/task-detail?id=${task.id}`
      })
    },

    viewMyTasks() {
      uni.navigateTo({
        url: '/subpackages/tasks/my-tasks/my-tasks'
      })
    },

    async handleTakeTask(task) {
      try {
        uni.showLoading({ title: '领取中...' })
        await apiTakeTask({ taskId: task.id })
        uni.showToast({ title: '领取成功', icon: 'success' })
        // 刷新任务列表
        await this.loadTasks()
      } finally {
        uni.hideLoading()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.task-list-page {
  background: linear-gradient(to right, #e0ecfa 0%, #f4f6f9 50%, #f6f4fc 100%);
  min-height: 100vh;

  .header {
    background: linear-gradient(135deg, #3b5598 0%, #5a7bcd 100%);
    padding: 40rpx 30rpx;
    color: white;

    .title {
      font-size: 36rpx;
      font-weight: 600;
      margin-bottom: 20rpx;
    }

    .task-stats {
      display: flex;
      gap: 40rpx;

      .stat-item {
        text-align: center;

        .stat-value {
          display: block;
          font-size: 32rpx;
          font-weight: 700;
          margin-bottom: 6rpx;
        }

        .stat-label {
          font-size: 22rpx;
          opacity: 0.8;
        }
      }
    }
  }

  .content {
    padding: 30rpx;

    .task-tabs {
      background: white;
      border-radius: 16rpx;
      padding: 20rpx;
      margin-bottom: 30rpx;
      display: flex;

      .tab-item {
        flex: 1;
        text-align: center;
        padding: 15rpx 0;
        position: relative;

        text {
          font-size: 26rpx;
          color: #666;
          transition: color 0.3s;
        }

        &.active {
          text {
            color: #3b5598;
            font-weight: 600;
          }

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40rpx;
            height: 4rpx;
            background: #3b5598;
            border-radius: 2rpx;
          }
        }

        .badge {
          position: absolute;
          top: 10rpx;
          right: 50%;
          transform: translateX(20rpx);
          background: #f5222d;
          color: white;
          font-size: 20rpx;
          padding: 2rpx 8rpx;
          border-radius: 12rpx;
          min-width: 24rpx;
          text-align: center;
        }
      }
    }

    .task-actions {
      display: flex;
      gap: 20rpx;
      margin-bottom: 30rpx;

      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 70rpx;
        border-radius: 8rpx;
        font-size: 26rpx;
        font-weight: 600;
        border: none;

        text {
          margin-left: 8rpx;
        }

        &.publish {
          flex: 2;
          background: #3b5598;
          color: white;
        }

        &.my-tasks {
          flex: 1;
          background: white;
          color: #3b5598;
          border: 1rpx solid #e0e0e0;
        }
      }
    }

    .task-list {
      .task-item {
        background: white;
        border-radius: 12rpx;
        padding: 25rpx;
        margin-bottom: 20rpx;
        transition: transform 0.2s;

        &:active {
          transform: scale(0.98);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15rpx;

          .task-type {
            display: flex;
            align-items: center;
            padding: 6rpx 18rpx;
            border-radius: 12rpx;
            font-size: 27rpx;
            color: white;

            &.task-type-1 {
              background: rgba(255, 107, 53, 0.1);
              color: rgba(255, 107, 53, 0.99);
            }

            &.task-type-2 {
              background: rgba(7, 193, 96, 0.1);
              color: rgba(7, 193, 96, 0.99);
            }

            &.task-type-3 {
              background: rgba(59, 85, 152, 0.1);
              color: rgba(59, 85, 152, 0.99);
            }

            &.task-type-4 {
              background: rgba(156, 39, 176, 0.1);
              color: rgba(156, 39, 176, 0.99);
            }
          }

          .task-status {
            padding: 6rpx 18rpx;
            border-radius: 12rpx;
            font-size: 27rpx;

            &.task-status-0, &.task-status-1 {
              background: #fff7e6;
              color: #fa8c16;
            }

            &.task-status-2 {
              background: #e6f7ff;
              color: #1890ff;
            }

            &.task-status-3 {
              background: #f6ffed;
              color: #52c41a;
            }
          }
        }

        .task-content {
          margin-bottom: 15rpx;

          .task-title {
            display: block;
            color: #333;
            font-weight: 500;
            margin-bottom: 8rpx;
            line-height: 1.4;
          }

          .task-desc {
            font-size: 26rpx;
            color: #666;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }

        .task-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;

          .task-meta {
            flex: 1;

            .meta-item {
              display: flex;
              align-items: center;
              font-size: 26rpx;
              color: #999;
              margin-bottom: 10rpx;

              .u-icon {
                margin-right: 10rpx;

              }

              &:last-child {
                margin-bottom: 0;
              }
            }
          }

          .task-reward {
            text-align: right;

            .reward-label {
              display: block;
              font-size: 25rpx;
              color: #999;
              margin-bottom: 4rpx;
            }

            .reward-value {
              font-size: 27rpx;
              color: #ff6b35;
              font-weight: 600;
            }
          }
        }

        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20rpx;

          .publisher-info {
            display: flex;
            align-items: center;
            font-size: 26rpx;
            color: #999;

            .u-icon {
              margin-right: 6rpx;
            }
          }

          .task-actions {
            margin-bottom: 0;
            .take-btn {
              background: #3b5598;
              color: white;
              border: none;
              border-radius: 15rpx;
              padding: 10rpx 20rpx;
              font-size: 26rpx;
              height: 55rpx;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .applied-text {
              font-size: 26rpx;
              color: #999;
            }
          }
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 100rpx 30rpx;

      .empty-icon {
        font-size: 120rpx;
        margin-bottom: 30rpx;
      }

      .empty-text {
        display: block;
        font-size: 32rpx;
        color: #333;
        margin-bottom: 10rpx;
        font-weight: 600;
      }

      .empty-desc {
        display: block;
        font-size: 26rpx;
        color: #999;
        margin-bottom: 40rpx;
      }

      .empty-action-btn {
        background: #3b5598;
        color: white;
        border: none;
        border-radius: 20rpx;
        padding: 20rpx 40rpx;
        font-size: 28rpx;
        font-weight: 600;
        display: inline-flex;
        align-items: center;

        text {
          margin-left: 10rpx;
        }
      }
    }

    .loading-more {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40rpx;
      gap: 16rpx;

      text {
        font-size: 26rpx;
        color: #999;
      }
    }
  }
}
</style>
