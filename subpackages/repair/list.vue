<template>
  <view class="repair-list-page">
    <view class="header">
      <text class="title">报修管理</text>
      <view class="repair-stats">
        <view class="stat-item">
          <text class="stat-value">{{ repairStats.pending }}</text>
          <text class="stat-label">处理中</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ repairStats.completed }}</text>
          <text class="stat-label">已完成</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ repairStats.total }}</text>
          <text class="stat-label">总报修</text>
        </view>
      </view>
    </view>

    <view class="content">
      <view class="filter-tabs">
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
          <text>处理中</text>
          <view class="badge" v-if="getTabCount('pending') > 0">{{ getTabCount('pending') }}</view>
        </view>
        <view
          class="tab-item"
          :class="{ active: currentTab === 'completed' }"
          @click="switchTab('completed')"
        >
          <text>已完成</text>
        </view>
        <view
          class="tab-item"
          :class="{ active: currentTab === 'rated' }"
          @click="switchTab('rated')"
        >
          <text>已评价</text>
        </view>
      </view>

      <view class="repair-list" v-if="filteredRepairs.length > 0">
        <view
          class="repair-item"
          v-for="item in filteredRepairs"
          :key="item.id"
          @click="viewRepairDetail(item)"
        >
          <view class="item-header">
            <view class="category-info">
              <text class="category-name">{{ item.categoryName }}</text>
              <view class="urgency-badge" :class="'urgency-' + item.urgentLevel">
                {{ item.urgentLevelDesc }}
              </view>
            </view>
            <view class="status-badge" :class="'status-' + item.status">
              {{ item.statusDesc }}
            </view>
          </view>

          <view class="item-content">
            <text class="repair-title">{{ item.title }}</text>
            <text class="repair-desc" v-if="item.description">{{ item.description }}</text>
            <view class="repair-location" v-if="item.location">
              <u-icon name="map-pin" size="14" color="#666"></u-icon>
              <text>{{ item.location }}</text>
            </view>
          </view>

          <view class="item-images" v-if="item.imageList && item.imageList.length > 0">
            <image
              v-for="(img, index) in item.imageList.slice(0, 3)"
              :key="index"
              :src="img"
              mode="aspectFill"
              @click.stop="previewImage(item.imageList, index)"
            ></image>
            <view class="more-images" v-if="item.imageList.length > 3">
              <text>+{{ item.imageList.length - 3 }}</text>
            </view>
          </view>

          <view class="item-footer">
            <view class="time-info">
              <text class="create-time">申请时间：{{ formatTime(item.createdAt) }}</text>
              <text class="request-no">单号：{{ item.requestNo }}</text>
            </view>
            <view class="actions">
              <button
                class="action-btn-small"
                v-if="item.status === 4 && item.canRate"
                @click.stop="rateRepair(item)"
              >
                评价
              </button>
              <button
                class="action-btn-small"
                @click.stop="viewProgress(item)"
                v-if="item.status !== 1"
              >
                进度
              </button>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else-if="!loading">
        <u-icon name="warning" size="64" color="#ddd"></u-icon>
        <text class="empty-text">暂无报修记录</text>
        <button class="empty-btn" @click="applyRepair">申请报修</button>
      </view>

      <view class="loading-more" v-if="loading && filteredRepairs.length > 0">
        <u-loading-icon mode="circle" color="#3b5598"></u-loading-icon>
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getRepairList } from '@/api/list/repair'

