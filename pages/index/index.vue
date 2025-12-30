<template>
  <view class="home-page" :style="{ paddingTop: statusBarHeight + navBarHeight + 'px' }">

    <!-- 顶部导航 -->
    <view class="header">
      <view class="welcome-section">
        <text class="welcome-text">欢迎回家，</text>
        <text class="location-text">{{ currentLocation }}</text>
      </view>
      <view class="header-actions">
        <view class="notification-btn" @click="goToNotifications">
          <u-icon name="bell" size="20" color="#333"></u-icon>
          <view class="notification-badge" v-if="unreadCount > 0"></view>
        </view>
      </view>
    </view>

<!--    &lt;!&ndash; 搜索栏 &ndash;&gt;-->
<!--    <view class="search-section">-->
<!--      <view class="search-box">-->
<!--        <u-icon name="search" size="20" color="#999"></u-icon>-->
<!--        <input-->
<!--          class="search-input"-->
<!--          placeholder="搜索功能和服务"-->
<!--          @input="onSearchInput"-->
<!--        />-->
<!--      </view>-->
<!--    </view>-->

    <!-- 轮播图 -->
    <view class="banner-section">
      <swiper
        class="banner-swiper"
        :autoplay="true"
        :interval="4000"
        :circular="true"
        :duration="500"
        indicator-dots
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#3b5598"
        @change="onBannerChange"
      >
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <view class="banner-item" @click="onBannerClick(banner)">
            <image :src="banner.imageUrl" mode="aspectFill" class="banner-image" :class="{ 'loading': !imageLoaded[index] }" @load="onImageLoad(index)"></image>
            <view class="banner-content">
              <!-- <view class="banner-type" :class="banner.type">{{ getTypeText(banner.type) }}</view>-->
              <text class="banner-title">{{ banner.title }}</text>
              <text class="banner-desc">{{ banner.publishTime }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 四大核心功能入口 -->
    <view class="core-functions-section">
      <view class="section-header">
        <text class="section-title">服务中心</text>
      </view>
      <view class="function-grid">

        <!-- 缴费管理 -->
<!--        <view class="function-card payment" @click="goToPayments">-->
<!--          <view class="function-icon">-->
<!--            <view class="icon-bg payment-bg">-->
<!--              <u-icon name="coupon" size="24" color="#fff"></u-icon>-->
<!--            </view>-->
<!--          </view>-->
<!--          <text class="function-title">缴费管理</text>-->
<!--          <text class="function-subtitle">4项费用</text>-->
<!--          <view class="function-badge" v-if="propertyFeeStatus === 'overdue'">-->
<!--            <text>待缴费</text>-->
<!--          </view>-->
<!--        </view>-->

        <!-- 保修服务 -->
        <view class="function-card repair" @click="goToRepairs">
          <view class="function-icon">
            <view class="icon-bg repair-bg">
              <u-icon name="pushpin" size="24" color="#fff"></u-icon>
            </view>
          </view>
          <text class="function-title">报修服务</text>
          <text class="function-subtitle">{{ repairStats.pending }}个待处理</text>
          <view class="function-badge" v-if="repairStats.pending > 0">
            <text>待处理</text>
          </view>
        </view>

        <!-- 公告通知 -->
        <view class="function-card notice" @click="goToNotices">
          <view class="function-icon">
            <view class="icon-bg notice-bg">
              <u-icon name="bell" size="24" color="#fff"></u-icon>
            </view>
          </view>
          <text class="function-title">公告通知</text>
          <text class="function-subtitle">{{ unreadCount }}条未读</text>
          <view class="function-badge" v-if="unreadCount > 0">
            <text>新消息</text>
          </view>
        </view>

        <!-- 便民服务 -->
        <view class="function-card convenience" @click="goToConvenience">
          <view class="function-icon">
            <view class="icon-bg convenience-bg">
              <u-icon name="grid" size="24" color="#fff"></u-icon>
            </view>
          </view>
          <text class="function-title">便民服务</text>
          <text class="function-subtitle">6项服务</text>
        </view>
      </view>
    </view>

    <!-- 便民服务 -->
    <view class="convenience-section">
      <view class="section-header">
        <text class="section-title">其他服务</text>
        <!--  <text class="more-text" @click="goToConvenience">查看全部 ></text>  -->
      </view>
      <view class="service-grid">
        <view class="service-item" v-for="service in convenienceServices.slice(0, 8)" :key="service.id" @click="goToService(service)">
          <view class="service-icon">
            <u-icon :name="service.icon" size="24" :color="service.color"></u-icon>
          </view>
          <text class="service-name">{{ service.name }}</text>
        </view>
      </view>
    </view>

    <!-- 社区公告预览 -->
<!--    <view class="notice-preview-section">-->
<!--      <view class="section-header">-->
<!--        <text class="section-title">社区公告</text>-->
<!--        <text class="more-text" @click="goToNotices">查看全部 ></text>-->
<!--      </view>-->
<!--      <view class="notice-preview-list">-->
<!--        <view class="notice-preview-item" v-for="notice in notices.slice(0, 3)" :key="notice.id" @click="goToNoticeDetail(notice)">-->
<!--          <view class="notice-dot" :class="{ unread: !notice.read }"></view>-->
<!--          <view class="notice-preview-content">-->
<!--            <text class="notice-preview-title">{{ notice.title }}</text>-->
<!--            <text class="notice-preview-time">{{ notice.time }}</text>-->
<!--          </view>-->
<!--        </view>-->
<!--      </view>-->
<!--    </view>-->

    <!-- 联系客服 -->
<!--    <view class="contact-section">-->
<!--      <view class="contact-card">-->
<!--        <view class="contact-info">-->
<!--          <u-icon name="home" size="24" color="#3b5598"></u-icon>-->
<!--          <view class="contact-details">-->
<!--            <text class="contact-title">7x24小时客服</text>-->
<!--            <text class="contact-phone">400-123-4567</text>-->
<!--          </view>-->
<!--        </view>-->
<!--        <view class="contact-buttons">-->
<!--          <button class="contact-btn call" @click="makePhoneCall">-->
<!--            <u-icon name="phone" size="16" color="#fff"></u-icon>-->
<!--            <text>电话</text>-->
<!--          </button>-->
<!--          <button class="contact-btn chat" @click="openChat">-->
<!--            <u-icon name="home" size="16" color="#fff"></u-icon>-->
<!--            <text>在线</text>-->
<!--          </button>-->
<!--        </view>-->
<!--      </view>-->
<!--    </view>-->
  </view>
</template>

<script>
import {articleCarousel} from "@/api/list/home";
export default {
  data() {
    return {
      statusBarHeight: 0,
      navBarHeight: 0,
      currentLocation: '智慧小区A区',
      unreadCount: 3,
      searchKeyword: '',
      currentBannerIndex: 0,
      imageLoaded: {},
      propertyFeeStatus: 'normal',
      repairStats: {
        pending: 2,
        processing: 3,
        completed: 15
      },
      banners: [
        // {
        //   id: 1,
        //   image: 'https://picsum.photos/360/166?id=1',
        //   title: '物业费缴费优惠活动',
        //   desc: '本月缴费享9折优惠',
        //   url: '/pages/payment/property-fee',
        //   type: 'promotion'
        // },
      ],
      quickRepairItems: [
        { id: 1, name: '水电维修', icon: 'zap', color: '#ff6b35' },
        { id: 2, name: '空调维修', icon: 'wind', color: '#07c160' },
        { id: 3, name: '管道漏水', icon: 'droplet', color: '#3b5598' },
        { id: 4, name: '门锁维修', icon: 'lock', color: '#9c27b0' }
      ],
      convenienceServices: [
        // { id: 1, name: '访客登记', icon: 'home', color: '#3b5598', bgColor: 'rgba(59, 85, 152, 0.1)' },
        // { id: 2, name: '快递代收', icon: 'home', color: '#ff6b35', bgColor: 'rgba(255, 107, 53, 0.1)' },
        { id: 3, name: '社区活动', icon: 'home', color: '#07c160', bgColor: 'rgba(7, 193, 96, 0.1)' },
        // { id: 4, name: '周边商家', icon: 'home', color: '#f5222d', bgColor: 'rgba(245, 34, 45, 0.1)' },
        // { id: 5, name: '家政服务', icon: 'home', color: '#9c27b0', bgColor: 'rgba(156, 39, 176, 0.1)' },
        // { id: 6, name: '车辆管理', icon: 'car', color: '#ff6b35', bgColor: 'rgba(255, 107, 53, 0.1)' },
        { id: 7, name: '安保打卡', icon: 'map', color: '#e74c3c', bgColor: 'rgba(231, 76, 60, 0.1)' }
      ],
      notices: [
        {
          id: 1,
          title: '物业费缴费提醒',
          time: '2小时前',
          type: 'payment',
          read: false
        },
        {
          id: 2,
          title: '停水通知：明日维修',
          time: '1天前',
          type: 'maintenance',
          read: false
        },
        {
          id: 3,
          title: '社区联欢活动报名',
          time: '3天前',
          type: 'activity',
          read: true
        }
      ]
    }
  },
  onLoad() {},
  onShow() {
    this.getStatusBarHeight()
    this.loadData()
    this.initBannerImages()
    this.loadUnreadCount()
  },
  methods: {
    getStatusBarHeight() {
      // 获取系统信息（包含状态栏高度）
      const systemInfo = uni.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight; // 状态栏高度（像素）
      // 获取导航栏高度（仅微信小程序需要，其他平台可能不需要）

      // #ifdef MP-WEIXIN
      if (uni.getMenuButtonBoundingClientRect) {
        if (uni.getMenuButtonBoundingClientRect) {
          const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
          // 导航栏高度 = 菜单按钮底部距离 - 状态栏高度
          this.navBarHeight = menuButtonInfo.bottom - systemInfo.statusBarHeight;
        }
      }
      // #endif
    },

    initBannerImages() {
      articleCarousel().then(response => {
        console.log(response);
        // 初始化banner图片加载状态
        this.banners = response || []
        // this.banners.forEach((banner, index) => {
        //   this.$set(this.imageLoaded, index, false)
        // })
      })
    },

    loadData() {
      // 模拟加载用户缴费状态
      this.loadPaymentStatus()
    },

    loadPaymentStatus() {
      // 模拟检查物业费状态
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 5)

      if (dueDate.getTime() < Date.now()) {
        this.propertyFeeStatus = 'overdue'
      } else {
        this.propertyFeeStatus = 'normal'
      }
    },

    loadUnreadCount() {
      // 模拟获取未读消息数量
      this.unreadCount = this.notices.filter(n => !n.read).length
    },

    onSearchInput(e) {
      this.searchKeyword = e.detail.value
    },

    onBannerClick(banner) {
      uni.navigateTo({
        url: `/subpackages/home/article-detail?id=${banner.articleId}`,
        fail: () => {
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          })
        }
      })
    },

    onBannerChange(e) {
      this.currentBannerIndex = e.detail.current
    },

    onImageLoad(index) {
      this.$set(this.imageLoaded, index, true)
    },

    getTypeText(type) {
      const typeMap = {
        promotion: '优惠',
        activity: '活动',
        announcement: '公告',
        service: '服务'
      }
      return typeMap[type] || '推荐'
    },

    // 导航方法
    goToNotifications() {
      uni.navigateTo({
        url: '/subpackages/community/message/message'
      })
    },


    goToPayments() {
      uni.navigateTo({
        url: '/pages/payment/payment-list'
      })
    },

    goToRepairs() {
      uni.navigateTo({
        url: '/subpackages/repair/list'
      })
    },

    goToService(service) {
      // 根据服务类型跳转到对应页面
      switch(service.name) {
        case '访客登记':
          uni.navigateTo({ url: '/subpackages/visitor/visitor-register' })
          break
        case '快递代收':
          uni.navigateTo({ url: '/subpackages/express/express-list' })
          break
        case '社区活动':
          uni.navigateTo({ url: '/subpackages/community/activity-list/index' })
          break
        case '周边商家':
          uni.navigateTo({ url: '/subpackages/business/business-list' })
          break
        case '家政服务':
          uni.navigateTo({ url: '/subpackages/services/housekeeping' })
          break
        case '车辆管理':
          uni.navigateTo({ url: '/subpackages/vehicle/vehicle-manage' })
          break
        case '安保打卡':
          uni.navigateTo({
            url: '/subpackages/home/security-checkin/security-checkin'
          })
          break
      }
    },

    goToNoticeDetail(notice) {
      uni.navigateTo({
        url: `/subpackages/community/notice/notice-detail?id=${notice.id}`
      })
    },

    getNoticeTypeText(type) {
      const typeMap = {
        payment: '缴费',
        maintenance: '维修',
        activity: '活动',
        notice: '公告'
      }
      return typeMap[type] || '通知'
    },

    makePhoneCall() {
      uni.makePhoneCall({
        phoneNumber: '400-123-4567'
      })
    },

    goToNotices() {
      uni.navigateTo({
        url: '/subpackages/community/notice/notice'
      })
    },

    goToConvenience() {
      uni.navigateTo({ url: '/subpackages/convenience/services/index' })
    },

    openChat() {
      uni.navigateTo({
        url: '/pages/service/customer-service'
      })
    }
  }
}
</script>

