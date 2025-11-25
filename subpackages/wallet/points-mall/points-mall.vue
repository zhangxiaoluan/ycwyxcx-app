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
      <!-- 分类标签 -->
      <view class="category-tabs">
        <scroll-view scroll-x class="tab-scroll">
          <view class="tab-item" :class="currentCategoryId === 0 ? 'active' : ''" @click="switchCategory(0)">
            <text>全部</text>
          </view>
          <view class="tab-item"
                v-for="category in categories"
                :key="category.id"
                :class="currentCategoryId === category.id ? 'active' : ''"
                @click="switchCategory(category.id)">
            <text>{{ category.name }}</text>
          </view>
        </scroll-view>
      </view>

      <!-- 商品列表 -->
      <view class="goods-grid" v-if="products.length > 0">
        <view class="goods-item" v-for="item in products" :key="item.id" @click="showGoodsDetail(item)">
          <view class="goods-image">
            <image :src="item.image || '/static/images/default-product.png'" mode="aspectFill"></image>
            <view class="goods-tag" v-if="!item.canExchange">已兑完</view>
            <view class="goods-tag hot" v-else-if="item.soldCount > 10">热门</view>
          </view>
          <view class="goods-info">
            <text class="goods-name">{{ item.name }}</text>
            <text class="goods-desc">{{ item.description }}</text>
            <view class="goods-points">
              <text class="points-value">{{ item.points }}</text>
              <text class="points-label">积分</text>
            </view>
            <view class="goods-stock" v-if="item.stock > 0">
              <text>库存{{ item.stock }}件</text>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else-if="!loading">
        <view class="empty-icon">🛍️</view>
        <text class="empty-text">暂无商品</text>
        <text class="empty-desc">该分类下暂无可兑换商品</text>
      </view>

      <!-- 加载状态 -->
      <view class="loading-state" v-if="loading">
        <u-loading-icon mode="circle" size="40"></u-loading-icon>
        <text class="loading-text">加载中...</text>
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
import { getCategories, getProducts, exchangeProduct } from '@/api/list/points-mall.js'
import { signInfo } from '@/api/list/login.js'

export default {
  data() {
    return {
      userPoints: 0,
      currentCategoryId: 0,
      showDetailModal: false,
      selectedGoods: null,
      categories: [],
      products: [],
      loading: true,
      exchangeForm: {
        contactInfo: '',
        remark: ''
      }
    }
  },
  onLoad() {
    this.loadData()
    this.loadUserPoints()
  },
  onPullDownRefresh() {
    this.loadData()
    this.loadUserPoints()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        // 获取分类数据
        const categoriesRes = await getCategories()
        this.categories = categoriesRes || []
        // 获取商品数据
        await this.loadProducts()

      } catch (error) {
        console.error('加载数据失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
        uni.stopPullDownRefresh()
      }
    },

    // 获取商品数据
    async loadProducts(categoryId = 0) {
      try {
        const params = categoryId ? { categoryId } : {}
        const productsRes = await getProducts(params)

        if (productsRes.code === 200 && productsRes.result && productsRes.result.records) {
          this.products = productsRes.result.records
        } else {
          this.products = []
        }
      } catch (error) {
        console.error('加载商品失败:', error)
        this.products = []
      }
    },

    async loadUserPoints() {
      try {
        const pointsRes = await signInfo()
        if (pointsRes.code === 200 && pointsRes.result) {
          this.userPoints = pointsRes.result.totalPoints || 0
        }
      } catch (error) {
        console.error('加载积分信息失败:', error)
      }
    },

    async switchCategory(categoryId) {
      this.currentCategoryId = categoryId
      this.products = []
      await this.loadProducts(categoryId)
    },

    showGoodsDetail(goods) {
      this.selectedGoods = goods
      this.showDetailModal = true
    },

    closeDetail() {
      this.showDetailModal = false
      this.selectedGoods = null
      this.exchangeForm = {
        contactInfo: '',
        remark: ''
      }
    },

    exchangeGoods() {
      if (!this.selectedGoods) return

      if (!this.selectedGoods.canExchange) {
        uni.showToast({
          title: '商品不可兑换',
          icon: 'none'
        })
        return
      }

      if (this.userPoints < this.selectedGoods.points) {
        uni.showToast({
          title: '积分不足',
          icon: 'none'
        })
        return
      }

      if (this.selectedGoods.stock <= 0) {
        uni.showToast({
          title: '库存不足',
          icon: 'none'
        })
        return
      }

      // 检查兑换限制
      if (this.selectedGoods.exchangeLimit > 0 &&
          this.selectedGoods.userExchangedCount >= this.selectedGoods.exchangeLimit) {
        uni.showToast({
          title: '超出兑换限制',
          icon: 'none'
        })
        return
      }

      uni.showModal({
        title: '确认兑换',
        content: `确定要花费${this.selectedGoods.points}积分兑换${this.selectedGoods.name}吗？`,
        success: (res) => {
          if (res.confirm) {
            this.showExchangeForm()
          }
        }
      })
    },

    showExchangeForm() {
      uni.showModal({
        title: '填写兑换信息',
        content: '请输入联系方式（手机号或地址）',
        editable: true,
        placeholderText: '请输入手机号或收货地址',
        success: (res) => {
          if (res.confirm && res.content) {
            this.submitExchange(res.content)
          } else if (res.confirm) {
            uni.showToast({
              title: '请填写联系方式',
              icon: 'none'
            })
          }
        }
      })
    },

    async submitExchange(contactInfo) {
      try {
        uni.showLoading({
          title: '兑换中...'
        })

        const params = {
          productId: this.selectedGoods.id,
          quantity: 1,
          contactInfo: contactInfo,
          remark: this.exchangeForm.remark
        }

        const res = await exchangeProduct(params)

        uni.hideLoading()

        if (res.code === 200) {
          uni.showToast({
            title: '兑换成功',
            icon: 'success'
          })

          // 更新用户积分
          this.userPoints -= this.selectedGoods.points

          // 更新商品信息
          const productIndex = this.products.findIndex(p => p.id === this.selectedGoods.id)
          if (productIndex !== -1) {
            this.products[productIndex].stock--
            this.products[productIndex].soldCount++
            this.products[productIndex].userExchangedCount++

            // 如果库存为0，更新可兑换状态
            if (this.products[productIndex].stock <= 0) {
              this.products[productIndex].canExchange = false
            }
          }

          this.closeDetail()
        } else {
          uni.showToast({
            title: res.message || '兑换失败',
            icon: 'none'
          })
        }

      } catch (error) {
        uni.hideLoading()
        console.error('兑换失败:', error)
        uni.showToast({
          title: '兑换失败，请重试',
          icon: 'none'
        })
      }
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

      .tab-scroll {
        white-space: nowrap;

        .tab-item {
          display: inline-block;
          text-align: center;
          padding: 15rpx 30rpx;
          position: relative;
          margin-right: 20rpx;

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

          &:last-child {
            margin-right: 0;
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

            &.hot {
              background: #e74c3c;
            }

            &:not(.hot) {
              background: #95a5a6;
            }
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

          .goods-stock {
            margin-top: 8rpx;

            text {
              font-size: 20rpx;
              color: #999;
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

    .loading-state {
      text-align: center;
      padding: 100rpx 30rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .loading-text {
        font-size: 26rpx;
        color: #999;
        margin-top: 20rpx;
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
