<template>
  <view class="my-tasks-page">
    <view class="content">
      <view class="task-tabs">
        <view
          class="tab-item"
          :class="{ active: currentTab === 'published' }"
          @click="switchTab('published')"
        >
          <text>我发布的</text>
          <view class="badge" v-if="getTabCount('published') > 0">{{ getTabCount('published') }}</view>
        </view>
        <view
          class="tab-item"
          :class="{ active: currentTab === 'taken' }"
          @click="switchTab('taken')"
        >
          <text>我领取的</text>
          <view class="badge" v-if="getTabCount('taken') > 0">{{ getTabCount('taken') }}</view>
        </view>
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
              <view class="meta-item" v-if="task.deadlineTime">
                <u-icon name="alert-circle" size="14" color="#ff6b35"></u-icon>
                截止: {{ formatTime(task.deadlineTime) }}
              </view>
              <view class="meta-item" v-if="currentTab === 'taken' && task.takeTime">
                <u-icon name="checkmark-circle" size="14" color="#52c41a"></u-icon>
                领取: {{ formatTime(task.takeTime) }}
              </view>
              <view class="meta-item" v-if="currentTab === 'taken' && task.completeTime">
                <u-icon name="checkmark" size="14" color="#52c41a"></u-icon>
                完成: {{ formatTime(task.completeTime) }}
              </view>
            </view>
            <view class="task-reward" v-if="task.rewardPoints > 0">
              <text class="reward-label">奖励</text>
              <text class="reward-value">{{ task.rewardPoints }}积分</text>
            </view>
          </view>

          <view class="task-footer">
            <view class="partner-info" v-if="currentTab === 'published' && task.takerName">
              <text class="partner-label">领取者：</text>
              <text class="partner-name">{{ task.takerName }}</text>
            </view>
            <view class="partner-info" v-else-if="currentTab === 'taken' && task.publisherName">
              <text class="partner-label">发布者：</text>
              <text class="partner-name">{{ task.publisherName }}</text>
            </view>
            <view class="task-actions">
              <button
                class="action-btn"
                v-if="canCancelTask(task)"
                @click.stop="handleCancelTask(task)"
              >
                取消任务
              </button>
              <button
                class="action-btn primary"
                v-if="canCompleteTask(task)"
                @click.stop="completeTask(task)"
              >
                完成任务
              </button>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else-if="!loading">
        <view class="empty-icon">📋</view>
        <text class="empty-text">暂无{{ currentTab === 'published' ? '发布' : '领取' }}的任务</text>
        <text class="empty-desc">{{ currentTab === 'published' ? '快去发布第一个任务吧' : '快去参与社区任务吧' }}</text>
        <button class="empty-action-btn" @click="publishTask" v-if="currentTab === 'published'">
          <u-icon name="plus" size="20" color="#3b5598"></u-icon>
          <text>发布任务</text>
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
import { getMyPublishedTasks, getMyTakenTasks, cancelTask as apiCancelTask, completeTask as apiCompleteTask } from '@/api/list/tasks'
export default {
  name: 'my-tasks',
  data() {
    return {
      currentTab: 'published',
      publishedTasks: [],
      takenTasks: [],
      loading: false,
      userInfo: null // 这里应该从全局状态获取用户信息
    }
  },
  computed: {
    filteredTasks() {
      return this.currentTab === 'published' ? this.publishedTasks : this.takenTasks
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
        const [publishedRes, takenRes] = await Promise.all([
          getMyPublishedTasks(),
          getMyTakenTasks()
        ])

        this.publishedTasks = publishedRes.records || []
        this.takenTasks = takenRes.records || []

      } catch (error) {
        uni.showToast({
          title: '获取任务列表失败',
          icon: 'none'
        })
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

    getTabCount(tab) {
      return tab === 'published' ? this.publishedTasks.length : this.takenTasks.length
    },

    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },

    canCancelTask(task) {
      // 只有发布的任务且状态为进行中才能取消
      return this.currentTab === 'published' && (task.taskStatus === 1 || task.taskStatus === 2)
    },

    canCompleteTask(task) {
      // 只有领取的任务且状态为进行中才能完成
      return this.currentTab === 'taken' && task.taskStatus === 2
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

    async handleCancelTask(task) {
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
        await apiCancelTask(task.id)
        uni.showToast({ title: '取消成功', icon: 'success' })
        // 刷新任务列表
        await this.loadTasks()

      } finally {
        uni.hideLoading()
      }
    },

    async completeTask(task) {
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
        await apiCompleteTask(task.id)

        uni.showToast({
          title: '任务已完成',
          icon: 'success'
        })

        // 刷新任务列表
        await this.loadTasks()

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
.my-tasks-page {
  background: #f5f5f5;
  min-height: 100vh;

  .header {
    background: linear-gradient(135deg, #3b5598 0%, #5a7bcd 100%);
    padding: 40rpx 30rpx;
    color: white;

    .title {
      font-size: 36rpx;
      font-weight: 600;
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
            padding: 6rpx 12rpx;
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

          .task-status {
            font-size: 22rpx;
            padding: 6rpx 12rpx;
            border-radius: 12rpx;

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
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
            margin-bottom: 8rpx;
            line-height: 1.4;
          }

          .task-desc {
            font-size: 24rpx;
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
              font-size: 22rpx;
              color: #999;
              margin-bottom: 6rpx;

              u-icon {
                margin-right: 6rpx;
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
              font-size: 20rpx;
              color: #999;
              margin-bottom: 4rpx;
            }

            .reward-value {
              font-size: 26rpx;
              color: #ff6b35;
              font-weight: 600;
            }
          }
        }

        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15rpx;

          .partner-info {
            flex: 1;
            display: flex;
            align-items: center;
            font-size: 22rpx;
            color: #666;

            .partner-label {
              color: #999;
              margin-right: 8rpx;
            }

            .partner-name {
              color: #333;
              font-weight: 500;
            }
          }

          .task-actions {
            display: flex;
            gap: 12rpx;

            .action-btn {
              padding: 8rpx 16rpx;
              border-radius: 20rpx;
              font-size: 22rpx;
              border: none;

              &.primary {
                background: #3b5598;
                color: white;
              }

              &:not(.primary) {
                background: #fff;
                color: #f5222d;
                border: 1rpx solid #f5222d;
              }
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
