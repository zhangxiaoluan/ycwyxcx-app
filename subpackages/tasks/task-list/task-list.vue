<template>
  <view class="task-list-page">
    <view class="header">
      <text class="title">任务中心</text>
      <view class="task-stats">
        <view class="stat-item">
          <text class="stat-value">{{ taskStats.pending }}</text>
          <text class="stat-label">进行中</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ taskStats.completed }}</text>
          <text class="stat-label">已完成</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ taskStats.total }}</text>
          <text class="stat-label">总任务</text>
        </view>
      </view>
    </view>

    <view class="content">
      <view class="task-tabs">
        <view
          class="tab-item"
          :class="{ active: currentTab === 'all' }"
          @click="switchTab('all')"
        >
          <text>全部</text>
          <view class="badge" v-if="getTabCount('all') > 0">{{ getTabCount('all') }}</view>
        </view>
        <view
          class="tab-item"
          :class="{ active: currentTab === 'pending' }"
          @click="switchTab('pending')"
        >
          <text>进行中</text>
          <view class="badge" v-if="getTabCount('pending') > 0">{{ getTabCount('pending') }}</view>
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
        <button class="action-btn filter" @click="showFilter">
          <u-icon name="funnel" size="16" color="#3b5598"></u-icon>
          <text>筛选</text>
        </button>
      </view>

      <view class="task-list">
        <view class="task-item" v-for="task in filteredTasks" :key="task.id" @click="viewTaskDetail(task)">
          <view class="task-header">
            <view class="task-type" :class="task.type">
              <u-icon :name="getTaskTypeIcon(task.type)" size="16" color="#fff"></u-icon>
              <text>{{ getTaskTypeText(task.type) }}</text>
            </view>
            <view class="task-status" :class="task.status">
              {{ getTaskStatusText(task.status) }}
            </view>
          </view>

          <view class="task-content">
            <text class="task-title">{{ task.title }}</text>
            <text class="task-desc">{{ task.description }}</text>
          </view>

          <view class="task-info">
            <view class="task-meta">
              <text class="meta-item">
                <u-icon name="clock" size="14" color="#999"></u-icon>
                {{ task.createTime }}
              </text>
              <text class="meta-item" v-if="task.deadline">
                <u-icon name="alert-circle" size="14" color="#ff6b35"></u-icon>
                截止: {{ task.deadline }}
              </text>
            </view>
            <view class="task-reward" v-if="task.reward">
              <text class="reward-label">奖励</text>
              <text class="reward-value">{{ task.reward }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-if="filteredTasks.length === 0">
        <view class="empty-icon">📋</view>
        <text class="empty-text">暂无任务</text>
        <text class="empty-desc">快去发布或参与任务吧</text>
        <button class="empty-action-btn" @click="publishTask">
          <u-icon name="plus" size="20" color="#3b5598"></u-icon>
          <text>发布第一个任务</text>
        </button>
      </view>
    </view>

    <!-- 筛选弹窗 -->
    <u-modal
      v-model="showFilterModal"
      title="任务筛选"
      @confirm="applyFilter"
      @cancel="cancelFilter"
    >
      <view class="filter-form">
        <view class="filter-item">
          <text class="filter-label">任务类型</text>
          <view class="filter-options">
            <label class="option-item" v-for="type in taskTypes" :key="type.value">
              <checkbox :value="type.value" :checked="filterTypes.includes(type.value)" @change="onTypeChange" />
              <text>{{ type.label }}</text>
            </label>
          </view>
        </view>

        <view class="filter-item">
          <text class="filter-label">奖励类型</text>
          <view class="filter-options">
            <label class="option-item" v-for="reward in rewardTypes" :key="reward.value">
              <checkbox :value="reward.value" :checked="filterRewards.includes(reward.value)" @change="onRewardChange" />
              <text>{{ reward.label }}</text>
            </label>
          </view>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'all',
      showFilterModal: false,
      filterTypes: [],
      filterRewards: [],
      taskTypes: [
        { label: '维修服务', value: 'repair' },
        { label: '家政服务', value: 'cleaning' },
        { label: '配送服务', value: 'delivery' },
        { label: '其他服务', value: 'other' }
      ],
      rewardTypes: [
        { label: '现金奖励', value: 'cash' },
        { label: '积分奖励', value: 'points' },
        { label: '服务兑换', value: 'service' }
      ],
      tasks: [
        {
          id: 1,
          title: '修理水龙头漏水',
          description: '厨房水龙头漏水需要修理，有相关经验的师傅请联系',
          type: 'repair',
          status: 'pending',
          reward: '50元',
          rewardType: 'cash',
          createTime: '2024-11-15',
          deadline: '2024-11-20'
        },
        {
          id: 2,
          title: '全屋深度清洁',
          description: '三室一厅需要深度清洁，包括厨房和卫生间',
          type: 'cleaning',
          status: 'pending',
          reward: '200元',
          rewardType: 'cash',
          createTime: '2024-11-14',
          deadline: '2024-11-25'
        },
        {
          id: 3,
          title: '代购生活用品',
          description: '帮忙到超市购买生活用品，清单如下...',
          type: 'delivery',
          status: 'completed',
          reward: '20积分',
          rewardType: 'points',
          createTime: '2024-11-13'
        },
        {
          id: 4,
          title: '搬运家具',
          description: '需要帮忙搬运一些家具到楼上',
          type: 'other',
          status: 'pending',
          reward: '100元',
          rewardType: 'cash',
          createTime: '2024-11-12',
          deadline: '2024-11-18'
        },
        {
          id: 5,
          title: '照顾宠物',
          description: '出差期间需要帮忙照顾猫咪一周',
          type: 'other',
          status: 'completed',
          reward: '50积分',
          rewardType: 'points',
          createTime: '2024-11-10'
        }
      ]
    }
  },
  computed: {
    taskStats() {
      const pending = this.tasks.filter(task => task.status === 'pending').length
      const completed = this.tasks.filter(task => task.status === 'completed').length
      return {
        pending,
        completed,
        total: this.tasks.length
      }
    },
    filteredTasks() {
      let filtered = this.tasks

      // 按状态筛选
      if (this.currentTab === 'pending') {
        filtered = filtered.filter(task => task.status === 'pending')
      } else if (this.currentTab === 'completed') {
        filtered = filtered.filter(task => task.status === 'completed')
      }

      // 按类型筛选
      if (this.filterTypes.length > 0) {
        filtered = filtered.filter(task => this.filterTypes.includes(task.type))
      }

      // 按奖励类型筛选
      if (this.filterRewards.length > 0) {
        filtered = filtered.filter(task => this.filterRewards.includes(task.rewardType))
      }

      return filtered
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab
    },

    getTabCount(tab) {
      if (tab === 'all') {
        return this.tasks.length
      } else if (tab === 'pending') {
        return this.tasks.filter(task => task.status === 'pending').length
      }
      return 0
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

    getTaskStatusText(status) {
      const statusMap = {
        pending: '进行中',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || '未知'
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

    showFilter() {
      this.showFilterModal = true
    },

    onTypeChange(e) {
      this.filterTypes = e.detail.value
    },

    onRewardChange(e) {
      this.filterRewards = e.detail.value
    },

    applyFilter() {
      this.showFilterModal = false
    },

    cancelFilter() {
      this.filterTypes = []
      this.filterRewards = []
      this.showFilterModal = false
    }
  }
}
</script>

<style lang="scss">
.task-list-page {
  background: #f5f5f5;
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

        &.filter {
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
            padding: 6rpx 12rpx;
            border-radius: 12rpx;
            font-size: 22rpx;
            color: white;

            text {
              margin-left: 6rpx;
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
            font-size: 22rpx;
            padding: 6rpx 12rpx;
            border-radius: 12rpx;

            &.pending {
              background: #fff7e6;
              color: #fa8c16;
            }

            &.completed {
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
  }

  .filter-form {
    .filter-item {
      margin-bottom: 30rpx;

      .filter-label {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 15rpx;
        font-weight: 500;
      }

      .filter-options {
        .option-item {
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
  }
}
</style>