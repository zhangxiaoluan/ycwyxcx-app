<template>
  <view class="withdraw-page">

    <view class="content">
      <view class="balance-card">
        <text class="balance-label">可提现余额</text>
        <text class="balance-amount">¥{{ balance }}</text>
      </view>

      <view class="form-section">
        <view class="form-title">提现信息</view>

        <view class="form-item">
          <text class="form-label">提现金额</text>
          <view class="amount-input-wrapper">
            <text class="currency-symbol">¥</text>
            <input
              v-model="withdrawAmount"
              class="amount-input"
              type="digit"
              placeholder="请输入提现金额"
              @input="validateAmount"
            />
          </view>
          <view class="amount-tips">
            <text>可提现金额：¥{{ balance }}</text>
            <button class="all-btn" @click="withdrawAll">全部提现</button>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">提现到</text>
          <view class="bank-card-selector" @click="selectBankCard">
            <view class="bank-card-info" v-if="selectedBankCard">
              <view class="bank-icon">
                <u-icon name="rmb-circle" size="24" color="#3b5598"></u-icon>
              </view>
              <view class="bank-details">
                <text class="bank-name">{{ selectedBankCard.bankName }}</text>
                <text class="card-number">尾号{{ selectedBankCard.lastFour }}</text>
              </view>
            </view>
            <view class="select-placeholder" v-else>
              <u-icon name="plus-circle" size="20" color="#999"></u-icon>
              <text>选择银行卡</text>
            </view>
            <u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
          </view>
        </view>

        <view class="fee-info">
          <text>手续费：¥{{ withdrawFee }}</text>
          <text>实际到账：¥{{ actualAmount }}</text>
        </view>

        <button class="withdraw-btn" :disabled="!canWithdraw" @click="confirmWithdraw">
          确认提现
        </button>
      </view>

      <view class="tips-section">
        <view class="tips-title">提现说明</view>
        <view class="tips-list">
          <text class="tip-item">• 单笔提现金额最低1元，最高50000元</text>
          <text class="tip-item">• 提现手续费为提现金额的0.1%，最低1元</text>
          <text class="tip-item">• 工作日16:00前提现，当日到账</text>
          <text class="tip-item">• 节假日提现顺延至下一个工作日</text>
          <text class="tip-item">• 提现资金将转入您绑定的银行卡</text>
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
      withdrawAmount: '',
      selectedBankCard: null,
      bankCards: [
        {
          id: 1,
          bankName: '中国工商银行',
          cardNumber: '6222021234567890123',
          lastFour: '0123'
        },
        {
          id: 2,
          bankName: '中国建设银行',
          cardNumber: '6217001234567890123',
          lastFour: '0123'
        }
      ],
      feeRate: 0.001,
      minFee: 1
    }
  },
  computed: {
    withdrawFee() {
      if (!this.withdrawAmount || parseFloat(this.withdrawAmount) <= 0) {
        return '0.00'
      }
      const fee = Math.max(parseFloat(this.withdrawAmount) * this.feeRate, this.minFee)
      return fee.toFixed(2)
    },
    actualAmount() {
      if (!this.withdrawAmount || parseFloat(this.withdrawAmount) <= 0) {
        return '0.00'
      }
      const actual = parseFloat(this.withdrawAmount) - parseFloat(this.withdrawFee)
      return actual.toFixed(2)
    },
    canWithdraw() {
      return this.withdrawAmount &&
             this.selectedBankCard &&
             parseFloat(this.withdrawAmount) >= 1 &&
             parseFloat(this.withdrawAmount) <= parseFloat(this.balance) &&
             parseFloat(this.actualAmount) > 0
    }
  },
  onLoad() {
    // 默认选择第一张银行卡
    if (this.bankCards.length > 0) {
      this.selectedBankCard = this.bankCards[0]
    }
  },
  methods: {
    validateAmount(e) {
      let value = e.detail.value

      // 限制只能输入数字和小数点
      value = value.replace(/[^\d.]/g, '')

      // 限制只能有一个小数点
      const parts = value.split('.')
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('')
      }

      // 限制小数点后两位
      if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2)
      }

      this.withdrawAmount = value
    },

    withdrawAll() {
      this.withdrawAmount = this.balance
    },

    selectBankCard() {
      const items = this.bankCards.map(card => ({
        value: card.id,
        name: `${card.bankName} (尾号${card.lastFour})`
      }))

      uni.showActionSheet({
        itemList: items.map(item => item.name),
        success: (res) => {
          const selectedId = items[res.tapIndex].value
          this.selectedBankCard = this.bankCards.find(card => card.id === selectedId)
        }
      })
    },

    confirmWithdraw() {
      if (!this.canWithdraw) {
        uni.showToast({
          title: '请检查提现信息',
          icon: 'none'
        })
        return
      }

      uni.showModal({
        title: '确认提现',
        content: `将提现¥${this.withdrawAmount}到${this.selectedBankCard.bankName}尾号${this.selectedBankCard.lastFour}，实际到账¥${this.actualAmount}，手续费¥${this.withdrawFee}`,
        success: (res) => {
          if (res.confirm) {
            this.submitWithdraw()
          }
        }
      })
    },

    submitWithdraw() {
      uni.showLoading({
        title: '提交中...'
      })

      // 模拟提交
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '提现申请已提交',
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }, 2000)
    }
  }
}
</script>

