<template>
  <view class="customPage" :style="{ paddingTop: getTopPadding + 'px' }">
    <!-- 自定义导航栏 -->
    <!-- top: statusBarHeight + 'px' -->
    <view
        v-if="showNavBar"
        class="custom-navbar"
        :style="{
        height: navBarHeight + 'px',
        background: backgroundColor,
        borderBottom: borderBottom ? `1px solid ${borderColor}` : 'none',
        paddingTop: statusBarHeight + 'px'
      }"
    >

      <!-- 左侧区域 -->
      <view class="nav-left" @click="handleLeftClick">
        <slot name="left">
          <!-- 返回按钮 -->
          <view v-if="showBack" class="back-button">
            <u-icon name="arrow-left" :size="iconSize" :color="textColor"></u-icon>
            <text class="left-title">{{ leftTitle }}</text>
          </view>
        </slot>
      </view>

      <!-- 中间标题区域 -->
      <view class="nav-title" :style="{ color: textColor, fontSize: titleFontSize + 'rpx' }">
        <slot name="title">
          {{ title }}
        </slot>
      </view>

      <!-- 右侧区域 -->
      <view class="nav-right">
        <slot name="right">
          <!-- 默认右侧内容 -->
          <view v-if="rightText" class="right-text" :style="{ color: textColor }" @click="handleRightClick">
            {{ rightText }}
            <text class="unread-count" v-if="unreadCount">{{ unreadCount }}</text>
          </view>
        </slot>
      </view>
    </view>

    <!-- 导航栏占位（仅在显示导航栏时） -->
    <view
        v-if="showNavBar"
        class="navbar-placeholder"
        :style="{ height: (navBarHeight + statusBarHeight) + 'px' }"
    ></view>

    <!-- 页面内容 -->
    <view class="page-content">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomPage',
  props: {
    // 导航栏标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示导航栏
    showNavBar: {
      type: Boolean,
      default: true
    },
    // 是否显示返回按钮
    showBack: {
      type: Boolean,
      default: true
    },
    // 导航栏背景色
    backgroundColor: {
      type: String,
      default: ''
    },
    // 文字颜色
    textColor: {
      type: String,
      default: ''
    },
    // 文字大小
    titleFontSize: {
      type: [Number, String],
      default: 31
    },
    unreadCount: {
      type: [Number, String],
      default: ''
    },
    iconSize: {
      type: [Number, String],
      default: 20
    },
    rightText: {
      type: String,
      default: ''
    },
    leftTitle: {
      type: String,
      default: ''
    },
    borderBottom: {
      type: Boolean,
      default: true
    },
    borderColor: {
      type: String,
      default: '#e0e0e0'
    },
    // 是否沉浸式（透明导航栏）
    immersive: {
      type: Boolean,
      default: false
    },
    // 是否固定导航栏
    fixed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      statusBarHeight: 0,
      navBarHeight: 55, // 默认导航栏高度
      menuButtonInfo: null
    }
  },
  computed: {
    // 总导航栏高度
    totalNavBarHeight() {
      return this.showNavBar ? this.statusBarHeight + this.navBarHeight : 0
    },
    // 获取顶部间距
    getTopPadding() {
      if (this.showNavBar) {
        return 0
      } else {
        // 隐藏导航栏时：需要状态栏高度防止内容贴顶
        // #ifdef APP-PLUS
        return this.statusBarHeight
        // #endif
        // #ifdef MP-WEIXIN
        return this.statusBarHeight
        // #endif
        // #ifdef H5
        return 0 // H5端可以不用状态栏间距
        // #endif
        return this.statusBarHeight
      }
    }
  },
  mounted() {
    this.initNavBarHeight()

  },
  methods: {
    // 初始化导航栏高度
    initNavBarHeight() {
      // 获取系统信息
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight || 0

      // 微信小程序处理胶囊按钮
      // #ifdef MP-WEIXIN
      if (uni.getMenuButtonBoundingClientRect) {
        this.menuButtonInfo = uni.getMenuButtonBoundingClientRect()
        // 计算导航栏高度：胶囊按钮底部 - 状态栏高度 + 上下边距
        this.navBarHeight = (this.menuButtonInfo.bottom - this.statusBarHeight) +
            (this.menuButtonInfo.top - this.statusBarHeight)
      }
      // #endif

      // iOS设备导航栏高度调整
      // #ifdef APP-PLUS
      if (systemInfo.platform === 'ios') {
        this.navBarHeight = 55
      } else {
        this.navBarHeight = 60
      }
      // #endif

      // H5平台导航栏高度
      // #ifdef H5
      this.navBarHeight = 55
      // #endif
    },

    // 左侧按钮点击事件
    handleLeftClick() {
      this.$emit('leftClick')
      // 默认返回上一页
      if (this.showBack) {
        uni.navigateBack({delta: 1})
      }
    },

    // 右侧按钮点击事件
    handleRightClick() {
      this.$emit('rightClick')
    },

    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.customPage {
  min-height: 100vh;
  background-color: #f5f7fa;

  .custom-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
    z-index: 999;
    background: linear-gradient(160deg, #092868 0%, rgba(51, 86, 157, 0.7) 100%);
    color: #ffffff;
    backdrop-filter: blur(20rpx);

    .nav-left {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      min-width: 60rpx;

      .back-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10rpx;
        border-radius: 50%;

        .left-title {
          margin-left: 10rpx;
        }

        &:active {
          background: rgba(0, 0, 0, 0.1);
        }
      }
    }

    .nav-title {
      //flex: 2;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      min-width: 60rpx;

      .right-text {
        font-size: 28rpx;
        padding: 10rpx 20rpx;
        border-radius: 30rpx;
        position: relative;

        &:active {
          background: rgba(0, 0, 0, 0.1);
        }
      }

      .unread-count {
        position: absolute;
        top: -2px;
        right: 0px;
        color: #ef4444;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }

  .page-content {
    width: 100%;
  }
}

// 沉浸式模式样式
.customPage.immersive {
  .custom-navbar {
    background: transparent !important;
    border-bottom: none !important;
  }
}
</style>