export default {
  name: 'repair-list',
  data() {
    return {
      currentTab: 'all',
      repairList: [],
      loading: false,
      refreshing: false,
      hasMore: true,
      page: 1,
      pageSize: 10
    }
  },
  computed: {
    repairStats() {
      const pending = this.repairList.filter(item => item.status >= 2 && item.status <= 3).length
      const completed = this.repairList.filter(item => item.status === 4).length
      const total = this.repairList.length

      return { pending, completed, total }
    },
    filteredRepairs() {
      switch (this.currentTab) {
        case 'pending':
          return this.repairList.filter(item => item.status >= 2 && item.status <= 3)
        case 'completed':
          return this.repairList.filter(item => item.status === 4)
        case 'rated':
          return this.repairList.filter(item => item.rating > 0)
        default:
          return this.repairList
      }
    }
  },
  onLoad() {
    this.loadRepairList()
  },
  onPullDownRefresh() {
    this.refreshRepairList()
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadMoreRepairList()
    }
  },
  methods: {
    async loadRepairList() {
      if (this.loading) return

      this.loading = true
      try {
        const params = {
          page: 1,
          size: this.pageSize
        }
        const res = await getRepairList(params)

        this.repairList = res.records || []
        this.page = 1
        this.hasMore = this.repairList.length >= this.pageSize

      } catch (error) {
        uni.showToast({
          title: '获取报修列表失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
        uni.stopPullDownRefresh()
      }
    },
    async loadMoreRepairList() {
      if (this.loading || !this.hasMore) return

      this.loading = true
      try {
        const params = {
          page: this.page + 1,
          size: this.pageSize
        }
        const res = await getRepairList(params)

        const newRepairs = res.records || []
        this.repairList = [...this.repairList, ...newRepairs]
        this.page += 1
        this.hasMore = newRepairs.length >= this.pageSize

      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    async refreshRepairList() {
      this.refreshing = true
      try {
        await this.loadRepairList()
      } finally {
        this.refreshing = false
      }
    },
    switchTab(tab) {
      this.currentTab = tab
    },
    getTabCount(tab) {
      switch (tab) {
        case 'pending':
          return this.repairStats.pending
        case 'completed':
          return this.repairStats.completed
        case 'all':
          return this.repairStats.total
        default:
          return 0
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
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    applyRepair() {
      uni.navigateTo({
        url: '/subpackages/repair/apply'
      })
    },
    viewRepairDetail(item) {
      uni.navigateTo({
        url: `/subpackages/repair/detail?id=${item.id}`
      })
    },
    viewProgress(item) {
      uni.navigateTo({
        url: `/subpackages/repair/progress?requestId=${item.id}&requestNo=${item.requestNo}`
      })
    },
    rateRepair(item) {
      uni.navigateTo({
        url: `/subpackages/repair/rate?id=${item.id}`
      })
    },
    previewImage(images, current) {
      uni.previewImage({
        urls: images,
        current: current
      })
    }
  }
}
</script>

<style scoped lang="scss">
.repair-list-page {
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
    display: block;
    margin-bottom: 20rpx;
  }

  .repair-stats {
    display: flex;
    gap: 40rpx;

    .stat-item {
      text-align: center;

      .stat-value {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
        display: block;
        margin-bottom: 8rpx;
      }

      .stat-label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.content {
  padding: 20rpx;
}

.filter-tabs {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  gap: 20rpx;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 20rpx 10rpx;
    border-radius: 12rpx;
    position: relative;

    &.active {
      background: #f0f5ff;
      color: #3b5598;

      text {
        font-weight: 600;
      }
    }

    text {
      font-size: 28rpx;
      color: #666;
    }

    .badge {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      background: #f5222d;
      color: #fff;
      font-size: 20rpx;
      padding: 4rpx 8rpx;
      border-radius: 10rpx;
      min-width: 20rpx;
      height: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}



.repair-list {
  .repair-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);

    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .category-info {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .category-name {
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
        }

        .urgency-badge {
          padding: 6rpx 12rpx;
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
      }

      .status-badge {
        padding: 6rpx 12rpx;
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
    }

    .item-content {
      margin-bottom: 20rpx;

      .repair-title {
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
        display: block;
        margin-bottom: 12rpx;
      }

      .repair-desc {
        font-size: 26rpx;
        color: #666;
        display: block;
        margin-bottom: 12rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .repair-location {
        display: flex;
        align-items: center;
        gap: 8rpx;

        text {
          font-size: 24rpx;
          color: #999;
        }
      }
    }

    .item-images {
      display: flex;
      gap: 12rpx;
      margin-bottom: 20rpx;

      image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 8rpx;
      }

      .more-images {
        width: 120rpx;
        height: 120rpx;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        text {
          color: #fff;
          font-size: 24rpx;
        }
      }
    }

    .item-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .time-info {
        flex: 1;

        .create-time, .request-no {
          font-size: 22rpx;
          color: #999;
          display: block;
          margin-bottom: 4rpx;
        }
      }

      .actions {
        display: flex;
        gap: 16rpx;

        .action-btn-small {
          padding: 12rpx 24rpx;
          background: #f0f5ff;
          color: #3b5598;
          border-radius: 20rpx;
          font-size: 24rpx;
          border: none;
        }
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 100rpx 40rpx;

  .empty-text {
    font-size: 28rpx;
    color: #999;
    display: block;
    margin: 40rpx 0 60rpx;
  }

  .u-icon{
    justify-content: center;
  }

  .empty-btn {
    height: 80rpx;
    background: #3b5598;
    color: #fff;
    border-radius: 40rpx;
    padding: 0 60rpx;
    font-size: 28rpx;
    border: none;
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
</style>