<style lang="scss">
.withdraw-page {
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

    .balance-card {
      background: linear-gradient(135deg, #3b5598 0%, #5a7bcd 100%);
      border-radius: 16rpx;
      padding: 40rpx 30rpx;
      margin-bottom: 30rpx;
      color: white;
      text-align: center;

      .balance-label {
        display: block;
        font-size: 26rpx;
        opacity: 0.8;
        margin-bottom: 10rpx;
      }

      .balance-amount {
        font-size: 48rpx;
        font-weight: 700;
      }
    }

    .form-section {
      background: white;
      border-radius: 16rpx;
      padding: 40rpx 30rpx;
      margin-bottom: 30rpx;

      .form-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 30rpx;
      }

      .form-item {
        margin-bottom: 30rpx;

        .form-label {
          display: block;
          font-size: 28rpx;
          color: #333;
          margin-bottom: 15rpx;
          font-weight: 500;
        }

        .amount-input-wrapper {
          display: flex;
          align-items: center;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          padding: 0 20rpx;
          background: #fafafa;

          .currency-symbol {
            font-size: 40rpx;
            color: #333;
            //font-weight: 600;
            margin-right: 10rpx;
          }

          .input-placeholder{
            color: #999;
            font-weight: normal;
            font-size: 25rpx;
          }

          .amount-input {
            flex: 1;
            height: 80rpx;
            font-size: 32rpx;
            color: #333;
            font-weight: 600;
          }
        }

        .amount-tips {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15rpx;

          text {
            font-size: 24rpx;
            color: #999;
          }

          .all-btn {
            background: none;
            border: none;
            color: #3b5598;
            font-size: 24rpx;
            padding: 0 15rpx;
            margin: 0;
          }
        }

        .bank-card-selector {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          padding: 25rpx 20rpx;
          background: #fafafa;

          .bank-card-info {
            display: flex;
            align-items: center;
            flex: 1;

            .bank-icon {
              width: 48rpx;
              height: 48rpx;
              border-radius: 50%;
              background: rgba(59, 85, 152, 0.1);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 20rpx;
            }

            .bank-details {
              .bank-name {
                display: block;
                font-size: 28rpx;
                color: #333;
                font-weight: 500;
                margin-bottom: 6rpx;
              }

              .card-number {
                font-size: 24rpx;
                color: #666;
              }
            }
          }

          .select-placeholder {
            display: flex;
            align-items: center;
            color: #999;

            text {
              font-size: 28rpx;
              margin-left: 10rpx;
            }
          }
        }
      }

      .fee-info {
        background: #f8f9fa;
        border-radius: 8rpx;
        padding: 20rpx;
        margin-bottom: 30rpx;

        text {
          display: block;
          font-size: 26rpx;
          color: #666;
          margin-bottom: 8rpx;

          &:last-child {
            margin-bottom: 0;
            font-weight: 500;
            color: #3b5598;
          }
        }
      }

      .withdraw-btn {
        width: 100%;
        height: 80rpx;
        background: #3b5598;
        color: white;
        border: none;
        border-radius: 8rpx;
        font-size: 30rpx;
        font-weight: 600;

        &:disabled {
          background: #ccc;
        }
      }
    }

    .tips-section {
      background: white;
      border-radius: 16rpx;
      padding: 30rpx;

      .tips-title {
        font-size: 28rpx;
        color: #333;
        font-weight: 600;
        margin-bottom: 20rpx;
      }

      .tips-list {
        .tip-item {
          display: block;
          font-size: 24rpx;
          color: #666;
          line-height: 1.6;
          margin-bottom: 10rpx;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
