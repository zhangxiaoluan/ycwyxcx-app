<template>
  <view class="wallet-page">

    <view class="balance-card">
      <view class="balance-info">
        <text class="balance-label">钱包余额</text>
        <text class="balance-amount">¥{{ balance }}</text>
      </view>
      <view class="actions">
        <button class="action-btn withdraw" @click="goToWithdraw">提现</button>
        <button class="action-btn recharge" @click="recharge">充值</button>
      </view>
    </view>

    <view class="section">
      <text class="section-title">交易记录</text>
      <view class="transaction-list">
        <view class="transaction-item" v-for="(item, index) in transactions" :key="index">
          <view class="transaction-info">
            <text class="transaction-title">{{ item.title }}</text>
            <text class="transaction-time">{{ item.time }}</text>
          </view>
          <text class="transaction-amount" :class="item.type">
            {{ item.type === 'income' ? '+' : '-' }}¥{{ item.amount }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      balance: '188.50',
      transactions: [
        {
          title: '任务完成奖励',
          time: '2024-11-15 14:30',
          amount: '50.00',
          type: 'income'
        },
        {
          title: '提现到银行卡',
          time: '2024-11-14 10:20',
          amount: '100.00',
          type: 'expense'
        },
        {
          title: '积分兑换',
          time: '2024-11-13 16:45',
          amount: '20.00',
          type: 'expense'
        }
      ]
    }
  },
  methods: {
    goToWithdraw() {
      uni.navigateTo({
        url: '/subpackages/wallet/withdraw/withdraw'
      })
    },

    recharge() {
      uni.showToast({
        title: '充值功能开发中',
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss">
.wallet-page {
  background: linear-gradient(to right, #e0ecfa 0%, #f4f6f9 50%, #f6f4fc 100%);
  min-height: 100vh;
  padding: 35rpx;

  .balance-card {
    background: white;
    border-radius: 16rpx;
    padding: 40rpx 35rpx;

    .balance-info {
      text-align: center;
      margin-bottom: 40rpx;

      .balance-label {
        display: block;
        font-size: 26rpx;
        color: #666;
        margin-bottom: 10rpx;
      }

      .balance-amount {
        font-size: 48rpx;
        font-weight: 700;
        color: #3b5598;
      }
    }

    .actions {
      display: flex;
      gap: 20rpx;

      .action-btn {
        flex: 1;
        height: 80rpx;
        border-radius: 8rpx;
        font-size: 28rpx;
        font-weight: 600;
        border: none;

        &.withdraw {
          background: #3b5598;
          color: white;
        }

        &.recharge {
          background: #f0f0f0;
          color: #333;
        }
      }
    }
  }

  .section {
    background: white;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-top: 40rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 30rpx;
    }

    .transaction-list {
      .transaction-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .transaction-info {
          .transaction-title {
            display: block;
            font-size: 28rpx;
            color: #333;
            margin-bottom: 8rpx;
          }

          .transaction-time {
            font-size: 24rpx;
            color: #999;
          }
        }

        .transaction-amount {
          font-size: 30rpx;
          font-weight: 600;

          &.income {
            color: #52c41a;
          }

          &.expense {
            color: #f5222d;
          }
        }
      }
    }
  }
}
</style>
