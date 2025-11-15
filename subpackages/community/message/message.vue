<template>
  <view class="message-page">


    <view class="tabs">
      <view
        class="tab-item"
        :class="{ active: currentTab === 'all' }"
        @click="switchTab('all')"
      >
        <text>全部</text>
        <view class="badge" v-if="unreadCount.all > 0">{{ unreadCount.all }}</view>
      </view>
      <view
        class="tab-item"
        :class="{ active: currentTab === 'notice' }"
        @click="switchTab('notice')"
      >
        <text>公告</text>
        <view class="badge" v-if="unreadCount.notice > 0">{{ unreadCount.notice }}</view>
      </view>
      <view
        class="tab-item"
        :class="{ active: currentTab === 'system' }"
        @click="switchTab('system')"
      >
        <text>系统</text>
        <view class="badge" v-if="unreadCount.system > 0">{{ unreadCount.system }}</view>
      </view>
    </view>

    <view class="message-list">
      <view
        class="message-item"
        v-for="(item, index) in filteredMessages"
        :key="index"
        @click="readMessage(item)"
      >
        <view class="message-content">
          <view class="message-header">
            <text class="message-title">{{ item.title }}</text>
            <text class="message-time">{{ item.time }}</text>
          </view>
          <text class="message-desc">{{ item.content }}</text>
        </view>
        <view class="unread-dot" v-if="!item.read"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'all',
      unreadCount: {
        all: 5,
        notice: 2,
        system: 3
      },
      messages: [
        {
          id: 1,
          type: 'notice',
          title: '物业缴费通知',
          content: '本月物业费即将到期，请及时缴纳',
          time: '2024-11-15 09:00',
          read: false
        },
        {
          id: 2,
          type: 'system',
          title: '系统升级通知',
          content: '系统将于今晚23:00-24:00进行升级维护',
          time: '2024-11-14 18:30',
          read: false
        },
        {
          id: 3,
          type: 'notice',
          title: '停水通知',
          content: '因管道维修，明日9:00-12:00将停水',
          time: '2024-11-14 16:00',
          read: true
        },
        {
          id: 4,
          type: 'system',
          title: '积分到账提醒',
          content: '恭喜您获得20积分奖励',
          time: '2024-11-13 20:15',
          read: false
        },
        {
          id: 5,
          type: 'notice',
          title: '小区活动通知',
          content: '本周末将举办社区联欢活动',
          time: '2024-11-13 10:00',
          read: true
        }
      ]
    }
  },
  computed: {
    filteredMessages() {
      if (this.currentTab === 'all') {
        return this.messages
      }
      return this.messages.filter(msg => msg.type === this.currentTab)
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab
    },

    readMessage(message) {
      if (!message.read) {
        message.read = true
        this.unreadCount.all--
        this.unreadCount[message.type]--
      }

      uni.showModal({
        title: message.title,
        content: message.content,
        showCancel: false,
        confirmText: '知道了'
      })
    }
  }
}
</script>

<style lang="scss">
.message-page {
  background: #f5f5f5;
  min-height: 100vh;

  .header {
    background: #3b5598;
    padding: 40rpx 30rpx;
    color: white;

    .title {
      font-size: 36rpx;
      font-weight: 600;
    }
  }

  .tabs {
    background: white;
    display: flex;
    padding: 0 30rpx;

    .tab-item {
      flex: 1;
      text-align: center;
      padding: 30rpx 0;
      position: relative;

      text {
        font-size: 28rpx;
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
          width: 60rpx;
          height: 4rpx;
          background: #3b5598;
          border-radius: 2rpx;
        }
      }

      .badge {
        position: absolute;
        top: 20rpx;
        right: 50%;
        transform: translateX(20rpx);
        background: #f5222d;
        color: white;
        font-size: 20rpx;
        padding: 4rpx 8rpx;
        border-radius: 12rpx;
        min-width: 24rpx;
        text-align: center;
      }
    }
  }

  .message-list {
    .message-item {
      background: white;
      margin: 20rpx 30rpx;
      border-radius: 12rpx;
      padding: 30rpx;
      position: relative;
      display: flex;
      align-items: flex-start;

      .message-content {
        flex: 1;

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16rpx;

          .message-title {
            font-size: 30rpx;
            color: #333;
            font-weight: 500;
          }

          .message-time {
            font-size: 24rpx;
            color: #999;
          }
        }

        .message-desc {
          font-size: 26rpx;
          color: #666;
          line-height: 1.5;
        }
      }

      .unread-dot {
        width: 16rpx;
        height: 16rpx;
        background: #f5222d;
        border-radius: 50%;
        margin-left: 20rpx;
        margin-top: 8rpx;
      }
    }
  }
}
</style>
