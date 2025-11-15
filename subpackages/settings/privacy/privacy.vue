<template>
  <view class="privacy-page">

    <view class="content">
      <!-- 账号隐私 -->
      <view class="privacy-section">
        <view class="section-title">账号隐私</view>
        <view class="privacy-list">
          <view class="privacy-item">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="eye" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">手机号可见性</text>
              </view>
              <text class="privacy-desc">控制其他用户是否能看到您的手机号</text>
            </view>
            <picker :range="phoneVisibilityOptions" range-key="label" @change="onPhoneVisibilityChange">
              <view class="privacy-selector">
                <text class="selector-text">{{ getPhoneVisibilityText() }}</text>
                <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
              </view>
            </picker>
          </view>

          <view class="privacy-item">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="home" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">位置信息</text>
              </view>
              <text class="privacy-desc">允许应用获取您的位置信息</text>
            </view>
            <switch :checked="locationEnabled" @change="onLocationChange" color="#3b5598" />
          </view>

          <view class="privacy-item">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="home" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">在线状态</text>
              </view>
              <text class="privacy-desc">显示您的在线状态</text>
            </view>
            <switch :checked="onlineStatus" @change="onOnlineStatusChange" color="#3b5598" />
          </view>
        </view>
      </view>

      <!-- 消息隐私 -->
      <view class="privacy-section">
        <view class="section-title">消息隐私</view>
        <view class="privacy-list">
          <view class="privacy-item">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="home" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">接收陌生人消息</text>
              </view>
              <text class="privacy-desc">允许非好友向您发送消息</text>
            </view>
            <switch :checked="allowStrangerMessages" @change="onStrangerMessagesChange" color="#3b5598" />
          </view>

          <view class="privacy-item">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="bell" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">消息通知</text>
              </view>
              <text class="privacy-desc">接收应用内消息推送</text>
            </view>
            <switch :checked="messageNotification" @change="onMessageNotificationChange" color="#3b5598" />
          </view>

          <view class="privacy-item">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="home" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">@提醒通知</text>
              </view>
              <text class="privacy-desc">当有人@您时接收通知</text>
            </view>
            <switch :checked="mentionNotification" @change="onMentionNotificationChange" color="#3b5598" />
          </view>
        </view>
      </view>

      <!-- 数据隐私 -->
      <view class="privacy-section">
        <view class="section-title">数据隐私</view>
        <view class="privacy-list">
          <view class="privacy-item">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="home" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">数据分析</text>
              </view>
              <text class="privacy-desc">允许我们收集使用数据用于改进服务</text>
            </view>
            <switch :checked="dataAnalysis" @change="onDataAnalysisChange" color="#3b5598" />
          </view>

          <view class="privacy-item">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="home" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">个性化推荐</text>
              </view>
              <text class="privacy-desc">基于您的使用习惯提供个性化内容</text>
            </view>
            <switch :checked="personalization" @change="onPersonalizationChange" color="#3b5598" />
          </view>

          <view class="privacy-item">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="home" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">数据共享</text>
              </view>
              <text class="privacy-desc">与合作伙伴共享必要的服务数据</text>
            </view>
            <switch :checked="dataSharing" @change="onDataSharingChange" color="#3b5598" />
          </view>
        </view>
      </view>

      <!-- 权限管理 -->
      <view class="privacy-section">
        <view class="section-title">权限管理</view>
        <view class="privacy-list">
          <view class="privacy-item" @click="managePermission('camera')">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="camera" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">相机权限</text>
              </view>
              <text class="privacy-desc">用于拍照上传图片、扫一扫等功能</text>
            </view>
            <view class="permission-status" :class="{ granted: permissions.camera }">
              <text>{{ permissions.camera ? '已授权' : '未授权' }}</text>
              <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
            </view>
          </view>

          <view class="privacy-item" @click="managePermission('album')">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="camera" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">相册权限</text>
              </view>
              <text class="privacy-desc">用于选择和保存图片</text>
            </view>
            <view class="permission-status" :class="{ granted: permissions.album }">
              <text>{{ permissions.album ? '已授权' : '未授权' }}</text>
              <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
            </view>
          </view>

          <view class="privacy-item" @click="managePermission('location')">
            <view class="privacy-info">
              <view class="privacy-main">
                <u-icon name="map" size="20" color="#3b5598"></u-icon>
                <text class="privacy-text">位置权限</text>
              </view>
              <text class="privacy-desc">用于提供基于位置的服务</text>
            </view>
            <view class="permission-status" :class="{ granted: permissions.location }">
              <text>{{ permissions.location ? '已授权' : '未授权' }}</text>
              <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
            </view>
          </view>
        </view>
      </view>

      <!-- 隐私政策 -->
      <view class="policy-section">
        <view class="section-title">隐私政策</view>
        <view class="policy-content">
          <text class="policy-title">《智慧物业隐私政策》</text>
          <text class="policy-summary">
            智慧物业高度重视用户隐私保护。本政策说明了我们如何收集、使用、存储和保护您的个人信息。使用我们的服务即表示您同意本政策的条款。
          </text>

          <view class="policy-links">
            <view class="policy-link" @click="viewPolicy('full')">
              <text>查看完整隐私政策</text>
              <u-icon name="arrow-right" size="14" color="#3b5598"></u-icon>
            </view>

            <view class="policy-link" @click="viewPolicy('data')">
              <text>数据使用说明</text>
              <u-icon name="arrow-right" size="14" color="#3b5598"></u-icon>
            </view>

            <view class="policy-link" @click="viewPolicy('cookies')">
              <text>Cookie政策</text>
              <u-icon name="arrow-right" size="14" color="#3b5598"></u-icon>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-section">
        <button class="action-btn secondary" @click="exportData">导出我的数据</button>
        <button class="action-btn danger" @click="deleteAccount">注销账号</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      phoneVisibilityOptions: [
        { label: '所有人可见', value: 'all' },
        { label: '仅好友可见', value: 'friends' },
        { label: '仅自己可见', value: 'private' }
      ],
      phoneVisibility: 'friends',
      locationEnabled: true,
      onlineStatus: true,
      allowStrangerMessages: false,
      messageNotification: true,
      mentionNotification: true,
      dataAnalysis: true,
      personalization: true,
      dataSharing: false,
      permissions: {
        camera: true,
        album: true,
        location: false
      }
    }
  },
  onLoad() {
    this.loadPrivacySettings()
  },
  methods: {
    loadPrivacySettings() {
      try {
        const settings = uni.getStorageSync('privacy_settings')
        if (settings) {
          Object.assign(this, settings)
        }
      } catch (e) {
        console.error('加载隐私设置失败', e)
      }
    },

    savePrivacySettings() {
      try {
        const settings = {
          phoneVisibility: this.phoneVisibility,
          locationEnabled: this.locationEnabled,
          onlineStatus: this.onlineStatus,
          allowStrangerMessages: this.allowStrangerMessages,
          messageNotification: this.messageNotification,
          mentionNotification: this.mentionNotification,
          dataAnalysis: this.dataAnalysis,
          personalization: this.personalization,
          dataSharing: this.dataSharing
        }
        uni.setStorageSync('privacy_settings', settings)
      } catch (e) {
        console.error('保存隐私设置失败', e)
      }
    },

    getPhoneVisibilityText() {
      const option = this.phoneVisibilityOptions.find(opt => opt.value === this.phoneVisibility)
      return option ? option.label : '选择设置'
    },

    onPhoneVisibilityChange(e) {
      this.phoneVisibility = this.phoneVisibilityOptions[e.detail.value].value
      this.savePrivacySettings()
    },

    onLocationChange(e) {
      this.locationEnabled = e.detail.value
      this.savePrivacySettings()
      uni.showToast({
        title: this.locationEnabled ? '已开启位置信息' : '已关闭位置信息',
        icon: 'none'
      })
    },

    onOnlineStatusChange(e) {
      this.onlineStatus = e.detail.value
      this.savePrivacySettings()
      uni.showToast({
        title: this.onlineStatus ? '已显示在线状态' : '已隐藏在线状态',
        icon: 'none'
      })
    },

    onStrangerMessagesChange(e) {
      this.allowStrangerMessages = e.detail.value
      this.savePrivacySettings()
      uni.showToast({
        title: this.allowStrangerMessages ? '已允许陌生人消息' : '已禁止陌生人消息',
        icon: 'none'
      })
    },

    onMessageNotificationChange(e) {
      this.messageNotification = e.detail.value
      this.savePrivacySettings()
      uni.showToast({
        title: this.messageNotification ? '已开启消息通知' : '已关闭消息通知',
        icon: 'none'
      })
    },

    onMentionNotificationChange(e) {
      this.mentionNotification = e.detail.value
      this.savePrivacySettings()
      uni.showToast({
        title: this.mentionNotification ? '已开启@提醒' : '已关闭@提醒',
        icon: 'none'
      })
    },

    onDataAnalysisChange(e) {
      this.dataAnalysis = e.detail.value
      this.savePrivacySettings()
      uni.showToast({
        title: this.dataAnalysis ? '已开启数据分析' : '已关闭数据分析',
        icon: 'none'
      })
    },

    onPersonalizationChange(e) {
      this.personalization = e.detail.value
      this.savePrivacySettings()
      uni.showToast({
        title: this.personalization ? '已开启个性化推荐' : '已关闭个性化推荐',
        icon: 'none'
      })
    },

    onDataSharingChange(e) {
      this.dataSharing = e.detail.value
      this.savePrivacySettings()
      uni.showToast({
        title: this.dataSharing ? '已开启数据共享' : '已关闭数据共享',
        icon: 'none'
      })
    },

    managePermission(type) {
      uni.showModal({
        title: '权限管理',
        content: `请在系统设置中管理${this.getPermissionName(type)}权限`,
        showCancel: false,
        confirmText: '知道了'
      })
    },

    getPermissionName(type) {
      const names = {
        camera: '相机',
        album: '相册',
        location: '位置'
      }
      return names[type] || '未知'
    },

    viewPolicy(type) {
      const titles = {
        full: '完整隐私政策',
        data: '数据使用说明',
        cookies: 'Cookie政策'
      }

      const contents = {
        full: '智慧物业科技有限公司（以下简称"我们"）深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠...',
        data: '我们收集您的个人信息主要是为了向您提供更优质的服务体验。收集的信息类型包括...',
        cookies: '我们使用Cookie和类似技术来改善您的使用体验。Cookie是存储在您设备上的小文件...'
      }

      uni.showModal({
        title: titles[type],
        content: contents[type],
        showCancel: false,
        confirmText: '知道了'
      })
    },

    exportData() {
      uni.showModal({
        title: '导出数据',
        content: '我们将整理您的个人数据并在3个工作日内发送到您的注册邮箱',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '提交中...'
            })

            setTimeout(() => {
              uni.hideLoading()
              uni.showToast({
                title: '申请已提交',
                icon: 'success'
              })
            }, 2000)
          }
        }
      })
    },

    deleteAccount() {
      uni.showModal({
        title: '注销账号',
        content: '注销后将无法恢复，所有数据将被永久删除。确定要注销吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showModal({
              title: '最后确认',
              content: '账号注销是不可逆操作，请谨慎确认！',
              success: (confirmRes) => {
                if (confirmRes.confirm) {
                  uni.showLoading({
                    title: '注销中...'
                  })

                  setTimeout(() => {
                    uni.hideLoading()
                    uni.showToast({
                      title: '账号已注销',
                      icon: 'success'
                    })

                    setTimeout(() => {
                      // 跳转到登录页
                      uni.reLaunch({
                        url: '/pages/login/login'
                      })
                    }, 1500)
                  }, 2000)
                }
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.privacy-page {
  background: #f5f5f5;
  min-height: 100vh;

  .content {
    padding: 35rpx;

    .privacy-section, .policy-section {
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

      .privacy-list {
        .privacy-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20rpx 0;
          border-bottom: 1rpx solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .privacy-info {
            flex: 1;
            margin-right: 20rpx;

            .privacy-main {
              display: flex;
              align-items: center;
              margin-bottom: 8rpx;

              .privacy-text {
                font-size: 26rpx;
                color: #333;
                margin-left: 15rpx;
              }
            }

            .privacy-desc {
              font-size: 22rpx;
              color: #999;
              line-height: 1.4;
              margin-left: 35rpx;
            }
          }

          .privacy-selector {
            display: flex;
            align-items: center;

            .selector-text {
              font-size: 24rpx;
              color: #666;
              margin-right: 10rpx;
            }
          }

          .permission-status {
            display: flex;
            align-items: center;

            text {
              font-size: 24rpx;
              color: #999;
              margin-right: 10rpx;

              &.granted {
                color: #52c41a;
              }
            }
          }

          switch {
            transform: scale(0.8);
          }
        }
      }
    }

    .policy-section {
      .policy-content {
        .policy-title {
          display: block;
          font-size: 26rpx;
          color: #333;
          font-weight: 600;
          margin-bottom: 15rpx;
        }

        .policy-summary {
          display: block;
          font-size: 24rpx;
          color: #666;
          line-height: 1.6;
          margin-bottom: 25rpx;
        }

        .policy-links {
          .policy-link {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15rpx 0;
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

            text {
              font-size: 24rpx;
              color: #3b5598;
            }
          }
        }
      }
    }

    .action-section {
      display: flex;
      gap: 20rpx;

      .action-btn {
        flex: 1;
        height: 70rpx;
        border-radius: 8rpx;
        font-size: 26rpx;
        font-weight: 600;
        border: none;

        &.secondary {
          background: white;
          color: #666;
          border: 1rpx solid #e0e0e0;
        }

        &.danger {
          background: #f5222d;
          color: white;
        }
      }
    }
  }
}
</style>
