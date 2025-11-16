<template>
  <view class="settings-page">


    <view class="content">
      <!-- 账号设置 -->
      <view class="settings-section">
        <view class="section-title">账号设置</view>
        <view class="settings-list">
          <view class="setting-item" @click="goToProfile">
            <view class="setting-info">
              <u-icon name="account" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">个人资料</text>
            </view>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>

          <view class="setting-item" @click="goToSecurity">
            <view class="setting-info">
              <u-icon name="lock" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">账号安全</text>
            </view>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>

          <view class="setting-item" @click="goToPrivacy">
            <view class="setting-info">
              <u-icon name="eye-off" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">隐私设置</text>
            </view>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>

          <view class="setting-item" @click="goToNotification">
            <view class="setting-info">
              <u-icon name="bell" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">消息通知</text>
            </view>
            <view class="setting-value">
              <text class="value-text">已开启</text>
            </view>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>
        </view>
      </view>

      <!-- 应用设置 -->
      <view class="settings-section">
        <view class="section-title">应用设置</view>
        <view class="settings-list">
          <view class="setting-item">
            <view class="setting-info">
              <u-icon name="home" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">深色模式</text>
            </view>
            <switch :checked="darkMode" @change="onDarkModeChange" color="#3b5598" />
          </view>

          <view class="setting-item">
            <view class="setting-info">
              <u-icon name="wifi" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">仅WiFi下下载图片</text>
            </view>
            <switch :checked="wifiOnly" @change="onWifiOnlyChange" color="#3b5598" />
          </view>

          <view class="setting-item">
            <view class="setting-info">
              <u-icon name="home" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">消息提醒</text>
            </view>
            <switch :checked="messageNotification" @change="onMessageNotificationChange" color="#3b5598" />
          </view>

          <view class="setting-item" @click="clearCache">
            <view class="setting-info">
              <u-icon name="home" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">清理缓存</text>
            </view>
            <view class="setting-value">
              <text class="value-text">{{ cacheSize }}</text>
            </view>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>
        </view>
      </view>

      <!-- 其他设置 -->
      <view class="settings-section">
        <view class="section-title">其他</view>
        <view class="settings-list">
          <view class="setting-item" @click="goToAbout">
            <view class="setting-info">
              <u-icon name="home" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">关于我们</text>
            </view>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>

          <view class="setting-item" @click="goToHelp">
            <view class="setting-info">
              <u-icon name="home" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">帮助中心</text>
            </view>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>

          <view class="setting-item" @click="shareApp">
            <view class="setting-info">
              <u-icon name="home" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">分享应用</text>
            </view>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>

          <view class="setting-item" @click="goToFeedback">
            <view class="setting-info">
              <u-icon name="home" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">意见反馈</text>
            </view>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>

          <view class="setting-item" @click="checkUpdate">
            <view class="setting-info">
              <u-icon name="download" size="20" color="#3b5598"></u-icon>
              <text class="setting-text">检查更新</text>
            </view>
            <view class="setting-value">
              <text class="value-text">v1.0.0</text>
            </view>
            <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-section">
        <button class="logout-btn" @click="logout">退出登录</button>
      </view>

      <!-- 版本信息 -->
      <view class="version-info">
        <text class="version-text">智慧物业 v1.0.0</text>
        <text class="copyright-text">© 2024 智慧物业 版权所有</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      darkMode: false,
      wifiOnly: false,
      messageNotification: true,
      cacheSize: '12.3MB'
    }
  },
  onLoad() {
    this.loadSettings()
  },
  methods: {
    loadSettings() {
      // 从本地存储加载设置
      try {
        const settings = uni.getStorageSync('app_settings')
        if (settings) {
          this.darkMode = settings.darkMode || false
          this.wifiOnly = settings.wifiOnly || false
          this.messageNotification = settings.messageNotification !== false
        }
      } catch (e) {
        console.error('加载设置失败', e)
      }
    },

    saveSettings() {
      // 保存设置到本地存储
      try {
        const settings = {
          darkMode: this.darkMode,
          wifiOnly: this.wifiOnly,
          messageNotification: this.messageNotification
        }
        uni.setStorageSync('app_settings', settings)
      } catch (e) {
        console.error('保存设置失败', e)
      }
    },

    onDarkModeChange(e) {
      this.darkMode = e.detail.value
      this.saveSettings()
      uni.showToast({
        title: this.darkMode ? '已开启深色模式' : '已关闭深色模式',
        icon: 'none'
      })
    },

    onWifiOnlyChange(e) {
      this.wifiOnly = e.detail.value
      this.saveSettings()
      uni.showToast({
        title: this.wifiOnly ? '已开启WiFi限制' : '已关闭WiFi限制',
        icon: 'none'
      })
    },

    onMessageNotificationChange(e) {
      this.messageNotification = e.detail.value
      this.saveSettings()
      uni.showToast({
        title: this.messageNotification ? '已开启消息提醒' : '已关闭消息提醒',
        icon: 'none'
      })
    },

    clearCache() {
      uni.showModal({
        title: '清理缓存',
        content: `确定要清理 ${this.cacheSize} 的缓存吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '清理中...'
            })

            setTimeout(() => {
              uni.hideLoading()
              this.cacheSize = '0MB'
              uni.showToast({
                title: '清理完成',
                icon: 'success'
              })
            }, 1500)
          }
        }
      })
    },

    goToProfile() {
      uni.navigateTo({
        url: '/subpackages/user/profile/profile'
      })
    },

    goToSecurity() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    goToPrivacy() {
      uni.navigateTo({
        url: '/subpackages/settings/privacy/privacy'
      })
    },

    goToNotification() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    goToAbout() {
      uni.navigateTo({
        url: '/subpackages/settings/about/about'
      })
    },

    goToHelp() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    },

    goToFeedback() {
      uni.navigateTo({
        url: '/subpackages/community/feedback/feedback'
      })
    },
    shareApp() {
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        href: 'https://example.com/app',
        title: '智慧物业',
        summary: '便捷的智慧社区生活服务平台',
        imageUrl: '/static/logo.png',
        success: () => {
          uni.showToast({
            title: '分享成功',
            icon: 'success'
          })
        },
        fail: () => {
          // 分享失败，显示复制链接选项
          uni.showActionSheet({
            itemList: ['复制链接'],
            success: (res) => {
              if (res.tapIndex === 0) {
                uni.setClipboardData({
                  data: 'https://example.com/app',
                  success: () => {
                    uni.showToast({
                      title: '链接已复制',
                      icon: 'success'
                    })
                  }
                })
              }
            }
          })
        }
      })
    },

    checkUpdate() {
      uni.showLoading({ title: '检查中...' })

      setTimeout(() => {
        uni.hideLoading()
        uni.showModal({
          title: '检查更新',
          content: '当前已是最新版本',
          showCancel: false,
          confirmText: '知道了'
        })
      }, 2000)
    },

    logout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除用户信息
            try {
              uni.removeStorageSync('wyToken')
              // uni.removeStorageSync('auth_token')
            } catch (e) {
              console.error('清除用户信息失败', e)
            }
            uni.showToast({ title: '已退出登录', icon: 'success' })
            // 跳转到登录页
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/login/login' })
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.settings-page {
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

    .settings-section {
      margin-bottom: 30rpx;

      .section-title {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 15rpx;
        padding-left: 10rpx;
      }

      .settings-list {
        background: white;
        border-radius: 12rpx;
        overflow: hidden;

        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28rpx 25rpx;
          border-bottom: 1rpx solid #f0f0f0;
          transition: background-color 0.2s;

          &:last-child {
            border-bottom: none;
          }

          &:active {
            background-color: #f8f9fa;
          }

          .setting-info {
            display: flex;
            align-items: center;
            flex: 1;

            .setting-text {
              font-size: 28rpx;
              color: #333;
              margin-left: 20rpx;
            }
          }

          .setting-value {
            margin-right: 15rpx;

            .value-text {
              font-size: 24rpx;
              color: #999;
            }
          }

          switch {
            transform: scale(0.8);
          }
        }
      }
    }

    .logout-section {
      margin-bottom: 30rpx;

      .logout-btn {
        width: 100%;
        height: 80rpx;
        background: white;
        color: #f5222d;
        border: 1rpx solid #f5222d;
        border-radius: 12rpx;
        font-size: 30rpx;
        font-weight: 600;
      }
    }

    .version-info {
      text-align: center;
      padding: 20rpx;

      .version-text {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-bottom: 8rpx;
      }

      .copyright-text {
        font-size: 22rpx;
        color: #ccc;
      }
    }
  }
}
</style>
