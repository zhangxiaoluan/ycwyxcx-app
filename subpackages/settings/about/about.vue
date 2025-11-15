<template>
  <view class="about-page">
    <view class="content">
      <!-- App信息 -->
      <view class="app-info-section">
        <view class="app-logo">
          <image src="/static/logo.png" mode="aspectFill"></image>
        </view>
        <text class="app-name">智慧物业</text>
        <text class="app-version">版本 v1.0.0</text>
        <text class="app-desc">便捷的智慧社区生活服务平台</text>
      </view>

      <!-- 功能介绍 -->
      <view class="feature-section">
        <view class="section-title">核心功能</view>
        <view class="feature-grid">
          <view class="feature-item">
            <view class="feature-icon">
              <u-icon name="home" size="24" color="#3b5598"></u-icon>
            </view>
            <text class="feature-name">物业服务</text>
            <text class="feature-desc">便捷的物业缴费、报修服务</text>
          </view>

          <view class="feature-item">
            <view class="feature-icon">
              <u-icon name="home" size="24" color="#07c160"></u-icon>
            </view>
            <text class="feature-name">社区互动</text>
            <text class="feature-desc">邻里交流，社区活动参与</text>
          </view>

          <view class="feature-item">
            <view class="feature-icon">
              <u-icon name="list" size="24" color="#ff6b35"></u-icon>
            </view>
            <text class="feature-name">任务中心</text>
            <text class="feature-desc">发布需求，提供社区服务</text>
          </view>

          <view class="feature-item">
            <view class="feature-icon">
              <u-icon name="red-packet" size="24" color="#f5222d"></u-icon>
            </view>
            <text class="feature-name">积分商城</text>
            <text class="feature-desc">积分兑换，优惠福利</text>
          </view>
        </view>
      </view>

      <!-- 公司信息 -->
      <view class="company-section">
        <view class="section-title">公司信息</view>
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">公司名称</text>
            <text class="info-value">智慧物业科技有限公司</text>
          </view>

          <view class="info-item">
            <text class="info-label">联系电话</text>
            <text class="info-value" @click="callPhone('400-123-4567')">400-123-4567</text>
          </view>

          <view class="info-item">
            <text class="info-label">客服邮箱</text>
            <text class="info-value" @click="sendEmail('service@zhihuiwuye.com')">service@zhihuiwuye.com</text>
          </view>

          <view class="info-item">
            <text class="info-label">公司地址</text>
            <text class="info-value">北京市朝阳区科技园区123号</text>
          </view>
        </view>
      </view>

      <!-- 协议条款 -->
      <view class="agreement-section">
        <view class="section-title">协议条款</view>
        <view class="agreement-list">
          <view class="agreement-item" @click="viewAgreement('user')">
            <text class="agreement-name">用户协议</text>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>

          <view class="agreement-item" @click="viewAgreement('privacy')">
            <text class="agreement-name">隐私政策</text>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>

          <view class="agreement-item" @click="viewAgreement('service')">
            <text class="agreement-name">服务条款</text>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>
        </view>
      </view>

      <!-- 社交媒体 -->
      <view class="social-section">
        <view class="section-title">关注我们</view>
        <view class="social-list">
          <view class="social-item" @click="openSocial('wechat')">
            <view class="social-icon">
              <u-icon name="weixin-fill" size="24" color="#07c160"></u-icon>
            </view>
            <text class="social-name">微信公众号</text>
            <text class="social-account">zhihuiwuye</text>
          </view>

          <view class="social-item" @click="openSocial('weibo')">
            <view class="social-icon">
              <u-icon name="weibo" size="24" color="#ff6b35"></u-icon>
            </view>
            <text class="social-name">官方微博</text>
            <text class="social-account">@智慧物业</text>
          </view>
        </view>
      </view>

      <!-- 更新日志 -->
      <view class="changelog-section">
        <view class="section-title">更新日志</view>
        <view class="changelog-list">
          <view class="changelog-item">
            <view class="changelog-header">
              <text class="changelog-version">v1.0.0</text>
              <text class="changelog-date">2024-11-15</text>
            </view>
            <view class="changelog-content">
              <text class="changelog-item-text">• 首次发布智慧物业APP</text>
              <text class="changelog-item-text">• 支持物业缴费、报修功能</text>
              <text class="changelog-item-text">• 社区互动和任务中心功能</text>
              <text class="changelog-item-text">• 积分商城和电子钱包功能</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部信息 -->
      <view class="footer-section">
        <text class="copyright">© 2024 智慧物业科技有限公司</text>
        <text class="icp">京ICP备2024000001号</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      appInfo: {
        name: '智慧物业',
        version: '1.0.0',
        description: '便捷的智慧社区生活服务平台'
      }
    }
  },
  methods: {
    callPhone(phone) {
      uni.makePhoneCall({
        phoneNumber: phone
      })
    },

    sendEmail(email) {
      uni.setClipboardData({
        data: email,
        success: () => {
          uni.showToast({
            title: '邮箱已复制',
            icon: 'success'
          })
        }
      })
    },

    viewAgreement(type) {
      const titles = {
        user: '用户协议',
        privacy: '隐私政策',
        service: '服务条款'
      }

      const contents = {
        user: '欢迎使用智慧物业APP。本协议是您与智慧物业科技有限公司之间的法律协议...',
        privacy: '智慧物业科技有限公司重视您的隐私保护。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息...',
        service: '使用智慧物业APP服务需要遵守以下条款和条件...'
      }

      uni.showModal({
        title: titles[type],
        content: contents[type],
        showCancel: false,
        confirmText: '知道了'
      })
    },

    openSocial(platform) {
      if (platform === 'wechat') {
        uni.showModal({
          title: '微信公众号',
          content: '请打开微信搜索"zhihuiwuye"关注我们',
          showCancel: false,
          confirmText: '知道了'
        })
      } else if (platform === 'weibo') {
        uni.showModal({
          title: '官方微博',
          content: '请打开微博搜索"@智慧物业"关注我们',
          showCancel: false,
          confirmText: '知道了'
        })
      }
    },

    checkUpdate() {
      uni.showLoading({
        title: '检查中...'
      })

      setTimeout(() => {
        uni.hideLoading()
        uni.showModal({
          title: '检查更新',
          content: '当前已是最新版本',
          showCancel: false,
          confirmText: '知道了'
        })
      }, 2000)
    }
  }
}
</script>

