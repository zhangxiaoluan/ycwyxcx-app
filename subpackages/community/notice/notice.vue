<template>
  <view class="notice-page">
    <view class="content">
      <view class="notice-tabs">
        <view class="tab-item" :class="currentTab === 'all' ? 'active' : ''" @click="switchTab('all')">
          <text>全部</text>
          <view class="badge" v-if="getTabCount('all') > 0">{{ getTabCount('all') }}</view>
        </view>
        <view class="tab-item"
              v-for="category in categoriesData"
              :key="category.id"
              :class="currentTab === category.id ? 'active' : ''"
              @click="switchTab(category.id)">
          <text>{{ category.name }}</text>
          <view class="badge" v-if="category.unreadCount > 0">{{ category.unreadCount }}</view>
        </view>
      </view>

      <view class="notice-list">
        <view class="notice-item" v-for="notice in filteredNotices" :key="notice.id" @click="viewNoticeDetail(notice)">
          <view class="notice-header">
            <view class="notice-type" :class="'priority-' + (notice.priority === 0 ? 'normal' : notice.priority === 1 ? 'important' : 'urgent')">
              <u-icon :name="getPriorityIcon(notice.priority)" size="16" color="#fff"></u-icon>
              <text>{{ getPriorityText(notice.priority) }}</text>
            </view>
            <view class="notice-time">{{ notice.publishTime }}</view>
          </view>

          <view class="notice-content">
            <text class="notice-title">{{ notice.title }}</text>
            <text class="notice-summary">{{ notice.summary || notice.content }}</text>
          </view>

          <view class="notice-footer">
            <view class="notice-meta">
              <text class="publisher">
                <u-icon name="account" size="14" color="#999"></u-icon>
                {{ notice.publisherName }}
              </text>
              <text class="view-count">
                <u-icon name="eye" size="14" color="#999"></u-icon>
                {{ notice.viewCount || 0 }}
              </text>
            </view>
            <view class="unread-dot" v-if="!notice.isRead"></view>
          </view>

          <view class="top-badge" v-if="notice.isTop">
            <text>置顶</text>
          </view>
        </view>
      </view>

      <view class="empty-state" v-if="filteredNotices.length === 0">
        <view class="empty-icon">📢</view>
        <text class="empty-text">暂无公告</text>
        <text class="empty-desc">该分类下暂无公告</text>
      </view>
    </view>

    <u-modal v-model="showDetailModal" :title="selectedNotice ? selectedNotice.title : ''" :show-cancel-button="false" confirm-text="知道了" width="90%">
      <scroll-view class="notice-detail" scroll-y v-if="selectedNotice">
        <view class="detail-header">
          <view class="detail-type" :class="selectedNotice.type">
            <u-icon :name="getTypeIcon(selectedNotice.type)" size="16" color="#fff"></u-icon>
            <text>{{ getTypeText(selectedNotice.type) }}</text>
          </view>
          <text class="detail-time">{{ selectedNotice.publishTime }}</text>
        </view>

        <view class="detail-content">
          <text class="detail-text">{{ selectedNotice.content }}</text>
        </view>

        <view class="detail-images" v-if="selectedNotice.images && selectedNotice.images.length > 0">
          <image v-for="(image, index) in selectedNotice.images" :key="index" :src="image" class="detail-image" mode="widthFix" @click="previewImage(index)"></image>
        </view>

        <view class="detail-footer">
          <text class="detail-publisher">发布人：{{ selectedNotice.publisherName }}</text>
          <text class="detail-views">阅读：{{ selectedNotice.viewCount || 0 }}次</text>
        </view>
      </scroll-view>
    </u-modal>
  </view>
</template>

<script>
import {categories, categoriesList, categoriesRead} from "@/api/list/notice";
export default {
  data() {
    return {
      currentTab: 'all',
      showDetailModal: false,
      selectedNotice: null,
      notices: [],
      categoriesData: []
    }
  },
  computed: {
    filteredNotices() {
      let filtered = this.notices

      if (this.currentTab !== 'all') {
        filtered = filtered.filter(notice => notice.categoryId === this.currentTab)
      }

      filtered.sort((a, b) => {
        if (a.isTop && !b.isTop) return -1
        if (!a.isTop && b.isTop) return 1
        if (a.priority === 2 && b.priority !== 2) return -1
        if (a.priority !== 2 && b.priority === 2) return 1
        return new Date(b.publishTime) - new Date(a.publishTime)
      })

      return filtered
    }
  },
  onLoad() {
    this.loadCategories()
    this.loadNotices()
  },
  methods: {
    // 加载公告分类
    async loadCategories() {
      try {
        const response = await categories()
        console.log('公告分类:', response)
        this.categoriesData = response || []
      } catch (error) {
        console.error('加载公告分类失败:', error)
      }
    },

    // 加载公告列表
    async loadNotices() {
      try {
        const response = await categoriesList()
        let records = response.records
        this.notices = records || []
      } catch (error) {
        console.error('加载公告列表失败:', error)
      }
    },

    // 切换标签页
    switchTab(tab) {
      this.currentTab = tab
    },

    // 获取标签页未读数量
    getTabCount(tab) {
      if (tab === 'all') {
        return this.notices.filter(n => !n.isRead).length
      }
      return this.notices.filter(n => n.categoryId === tab && !n.isRead).length
    },

    // 获取优先级图标
    getPriorityIcon(priority) {
      const icons = {
        0: 'info-circle', // 普通
        1: 'error-circle', // 重要
        2: 'alert-circle'  // 紧急
      }
      return icons[priority] || 'info-circle'
    },

    // 获取优先级文本
    getPriorityText(priority) {
      const textMap = {
        0: '普通',
        1: '重要',
        2: '紧急'
      }
      return textMap[priority] || '普通'
    },

  
    // 获取类型图标
    getTypeIcon(type) {
      const icons = {
        property: 'home',
        community: 'people'
      }
      return icons[type] || 'info-circle'
    },

    // 获取类型文本
    getTypeText(type) {
      const typeMap = {
        property: '物业',
        community: '社区'
      }
      return typeMap[type] || '通知'
    },

    // 查看公告详情
    async viewNoticeDetail(notice) {
      // 如果公告未读，调用已读接口
      if (!notice.isRead) {
        try {
          await categoriesRead(notice.id)
          notice.isRead = true
          notice.readTime = new Date().toISOString()
        } catch (error) {
          console.error('标记已读失败:', error)
        }
      }

      // 增加浏览次数
      notice.viewCount = (notice.viewCount || 0) + 1

      this.selectedNotice = notice
      this.showDetailModal = true
    }
  }
}
</script>