<style lang="scss">
.home-page {
  //background: linear-gradient(180deg, #f4f6f9 0%, #f8f3ff 100%);
  //min-height: 100vh;
  background: linear-gradient(to right, #e0ecfa 0%, #f4f6f9 50%, #f6f4fc 100%);
  //background: linear-gradient(180deg, #c1e0ff 0%, #f4f6f9 50%);
  min-height: 100vh;
  position: relative;


  .header {
    background: transparent;
    padding: 35rpx;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;

    .welcome-section {
      .welcome-text {
        display: block;
        font-size: 28rpx;
        color: #666;
        margin-bottom: 4rpx;
      }

      .location-text {
        font-size: 36rpx;
        font-weight: 700;
        color: #333;
      }
    }

    .header-actions {
      .notification-btn {
        width: 60rpx;
        height: 60rpx;
        background: rgb(159, 159, 159, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .notification-badge {
          position: absolute;
          top: 0;
          right: 2rpx;
          background: #f5222d;
          color: white;
          width: 15rpx;
          height: 15rpx;
          //font-size: 18rpx;
          //padding: 2rpx 6rpx;
          border-radius: 10rpx;
          //min-width: 16rpx;
          text-align: center;
          //border: 2rpx solid white;
        }
      }
    }
  }

  .search-section {
    padding: 0 35rpx 35rpx;

    .search-box {
      display: flex;
      align-items: center;
      background: #ffffff;
      //background: linear-gradient(to right, #f6f4fc 0%, #f4f6f9 50%, #e0ecfa 100%);
      //border: 1rpx solid #f6f4fc;
      border-radius: 25rpx;
      padding: 25rpx 30rpx;
      box-shadow: 0 0 10rpx 2rpx #e3ecf8;
      //border: 1px solid red;

      .search-input {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        margin-left: 10rpx;

        &::placeholder {
          color: #999;
        }
      }
    }
  }

  .banner-section {
    margin: 0 35rpx 40rpx;

    .banner-swiper {
      height: 320rpx;
      border-radius: 25rpx;
      overflow: hidden;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

      .banner-item {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 16rpx;

        .banner-image {
          width: 100%;
          height: 100%;
          transition: transform 0.3s ease;
          border-radius: 16rpx;

          &.loading {
            opacity: 0;
          }

          &:not(.loading) {
            opacity: 1;
          }
        }

        .banner-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          padding: 60rpx 30rpx 30rpx;
          color: white;

          .banner-type {
            display: inline-block;
            padding: 6rpx 16rpx;
            border-radius: 20rpx;
            font-size: 20rpx;
            font-weight: 500;
            margin-bottom: 15rpx;

            &.promotion {
              background: #ff6b35;
            }

            &.activity {
              background: #07c160;
            }

            &.announcement {
              background: #3b5598;
            }

            &.service {
              background: #9c27b0;
            }
          }

          .banner-title {
            display: block;
            font-size: 32rpx;
            font-weight: 600;
            margin-bottom: 8rpx;
            line-height: 1.3;
            text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
          }

          .banner-desc {
            display: block;
            font-size: 24rpx;
            opacity: 0.9;
            line-height: 1.4;
          }
        }

        &:active {
          transform: scale(0.98);
          transition: transform 0.1s ease;
        }
      }
    }
  }

  .core-functions-section {
    margin: 0 35rpx 40rpx;
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }

      .more-text {
        font-size: 26rpx;
        color: #3b5598;
      }
    }

    .function-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20rpx;

      .function-card {
        border-radius: 25rpx;
        padding: 25rpx;
        position: relative;
        box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        background: linear-gradient(50deg, #edebf5 0%, #ffffff 50%, #f4f0ff 100%);

        .function-icon {
          width: 80rpx;
          height: 80rpx;
          margin-bottom: 20rpx;

          .icon-bg {
            width: 80rpx;
            height: 80rpx;
            border-radius: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            &.payment-bg {
              background: linear-gradient(135deg, rgba(59, 85, 152, 0.3), rgba(90, 123, 205, 0.6));
            }

            &.repair-bg {
              background: linear-gradient(135deg, rgba(255, 107, 53, 0.3), rgba(255, 138, 101, 0.6));
            }

            &.notice-bg {
              background: linear-gradient(135deg, rgba(7, 193, 96, 0.3), rgba(76, 175, 80, 0.6));
            }

            &.convenience-bg {
              background: linear-gradient(135deg, rgba(156, 39, 176, 0.3), rgba(186, 104, 200, 0.6));
            }
          }
        }

        .function-title {
          display: block;
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 5rpx;
        }

        .function-subtitle {
          display: block;
          font-size: 24rpx;
          color: #999;
        }

        .function-badge {
          background: #fff3e0;
          border-radius: 12rpx;
          position: absolute;
          top: 30rpx;
          right: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8rpx 16rpx;

          text {
            font-size: 20rpx;
            color: #ff6b35;
            font-weight: 500;
          }
        }

        &:active {
          transform: translateY(2rpx) scale(0.98);
          box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
        }
      }
    }
  }

  .notice-preview-section {
    padding: 0 35rpx 35rpx;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }

      .more-text {
        font-size: 26rpx;
        color: #3b5598;
      }
    }

    .notice-preview-list {
      //background: rgba(255, 255, 255, 0.9);
      background: linear-gradient(150deg, #ffffff 0%, #ffffff 50%, #e4edf9 100%);
      //backdrop-filter: blur(20rpx);
      border-radius: 30rpx;
      padding: 25rpx;
      //box-shadow: 0 4rpx 20rpx rgba(59, 85, 152, 0.04);
      //border: 1rpx solid rgba(193, 224, 255, 0.15);

      .notice-preview-item {
        display: flex;
        align-items: center;
        padding: 18rpx 0;
        border-bottom: 1rpx solid rgba(193, 224, 255, 0.2);

        &:last-child {
          border-bottom: none;
        }

        .notice-dot {
          width: 8rpx;
          height: 8rpx;
          border-radius: 50%;
          background: rgba(193, 224, 255, 0.5);
          margin-right: 20rpx;
          flex-shrink: 0;

          &.unread {
            background: #3b5598;
            box-shadow: 0 0 0 4rpx rgba(59, 85, 152, 0.2);
          }
        }

        .notice-preview-content {
          flex: 1;

          .notice-preview-title {
            display: block;
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
            margin-bottom: 6rpx;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .notice-preview-time {
            display: block;
            font-size: 24rpx;
            color: #999;
          }
        }

        &:active {
          background: rgba(59, 85, 152, 0.05);
          margin: 0 -25rpx;
          padding-left: 25rpx;
          padding-right: 25rpx;
          border-radius: 12rpx;
        }
      }
    }
  }

  .convenience-section {
    padding: 0 35rpx 40rpx;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }

      .more-text {
        font-size: 26rpx;
        color: #3b5598;
      }
    }

    .service-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20rpx;

      .service-item {
        background: linear-gradient(150deg, #efebff 0%, #ffffff 50%, #ffffff 100%);
        border-radius: 30rpx;
        padding: 25rpx 15rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.3s ease;

        &:active {
          transform: translateY(2rpx) scale(0.95);
          box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.08);
        }

        .service-icon {
          width: 60rpx;
          height: 60rpx;
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12rpx;
          background: rgba(193, 224, 255, 0.15);
        }

        .service-name {
          font-size: 24rpx;
          color: #333;
          text-align: center;
          line-height: 1.3;
          font-weight: 500;
        }
      }
    }
  }

  .notice-section {
    padding: 0 30rpx 20rpx;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
      }

      .more-text {
        font-size: 24rpx;
        color: #999;
      }
    }

    .notice-list {
      .notice-item {
        background: white;
        border-radius: 12rpx;
        padding: 20rpx;
        margin-bottom: 15rpx;
        display: flex;
        align-items: center;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
        position: relative;
        transition: transform 0.2s;

        &:active {
          transform: scale(0.98);
        }

        .notice-tag {
          padding: 4rpx 12rpx;
          border-radius: 12rpx;
          font-size: 20rpx;
          color: white;
          margin-right: 15rpx;

          &.payment {
            background: #3b5598;
          }

          &.maintenance {
            background: #ff6b35;
          }

          &.activity {
            background: #07c160;
          }

          &.notice {
            background: #9c27b0;
          }
        }

        .notice-content {
          flex: 1;

          .notice-title {
            display: block;
            font-size: 26rpx;
            color: #333;
            margin-bottom: 5rpx;
            line-height: 1.3;
          }

          .notice-time {
            font-size: 22rpx;
            color: #999;
          }
        }

        .unread-dot {
          width: 12rpx;
          height: 12rpx;
          background: #f5222d;
          border-radius: 50%;
          margin-left: 15rpx;
        }
      }
    }
  }

  .contact-section {
    padding: 0 35rpx 40rpx;

    .contact-card {
      //background: linear-gradient(135deg, #3b5598 0%, #5a7bcd 100%);
      background: linear-gradient(150deg, #ffffff 0%, #ffffff 50%, #e4edf9 100%);
      border-radius: 30rpx;
      padding: 35rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #3b5598;
      //box-shadow: 0 8rpx 32rpx rgba(59, 85, 152, 0.15);

      .contact-info {
        display: flex;
        align-items: center;

        .contact-details {
          margin-left: 20rpx;

          .contact-title {
            display: block;
            font-size: 30rpx;
            font-weight: 600;
            margin-bottom: 8rpx;
          }

          .contact-phone {
            font-size: 26rpx;
            opacity: 0.9;
          }
        }
      }

      .contact-buttons {
        display: flex;
        gap: 20rpx;

        .contact-btn {
          padding: 16rpx 24rpx;
          border-radius: 30rpx;
          background: linear-gradient(135deg, #3b5598 0%, #5a7bcd 100%);
          //border: 1rpx solid rgba(255, 255, 255, 0.3);
          //background: rgba(255, 255, 255, 0.15);
          //backdrop-filter: blur(20rpx);
          color: #ffffff;
          font-size: 26rpx;
          font-weight: 500;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;

          &:active {
            transform: translateY(2rpx) scale(0.95);
            background: rgba(255, 255, 255, 0.25);
          }

          text {
            margin-left: 8rpx;
          }
        }
      }
    }
  }
}
</style>