<style lang="scss">
.about-page {
  background: #f5f5f5;
  min-height: 100vh;

  .content {
    padding: 30rpx;

    .app-info-section {
      background: white;
      border-radius: 16rpx;
      padding: 50rpx 30rpx;
      text-align: center;
      margin-bottom: 30rpx;

      .app-logo {
        width: 120rpx;
        height: 120rpx;
        margin: 0 auto 20rpx;
        border-radius: 24rpx;
        overflow: hidden;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .app-name {
        display: block;
        font-size: 36rpx;
        font-weight: 700;
        color: #333;
        margin-bottom: 10rpx;
      }

      .app-version {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 15rpx;
      }

      .app-desc {
        font-size: 26rpx;
        color: #666;
        line-height: 1.5;
      }
    }

    .feature-section, .company-section, .agreement-section, .social-section, .changelog-section {
      background: white;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 30rpx;

      .section-title {
        font-size: 28rpx;
        color: #333;
        font-weight: 600;
        margin-bottom: 25rpx;
        position: relative;
        padding-left: 20rpx;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 6rpx;
          height: 24rpx;
          background: #3b5598;
          border-radius: 3rpx;
        }
      }
    }

    .feature-section {
      .feature-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 25rpx;

        .feature-item {
          text-align: center;

          .feature-icon {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            background: rgba(59, 85, 152, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15rpx;
          }

          .feature-name {
            display: block;
            font-size: 26rpx;
            color: #333;
            font-weight: 500;
            margin-bottom: 8rpx;
          }

          .feature-desc {
            font-size: 22rpx;
            color: #999;
            line-height: 1.4;
          }
        }
      }
    }

    .company-section {
      .info-list {
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20rpx 0;
          border-bottom: 1rpx solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .info-label {
            font-size: 26rpx;
            color: #666;
          }

          .info-value {
            font-size: 26rpx;
            color: #333;
            text-align: right;
            flex: 1;
            margin-left: 20rpx;

            &.link {
              color: #3b5598;
              text-decoration: underline;
            }
          }
        }
      }
    }

    .agreement-section {
      .agreement-list {
        .agreement-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20rpx 0;
          border-bottom: 1rpx solid #f0f0f0;
          transition: background-color 0.2s;

          &:last-child {
            border-bottom: none;
          }

          &:active {
            background-color: #f8f9fa;
            margin: 0 -10rpx;
            padding-left: 10rpx;
            padding-right: 10rpx;
            border-radius: 8rpx;
          }

          .agreement-name {
            font-size: 26rpx;
            color: #333;
          }
        }
      }
    }

    .social-section {
      .social-list {
        .social-item {
          display: flex;
          align-items: center;
          padding: 20rpx 0;
          border-bottom: 1rpx solid #f0f0f0;
          transition: background-color 0.2s;

          &:last-child {
            border-bottom: none;
          }

          &:active {
            background-color: #f8f9fa;
            margin: 0 -10rpx;
            padding-left: 10rpx;
            padding-right: 10rpx;
            border-radius: 8rpx;
          }

          .social-icon {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
            background: rgba(59, 85, 152, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20rpx;
          }

          .social-name {
            font-size: 26rpx;
            color: #333;
            margin-right: 15rpx;
          }

          .social-account {
            font-size: 22rpx;
            color: #999;
          }
        }
      }
    }

    .changelog-section {
      .changelog-list {
        .changelog-item {
          .changelog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15rpx;

            .changelog-version {
              font-size: 26rpx;
              color: #3b5598;
              font-weight: 600;
            }

            .changelog-date {
              font-size: 22rpx;
              color: #999;
            }
          }

          .changelog-content {
            .changelog-item-text {
              display: block;
              font-size: 24rpx;
              color: #666;
              line-height: 1.6;
              margin-bottom: 8rpx;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }

    .footer-section {
      text-align: center;
      padding: 30rpx 0;

      .copyright {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
      }

      .icp {
        font-size: 22rpx;
        color: #ccc;
      }
    }
  }
}
</style>