<style lang="scss">
.notice-page {
  background: #f5f5f5;
  min-height: 100vh;

  .content {
    padding: 30rpx;

    .notice-tabs {
      background: white;
      border-radius: 16rpx;
      padding: 20rpx;
      margin-bottom: 30rpx;
      display: flex;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }

      .tab-item {
        flex: none;
        min-width: 120rpx;
        text-align: center;
        padding: 15rpx 20rpx;
        position: relative;

        text {
          font-size: 26rpx;
          color: #666;
          transition: color 0.3s;
          white-space: nowrap;
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
          top: 8rpx;
          right: 15rpx;
          background: #f5222d;
          color: white;
          font-size: 18rpx;
          padding: 2rpx 6rpx;
          border-radius: 10rpx;
          min-width: 20rpx;
          text-align: center;
          transform: translateX(50%);
        }
      }
    }

    .notice-list {
      .notice-item {
        background: white;
        border-radius: 12rpx;
        padding: 25rpx;
        margin-bottom: 20rpx;
        position: relative;
        transition: transform 0.2s;

        &:active {
          transform: scale(0.98);
        }

        .notice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15rpx;

          .notice-type {
            display: flex;
            align-items: center;
            padding: 6rpx 12rpx;
            border-radius: 12rpx;
            font-size: 22rpx;
            color: white;

            text {
              margin-left: 6rpx;
            }

            &.priority-normal {
              background: #909399;
            }

            &.priority-important {
              background: #e6a23c;
            }

            &.priority-urgent {
              background: #f5222d;
            }

            &.property {
              background: #3b5598;
            }

            &.community {
              background: #07c160;
            }
          }

          .notice-time {
            font-size: 22rpx;
            color: #999;
          }
        }

        .notice-content {
          margin-bottom: 15rpx;

          .notice-title {
            display: block;
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
            margin-bottom: 8rpx;
            line-height: 1.4;
          }

          .notice-summary {
            font-size: 24rpx;
            color: #666;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }

        .notice-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .notice-meta {
            display: flex;
            gap: 20rpx;

            .publisher, .view-count {
              display: flex;
              align-items: center;
              font-size: 22rpx;
              color: #999;

              u-icon {
                margin-right: 6rpx;
              }
            }
          }

          .unread-dot {
            width: 12rpx;
            height: 12rpx;
            background: #f5222d;
            border-radius: 50%;
          }
        }

        .top-badge {
          position: absolute;
          top: -8rpx;
          right: -8rpx;
          background: #ff4757;
          color: white;
          font-size: 20rpx;
          padding: 4rpx 12rpx;
          border-radius: 12rpx;
          z-index: 2;
        }

        .emergency-badge {
          position: absolute;
          top: -8rpx;
          right: -8rpx;
          background: #f5222d;
          color: white;
          font-size: 20rpx;
          padding: 4rpx 12rpx;
          border-radius: 12rpx;
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
      }
    }
  }

  .notice-detail {
    max-height: 60vh;
    padding: 20rpx;

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      padding-bottom: 15rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .detail-type {
        display: flex;
        align-items: center;
        padding: 6rpx 12rpx;
        border-radius: 12rpx;
        font-size: 22rpx;
        color: white;

        text {
          margin-left: 6rpx;
        }

        &.property {
          background: #3b5598;
        }

        &.community {
          background: #07c160;
        }

        &.emergency {
          background: #f5222d;
        }
      }

      .detail-time {
        font-size: 22rpx;
        color: #999;
      }
    }

    .detail-content {
      margin-bottom: 20rpx;

      .detail-text {
        font-size: 26rpx;
        color: #333;
        line-height: 1.8;
        white-space: pre-line;
      }
    }

    .detail-images {
      margin-bottom: 20rpx;

      .detail-image {
        width: 100%;
        border-radius: 8rpx;
        margin-bottom: 15rpx;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .detail-footer {
      padding-top: 15rpx;
      border-top: 1rpx solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .detail-publisher, .detail-views {
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}
</style>
