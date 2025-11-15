<template>
  <view class="notice-page">
    <view class="header">
      <text class="title">社区公告</text>
      <view class="search-box">
        <u-icon name="search" size="20" color="#999"></u-icon>
        <input v-model="searchKeyword" class="search-input" placeholder="搜索公告" @input="onSearchInput" />
      </view>
    </view>

    <view class="content">
      <view class="notice-tabs">
        <view class="tab-item" :class="currentTab === 'all' ? 'active' : ''" @click="switchTab('all')">
          <text>全部</text>
          <view class="badge" v-if="getTabCount('all') > 0">{{ getTabCount('all') }}</view>
        </view>
        <view class="tab-item" :class="currentTab === 'property' ? 'active' : ''" @click="switchTab('property')">
          <text>物业</text>
          <view class="badge" v-if="getTabCount('property') > 0">{{ getTabCount('property') }}</view>
        </view>
        <view class="tab-item" :class="currentTab === 'community' ? 'active' : ''" @click="switchTab('community')">
          <text>社区</text>
          <view class="badge" v-if="getTabCount('community') > 0">{{ getTabCount('community') }}</view>
        </view>
        <view class="tab-item" :class="currentTab === 'emergency' ? 'active' : ''" @click="switchTab('emergency')">
          <text>紧急</text>
          <view class="badge" v-if="getTabCount('emergency') > 0">{{ getTabCount('emergency') }}</view>
        </view>
      </view>

      <view class="notice-list">
        <view class="notice-item" v-for="notice in filteredNotices" :key="notice.id" @click="viewNoticeDetail(notice)">
          <view class="notice-header">
            <view class="notice-type" :class="notice.type">
              <u-icon :name="getTypeIcon(notice.type)" size="16" color="#fff"></u-icon>
              <text>{{ getTypeText(notice.type) }}</text>
            </view>
            <view class="notice-time">{{ notice.publishTime }}</view>
          </view>

          <view class="notice-content">
            <text class="notice-title">{{ notice.title }}</text>
            <text class="notice-summary">{{ notice.summary }}</text>
          </view>

          <view class="notice-footer">
            <view class="notice-meta">
              <text class="publisher">
                <u-icon name="account" size="14" color="#999"></u-icon>
                {{ notice.publisher }}
              </text>
              <text class="view-count">
                <u-icon name="eye" size="14" color="#999"></u-icon>
                {{ notice.viewCount }}
              </text>
            </view>
            <view class="unread-dot" v-if="!notice.read"></view>
          </view>

          <view class="emergency-badge" v-if="notice.isEmergency">
            <text>紧急</text>
          </view>
        </view>
      </view>

      <view class="empty-state" v-if="filteredNotices.length === 0">
        <view class="empty-icon">📢</view>
        <text class="empty-text">暂无公告</text>
        <text class="empty-desc">{{ searchKeyword ? '没有找到相关公告' : '该分类下暂无公告' }}</text>
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
          <text class="detail-publisher">发布人：{{ selectedNotice.publisher }}</text>
          <text class="detail-views">阅读：{{ selectedNotice.viewCount }}次</text>
        </view>
      </scroll-view>
    </u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'all',
      searchKeyword: '',
      showDetailModal: false,
      selectedNotice: null,
      notices: [
        {
          id: 1,
          title: '停水通知',
          summary: '因管道维修，明日9:00-12:00将停水',
          content: '尊敬的业主：\n\n因小区主供水管道需要紧急维修，物业计划于明日（11月16日）上午9:00-12:00进行停水维修作业。请各位业主提前做好储水准备。\n\n维修期间给您带来的不便，敬请谅解。如有疑问，请联系物业服务中心。\n\n物业服务中心\n2024年11月15日',
          type: 'property',
          publisher: '物业服务中心',
          publishTime: '2024-11-15 16:30',
          viewCount: 156,
          read: false,
          isEmergency: true,
          images: []
        },
        {
          id: 2,
          title: '物业费缴纳通知',
          summary: '本月物业费即将到期，请及时缴纳',
          content: '尊敬的业主：\n\n本月物业费缴纳截止日期为11月30日，请您及时通过APP或前往物业服务中心缴纳。逾期将产生滞纳金。\n\n缴纳方式：\n1. APP在线缴纳\n2. 物业服务中心现场缴纳\n3. 银行转账\n\n感谢您的配合！',
          type: 'property',
          publisher: '财务部',
          publishTime: '2024-11-14 10:00',
          viewCount: 89,
          read: false,
          isEmergency: false,
          images: []
        },
        {
          id: 3,
          title: '社区联欢活动通知',
          summary: '本周末将举办社区联欢活动，欢迎参加',
          content: '亲爱的业主们：\n\n为增进邻里感情，丰富社区文化生活，物业将于本周六（11月18日）下午2:00在小区广场举办社区联欢活动。\n\n活动内容：\n- 文艺表演\n- 互动游戏\n- 美食品尝\n- 抽奖环节\n\n欢迎各位业主踊跃参加！',
          type: 'community',
          publisher: '社区居委会',
          publishTime: '2024-11-13 14:20',
          viewCount: 234,
          read: true,
          isEmergency: false,
          images: []
        }
      ]
    }
  },
  computed: {
    filteredNotices() {
      let filtered = this.notices

      if (this.currentTab !== 'all') {
        filtered = filtered.filter(notice => notice.type === this.currentTab)
      }

      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase()
        filtered = filtered.filter(notice =>
          notice.title.toLowerCase().includes(keyword) ||
          notice.summary.toLowerCase().includes(keyword) ||
          notice.content.toLowerCase().includes(keyword)
        )
      }

      filtered.sort((a, b) => {
        if (a.isEmergency && !b.isEmergency) return -1
        if (!a.isEmergency && b.isEmergency) return 1
        return new Date(b.publishTime) - new Date(a.publishTime)
      })

      return filtered
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab
    },

    getTabCount(tab) {
      if (tab === 'all') {
        return this.notices.filter(n => !n.read).length
      }
      return this.notices.filter(n => n.type === tab && !n.read).length
    },

    getTypeIcon(type) {
      const icons = {
        property: 'home',
        community: 'people',
        emergency: 'alert-circle'
      }
      return icons[type] || 'info-circle'
    },

    getTypeText(type) {
      const typeMap = {
        property: '物业',
        community: '社区',
        emergency: '紧急'
      }
      return typeMap[type] || '通知'
    },

    onSearchInput(e) {
      this.searchKeyword = e.detail.value
    },

    viewNoticeDetail(notice) {
      notice.read = true
      notice.viewCount++
      this.selectedNotice = notice
      this.showDetailModal = true
    },

    previewImage(index) {
      if (this.selectedNotice && this.selectedNotice.images) {
        uni.previewImage({
          urls: this.selectedNotice.images,
          current: index
        })
      }
    }
  }
}
</script>

<style lang="scss">
.notice-page {
  background: #f5f5f5;
  min-height: 100vh;

  .header {
    background: #3b5598;
    padding: 40rpx 30rpx;
    color: white;

    .title {
      font-size: 36rpx;
      font-weight: 600;
      margin-bottom: 20rpx;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20rpx;
      padding: 15rpx 20rpx;

      .search-input {
        flex: 1;
        font-size: 26rpx;
        color: white;
        margin-left: 15rpx;

        &::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }

  .content {
    padding: 30rpx;

    .notice-tabs {
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