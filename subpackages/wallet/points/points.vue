<template>
  <view class="points-page">

    <view class="content">
      <view class="points-card">
        <view class="points-info">
          <text class="points-label">当前积分</text>
          <text class="points-amount">{{ currentPoints }}</text>
        </view>
        <view class="points-actions">
          <button class="action-btn earn" @click="goToEarnPoints">赚积分</button>
          <button class="action-btn exchange" @click="goToPointsMall">兑换</button>
        </view>
      </view>

      <view class="section">
        <text class="section-title">积分记录</text>
        <view class="tabs">
          <view
            class="tab-item"
            :class="{ active: currentTab === 'all' }"
            @click="switchTab('all')"
          >
            <text>全部</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: currentTab === 'earn' }"
            @click="switchTab('earn')"
          >
            <text>获得</text>
          </view>
          <view
            class="tab-item"
            :class="{ active: currentTab === 'spend' }"
            @click="switchTab('spend')"
          >
            <text>消费</text>
          </view>
        </view>

        <view class="points-list">
          <view class="points-item" v-for="(item, index) in filteredPoints" :key="index">
            <view class="points-info">
              <text class="points-title">{{ item.title }}</text>
              <text class="points-time">{{ item.time }}</text>
            </view>
            <text class="points-amount" :class="item.type">
              {{ item.type === 'earn' ? '+' : '-' }}{{ item.amount }}
            </text>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">积分任务</text>
        <view class="tasks-grid">
          <view class="task-card" v-for="task in tasks" :key="task.id" @click="doTask(task)">
            <view class="task-icon">
              <u-icon :name="task.icon" size="30" :color="task.color"></u-icon>
            </view>
            <text class="task-title">{{ task.title }}</text>
            <text class="task-points">+{{ task.points }}积分</text>
            <text class="task-status" :class="{ completed: task.completed }">
              {{ task.completed ? '已完成' : '去完成' }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentPoints: 1250,
      currentTab: 'all',
      pointsRecords: [
        {
          id: 1,
          title: '每日签到',
          time: '2024-11-15 08:00',
          amount: '10',
          type: 'earn'
        },
        {
          id: 2,
          title: '完成任务：物业缴费',
          time: '2024-11-14 15:30',
          amount: '50',
          type: 'earn'
        },
        {
          id: 3,
          title: '积分兑换：优惠券',
          time: '2024-11-13 20:15',
          amount: '200',
          type: 'spend'
        },
        {
          id: 4,
          title: '发布社区动态',
          time: '2024-11-12 18:45',
          amount: '20',
          type: 'earn'
        },
        {
          id: 5,
          title: '积分兑换：物业费减免',
          time: '2024-11-10 10:20',
          amount: '500',
          type: 'spend'
        }
      ],
      tasks: [
        {
          id: 1,
          title: '每日签到',
          icon: 'calendar',
          color: '#3b5598',
          points: 10,
          completed: false
        },
        {
          id: 2,
          title: '实名认证',
          icon: 'home',
          color: '#07c160',
          points: 100,
          completed: false
        },
        {
          id: 3,
          title: '绑定房屋',
          icon: 'home',
          color: '#ff6b35',
          points: 50,
          completed: false
        },
        {
          id: 4,
          title: '发布动态',
          icon: 'edit',
          color: '#9c27b0',
          points: 20,
          completed: false
        }
      ]
    }
  },
  computed: {
    filteredPoints() {
      if (this.currentTab === 'all') {
        return this.pointsRecords
      }
      return this.pointsRecords.filter(record => record.type === this.currentTab)
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab
    },

    goToEarnPoints() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    goToPointsMall() {
      uni.navigateTo({
        url: '/subpackages/wallet/points-mall/points-mall'
      })
    },

    doTask(task) {
      if (task.completed) {
        uni.showToast({
          title: '任务已完成',
          icon: 'none'
        })
        return
      }

      switch (task.id) {
        case 1: // 每日签到
          this.dailySign()
          break
        case 2: // 实名认证
          uni.navigateTo({
            url: '/subpackages/user/identity-verification/identity-verification'
          })
          break
        case 3: // 绑定房屋
          uni.navigateTo({
            url: '/subpackages/user/house-binding/house-binding'
          })
          break
        case 4: // 发布动态
          uni.showToast({
            title: '功能开发中',
            icon: 'none'
          })
          break
      }
    },

    dailySign() {
      uni.showLoading({
        title: '签到中...'
      })

      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '签到成功，获得10积分',
          icon: 'success'
        })

        // 更新积分和任务状态
        this.currentPoints += 10
        const task = this.tasks.find(t => t.id === 1)
        if (task) {
          task.completed = true
        }

        // 添加积分记录
        this.pointsRecords.unshift({
          id: Date.now(),
          title: '每日签到',
          time: this.formatTime(new Date()),
          amount: '10',
          type: 'earn'
        })
      }, 1000)
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
.points-page {
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

  .content {
    padding: 30rpx;

    .points-card {
      background: linear-gradient(135deg, #3b5598 0%, #5a7bcd 100%);
      border-radius: 16rpx;
      padding: 40rpx 30rpx;
      margin-bottom: 30rpx;
      color: white;

      .points-info {
        text-align: center;
        margin-bottom: 30rpx;

        .points-label {
          display: block;
          font-size: 26rpx;
          opacity: 0.8;
          margin-bottom: 10rpx;
        }

        .points-amount {
          font-size: 48rpx;
          font-weight: 700;
        }
      }

      .points-actions {
        display: flex;
        gap: 20rpx;

        .action-btn {
          flex: 1;
          height: 70rpx;
          border-radius: 35rpx;
          font-size: 26rpx;
          font-weight: 600;
          border: none;

          &.earn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
          }

          &.exchange {
            background: white;
            color: #3b5598;
          }
        }
      }
    }

    .section {
      background: white;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 30rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 24rpx;
      }

      .tabs {
        display: flex;
        margin-bottom: 30rpx;
        border-bottom: 1rpx solid #f0f0f0;

        .tab-item {
          flex: 1;
          text-align: center;
          padding: 20rpx 0;
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
              bottom: -1rpx;
              left: 50%;
              transform: translateX(-50%);
              width: 60rpx;
              height: 4rpx;
              background: #3b5598;
              border-radius: 2rpx;
            }
          }
        }
      }

      .points-list {
        .points-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20rpx 0;
          border-bottom: 1rpx solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .points-info {
            flex: 1;

            .points-title {
              display: block;
              font-size: 28rpx;
              color: #333;
              margin-bottom: 8rpx;
            }

            .points-time {
              font-size: 24rpx;
              color: #999;
            }
          }

          .points-amount {
            font-size: 30rpx;
            font-weight: 600;

            &.earn {
              color: #07c160;
            }

            &.spend {
              color: #f5222d;
            }
          }
        }
      }

      .tasks-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20rpx;

        .task-card {
          background: #f8f9fa;
          border-radius: 12rpx;
          padding: 30rpx 20rpx;
          text-align: center;
          transition: transform 0.2s;

          &:active {
            transform: scale(0.95);
          }

          .task-icon {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15rpx;
          }

          .task-title {
            display: block;
            font-size: 26rpx;
            color: #333;
            font-weight: 500;
            margin-bottom: 8rpx;
          }

          .task-points {
            display: block;
            font-size: 24rpx;
            color: #ff6b35;
            font-weight: 600;
            margin-bottom: 12rpx;
          }

          .task-status {
            font-size: 22rpx;
            padding: 6rpx 16rpx;
            border-radius: 12rpx;
            background: #e6f7ff;
            color: #1890ff;

            &.completed {
              background: #f6ffed;
              color: #52c41a;
            }
          }
        }
      }
    }
  }
}
</style>
