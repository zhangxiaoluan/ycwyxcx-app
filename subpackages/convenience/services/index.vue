<template>
  <view class="convenience-page">
    <!-- 分类导航 -->
    <view class="category-nav">
      <scroll-view class="category-scroll" scroll-x="true" :show-scrollbar="false">
        <view
          class="category-item"
          :class="{ active: currentCategoryId === item.id }"
          v-for="item in categoriesData"
          :key="item.id"
          @click="selectCategory(item.id)"
        >
          <text class="category-text">{{ item.name }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 服务列表 -->
    <view class="service-list">
      <view class="service-item" v-for="service in serviceList" :key="service.id" @click="callService(service.phone)">
        <view class="service-name">{{ service.name }}</view>
        <view class="service-address" v-if="service.address">{{ service.address }}</view>
        <view class="service-phone">
          <text class="call-icon">📞</text>
          <text class="phone-number">{{ service.phone }}</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="serviceList.length === 0 && !loading">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无服务信息</text>
        <text class="empty-desc">请选择其他分类查看</text>
      </view>

      <!-- 加载状态 -->
      <view class="loading-state" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
import { categoriesType, categoriesList } from "../../../api/list/convenience";

export default {
  name: "index",
  data() {
    return {
      categoriesData: [],        // 分类及服务数据
      currentCategoryId: null,   // 当前选中的分类ID
      serviceList: [],           // 当前分类的服务列表
      loading: false            // 加载状态
    }
  },

  onLoad() {
    this.loadCategoriesData();
  },

  methods: {
    // 加载分类及服务数据
    async loadCategoriesData() {
      try {
        this.loading = true;
        const response = await categoriesType();
        console.log('便民服务数据:', response);
        this.categoriesData = response || [];
        // 默认选择第一个分类
        if (this.categoriesData.length > 0) {
          this.currentCategoryId = this.categoriesData[0].id;
          this.updateServiceList(this.currentCategoryId);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        uni.showToast({
          title: '加载数据失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },

    // 更新服务列表
    updateServiceList(categoryId) {
      categoriesList(categoryId).then(response => {
        console.log(response);
        this.serviceList = response.phones || [];
      })
    },

    // 选择分类
    selectCategory(categoryId) {
      if (this.currentCategoryId === categoryId) return;

      this.currentCategoryId = categoryId;
      this.updateServiceList(categoryId);
    },

    // 拨打电话
    callService(phone) {
      if (!phone) {
        uni.showToast({
          title: '电话号码不存在',
          icon: 'none'
        });
        return;
      }

      uni.showModal({
        title: '拨打电话',
        content: `确定要拨打 ${phone} 吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.makePhoneCall({
              phoneNumber: phone,
              fail: (err) => {
                console.error('拨打电话失败:', err);
                uni.showToast({
                  title: '拨打电话失败',
                  icon: 'none'
                });
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.convenience-page {
  background: #f5f5f5;
  min-height: 100vh;

  .category-nav {
    background: white;
    padding: 20rpx 0;
    margin-bottom: 20rpx;

    .category-scroll {
      white-space: nowrap;

      &::-webkit-scrollbar {
        display: none;
      }

      .category-item {
        display: inline-block;
        padding: 16rpx 32rpx;
        margin: 0 10rpx;
        border-radius: 30rpx;
        background: #f0f0f0;
        transition: all 0.3s;

        &.active {
          background: #3b5598;

          .category-text {
            color: white;
          }
        }

        .category-text {
          font-size: 28rpx;
          color: #333;
          line-height: 1;
        }
      }
    }
  }

  .service-list {
    padding: 0 30rpx;

    .service-item {
      background: white;
      border-radius: 16rpx;
      padding: 25rpx 30rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
      transition: transform 0.2s;

      &:active {
        transform: scale(0.98);
      }

      .service-name {
        font-size: 32rpx;
        color: #333;
        font-weight: 600;
        margin-bottom: 12rpx;
        line-height: 1.3;
      }

      .service-address {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 16rpx;
        line-height: 1.4;
      }

      .service-phone {
        display: flex;
        align-items: center;
        padding: 15rpx 20rpx;
        background: #f8f9ff;
        border-radius: 12rpx;

        .phone-number {
          font-size: 30rpx;
          color: #3b5598;
          font-weight: 600;
          margin-left: 15rpx;
        }

        .call-icon {
          font-size: 32rpx;
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 100rpx 0;

    .empty-icon {
      font-size: 120rpx;
      margin-bottom: 20rpx;
      display: block;
    }

    .empty-text {
      font-size: 32rpx;
      color: #999;
      margin-bottom: 12rpx;
      display: block;
    }

    .empty-desc {
      font-size: 28rpx;
      color: #ccc;
      display: block;
    }
  }

  .loading-state {
    text-align: center;
    padding: 80rpx 0;
    color: #999;
    font-size: 28rpx;
  }
}
</style>
