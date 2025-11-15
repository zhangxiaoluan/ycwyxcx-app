<template>
  <view class="points-mall-page">
    <view class="header">
      <text class="title">积分商城</text>
      <view class="points-info">
        <text class="points-label">我的积分</text>
        <text class="points-amount">{{ userPoints }}</text>
      </view>
    </view>

    <view class="content">
      <view class="category-tabs">
        <view class="tab-item" :class="currentCategory === 'all' ? 'active' : ''" @click="switchCategory('all')">
          <text>全部</text>
        </view>
        <view class="tab-item" :class="currentCategory === 'coupon' ? 'active' : ''" @click="switchCategory('coupon')">
          <text>优惠券</text>
        </view>
        <view class="tab-item" :class="currentCategory === 'service' ? 'active' : ''" @click="switchCategory('service')">
          <text>服务</text>
        </view>
        <view class="tab-item" :class="currentCategory === 'goods' ? 'active' : ''" @click="switchCategory('goods')">
          <text>实物</text>
        </view>
      </view>

      <view class="goods-grid">
        <view class="goods-item" v-for="item in filteredGoods" :key="item.id" @click="showGoodsDetail(item)">
          <view class="goods-image">
            <image :src="item.image" mode="aspectFill"></image>
            <view class="goods-tag" v-if="item.tag">{{ item.tag }}</view>
          </view>
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-desc">{{ item.description }}</text>
            <view class="goods-points">
              <text class="points-value">{{ item.points }}</text>
              <text class="points-label">积分</text>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-if="filteredNotices.length === 0">
        <view class="empty-icon">🛍️</view>
        <text class="empty-text">暂无商品</text>
        <text class="empty-desc">该分类下暂无可兑换商品</text>
      </view>
    </view>

    <u-modal v-model="showDetailModal" :title="selectedGoods ? selectedGoods.name : ''" @confirm="exchangeGoods" @cancel="closeDetail" confirm-text="立即兑换">
      <view class="goods-detail" v-if="selectedGoods">
        <image :src="selectedGoods.image" class="detail-image" mode="aspectFill"></image>
        <view class="detail-info">
          <text class="detail-desc">{{ selectedGoods.description }}</text>
          <view class="detail-points">
            <text class="points-value">{{ selectedGoods.points }}</text>
            <text class="points-label">积分</text>
          </view>
          <view class="detail-stock" v-if="selectedGoods.stock !== undefined">
            <text>库存：{{ selectedGoods.stock }}件</text>
          </view>
          <view class="detail-rules">
            <text class="rules-title">兑换规则：</text>
            <text class="rules-content">{{ selectedGoods.rules }}</text>
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
      userPoints: 1250,
      currentCategory: 'all',
      showDetailModal: false,
      selectedGoods: null,
      filteredNotices: [],
      goodsList: [
        {
          id: 1,
          name: '物业费优惠券',
          description: '50元物业费减免券',
          points: 500,
          category: 'coupon',
          image: '/static/images/coupon1.png',
          tag: '热门',
          stock: 100,
          rules: '1. 优惠券有效期30天\n2. 仅限抵扣物业费\n3. 不可兑现，不设找零'
        },
        {
          id: 2,
          name: '停车费优惠券',
          description: '20元停车费减免券',
          points: 200,
          category: 'coupon',
          image: '/static/images/coupon2.png',
          stock: 50,
          rules: '1. 优惠券有效期30天\n2. 仅限抵扣停车费\n3. 每人每月限兑2张'
        },
        {
          id: 3,
          name: '家政服务',
          description: '2小时家政清洁服务',
          points: 800,
          category: 'service',
          image: '/static/images/service1.png',
          tag: '限时',
          stock: 20,
          rules: '1. 服务需提前3天预约\n2. 仅限小区内使用\n3. 有效期60天'
        },
        {
          id: 4,
          name: '维修服务',
          description: '家电维修上门服务',
          points: 300,
          category: 'service',
          image: '/static/images/service2.png',
          stock: 30,
          rules: '1. 包含基础维修费用\n2. 零件费用另计\n3. 服务范围：小区内'
        },
        {
          id: 5,
          name: '精美水杯',
          description: '定制社区logo水杯',
          points: 150,
          category: 'goods',
          image: '/static/images/goods1.png',
          stock: 200,
          rules: '1. 需到物业中心领取\n2. 领取时间：工作日9:00-18:00\n3. 有效期90天'
        },
        {
          id: 6,
          name: '雨伞',
          description: '折叠晴雨两用伞',
          points: 100,
          category: 'goods',
          image: '/static/images/goods2.png',
          stock: 150,
          rules: '1. 需到物业中心领取\n2. 领取时间：工作日9:00-18:00\n3. 有效期90天'
        }
      ]
    }
  },
  computed: {
    filteredGoods() {
      if (this.currentCategory === 'all') {
        return this.goodsList
      }
      return this.goodsList.filter(goods => goods.category === this.currentCategory)
    }
  },
  methods: {
    switchCategory(category) {
      this.currentCategory = category
    },

    showGoodsDetail(goods) {
      this.selectedGoods = goods
      this.showDetailModal = true
    },

    closeDetail() {
      this.showDetailModal = false
      this.selectedGoods = null
    },

    exchangeGoods() {
      if (!this.selectedGoods) return

      if (this.userPoints < this.selectedGoods.points) {
        uni.showToast({
          title: '积分不足',
          icon: 'none'
        })
        return
      }

      if (this.selectedGoods.stock !== undefined && this.selectedGoods.stock <= 0) {
        uni.showToast({
          title: '库存不足',
          icon: 'none'
        })
        return
      }

      uni.showModal({
        title: '确认兑换',
        content: `确定要花费${this.selectedGoods.points}积分兑换${this.selectedGoods.name}吗？`,
        success: (res) => {
          if (res.confirm) {
            this.submitExchange()
          }
        }
      })
    },

    submitExchange() {
      uni.showLoading({
        title: '兑换中...'
      })

      setTimeout(() => {
        uni.hideLoading()
        this.userPoints -= this.selectedGoods.points
        if (this.selectedGoods.stock !== undefined) {
          this.selectedGoods.stock--
        }

        uni.showToast({
          title: '兑换成功',
          icon: 'success'
        })

        this.closeDetail()
      }, 2000)
    }
  }
}
</script>

