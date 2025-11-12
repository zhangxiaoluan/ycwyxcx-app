<template>
  <view class="login-container">
    <!-- 顶部Logo区域 -->
    <view class="logo-section">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <view class="app-name">警务通</view>
      <view class="slogan">安全 · 高效 · 便捷</view>
    </view>

    <!-- 登录表单区域 -->
    <view class="form-container">

      <!-- 手机号输入框 -->
      <view>
        <view></view>
        <u-input
            v-model="phone"
            color="#ffffff"
            :border="borderType"
            placeholder="请输入手机号"
            keyboard-type="number"
            maxlength="11"
            @input="handleInput"
        ></u-input>
      </view>

      <!-- 密码输入框 -->
      <u-input
          v-model="password"
          color="#ffffff"
          :border="borderType"
          placeholder="请输入密码"
          type="password"
          @input="handleInput"
      ></u-input>

      <!-- 忘记密码和验证码登录链接 -->
      <view class="form-links">
        <navigator class="link" @click="goToForgotPassword">忘记密码?</navigator>
        <navigator class="link" @click="switchToCodeLogin">注册</navigator>
      </view>

      <!-- 登录按钮 -->
      <u-button
          :loading="loading"
          class="login-button"
          color="#ffffff"
          @click="handleLogin"
      >
        登录
      </u-button>
    </view>

    <!-- 底部版权信息 -->
    <view class="footer">
      © 2023 警务通 版权所有
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 主题色
      themeColor: '#2753cd',
      borderType: 'bottom',
      // 表单数据
      phone: '',
      password: '',
      // 状态控制
      loading: false,
      canLogin: false
    };
  },
  methods: {
    // 输入处理
    handleInput() {
      // 验证手机号和密码是否都已输入
      this.canLogin = this.phone.length === 11 && this.password.length >= 6;
    },
    // 登录处理
    handleLogin() {
      if (!this.canLogin) return;

      this.loading = true;
      // 模拟登录请求
      setTimeout(() => {
        this.loading = false;
        // 登录成功后跳转
        uni.switchTab({
          url: '/pages/index/index'
        });
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        });
      }, 1500);
    },
    // 跳转到忘记密码页面
    goToForgotPassword() {
      uni.navigateTo({
        url: '/pages/login/forgot-password'
      });
    },
    // 切换到验证码登录
    switchToCodeLogin() {
      uni.navigateTo({
        url: '/pages/login/code-login'
      });
    }
  }
};
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #0d3ca1 0%, #030c1f 100%);
  padding: 0 40rpx;
  display: flex;
  flex-direction: column;
  color: #ffffff;

  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 120rpx;
    margin-bottom: 80rpx;

    .logo {
      width: 180rpx;
      height: 180rpx;
      margin-bottom: 30rpx;
    }

    .app-name {
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .slogan {
      font-size: 24rpx;
    }
  }

  .form-container {
    padding: 30rpx;

    ::v-deep .u-input {
      margin-bottom: 60rpx;
      padding: 20rpx 10px !important;
      border-color: #c1c4cb !important;

      .u-input__content {
      }
    }

    .form-links {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40rpx;
      color: #ffffff;

      uni-navigator {
        font-size: 26rpx;
        color: #b0b5c1;
      }
    }


    .login-button {
      height: 90rpx;
      font-size: 32rpx;
      font-weight: 500;
      background: #ffffff;
      border-radius: 5px;
      color: #071332 !important;
    }
  }
}


//.form-container::before {
//  content: '';
//  position: absolute;
//  top: -50%;
//  left: -50%;
//  width: 200%;
//  height: 200%;
//  background: radial-gradient(circle at center, rgba(51, 86, 157, 0.2) 0%, rgba(39, 83, 205, 0) 70%);
//  z-index: 0;
//}
//
//.form-container > * {
//  position: relative;
//  z-index: 1;
//}


.footer {
  text-align: center;
  margin-top: auto;
  margin-bottom: 40rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