<style lang="scss">
.points-mall-page {
  background: #f5f5f5;
  min-height: 100vh;

  .header {
    background: linear-gradient(135deg, #3b5598 0%, #5a7bcd 100%);
    padding: 40rpx 30rpx;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 36rpx;
      font-weight: 600;
    }

    .points-info {
      text-align: right;

      .points-label {
        display: block;
        font-size: 22rpx;
        opacity: 0.8;
        margin-bottom: 6rpx;
      }

      .points-amount {
        font-size: 32rpx;
        font-weight: 700;
      }
    }
  }

  .content {
    padding: 30rpx;

    .category-tabs {
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
      }
    }

    .goods-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20rpx;

      .goods-item {
        background: white;
        border-radius: 12rpx;
        overflow: hidden;
        transition: transform 0.2s;

        &:active {
          transform: scale(0.95);
        }

        .goods-image {
          position: relative;
          height: 200rpx;

          image {
            width: 100%;
            height: 100%;
          }

          .goods-tag {
            position: absolute;
            top: 10rpx;
            right: 10rpx;
            background: #ff6b35;
            color: white;
            font-size: 20rpx;
            padding: 4rpx 12rpx;
            border-radius: 12rpx;
          }
        }

        .goods-info {
          padding: 20rpx;

          .goods-name {
            display: block;
            font-size: 26rpx;
            color: #333;
            font-weight: 500;
            margin-bottom: 8rpx;
            line-height: 1.3;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .goods-desc {
            display: block;
            font-size: 22rpx;
            color: #999;
            margin-bottom: 12rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .goods-points {
            display: flex;
            align-items: baseline;

            .points-value {
              font-size: 30rpx;
              color: #ff6b35;
              font-weight: 600;
            }

            .points-label {
              font-size: 20rpx;
              color: #ff6b35;
              margin-left: 4rpx;
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
      }
    }
  }

  .goods-detail {
    .detail-image {
      width: 100%;
      height: 300rpx;
      border-radius: 8rpx;
      margin-bottom: 20rpx;
    }

    .detail-info {
      .detail-desc {
        display: block;
        font-size: 26rpx;
        color: #666;
        line-height: 1.5;
        margin-bottom: 20rpx;
      }

      .detail-points {
        display: flex;
        align-items: baseline;
        margin-bottom: 15rpx;

        .points-value {
          font-size: 36rpx;
          color: #ff6b35;
          font-weight: 600;
        }

        .points-label {
          font-size: 24rpx;
          color: #ff6b35;
          margin-left: 6rpx;
        }
      }

      .detail-stock {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 20rpx;
      }

      .detail-rules {
        .rules-title {
          display: block;
          font-size: 26rpx;
          color: #333;
          font-weight: 500;
          margin-bottom: 10rpx;
        }

        .rules-content {
          font-size: 24rpx;
          color: #666;
          line-height: 1.6;
          white-space: pre-line;
        }
      }
    }
  }
}
</style>
