<template>
  <view class="login-container">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="bg-shape shape-1"></view>
      <view class="bg-shape shape-2"></view>
      <view class="bg-shape shape-3"></view>
    </view>

    <!-- 主要内容区域 -->
    <view class="login-content">
      <!-- Logo区域 -->
      <view class="logo-section">
        <view class="logo-container">
          <image src="/static/logo.png" class="logo" mode="aspectFit"></image>
        </view>
        <text class="app-title">智慧物业</text>
        <text class="app-subtitle">智慧物业服务平台</text>
      </view>

      <!-- 输入区域 -->
      <view class="input-section">
        <view class="other-login">
          <button
              class="wechat-login-btn"
              open-type="getUserInfo"
              @getuserinfo="handleWechatLogin"
              :disabled="isLoading"
          >
            <u-icon name="weixin-fill" size="36" color="#07c160" v-if="!isLoading"></u-icon>
            <text class="wechat-text" v-if="!isLoading">微信一键登录</text>
            <u-loading-icon size="36" color="#07c160" v-else></u-loading-icon>
          </button>

          <button type="default" open-type="getPhoneNumber" @getphonenumber="HandlePhoneNumber">授权获取手机号</button>

        </view>

        <!-- 用户协议 -->
        <view class="agreement">
          <view class="agreement-item">
            <u-checkbox-group v-model="agreedToTerms" @change="handleTermsChange">
              <u-checkbox
                  active-color="#3b5598"
                  name="agreed"
                  shape="circle"
                  size="19"
              ></u-checkbox>
            </u-checkbox-group>
            <text class="agreement-text">
              我已阅读并同意
              <text class="link" @click="showUserAgreement">《用户协议》</text>
              和
              <text class="link" @click="showPrivacyPolicy">《隐私政策》</text>
            </text>
          </view>
        </view>
      </view>
    </view>


  </view>
</template>

<script>
// import {sendRequest} from '@/api/request.js'

export default {
  name: 'Login',
  data() {
    return {
      isLoading: false,
      hasWechatAuth: false,
      wechatUserInfo: null,
      phoneNumber: null,
      agreedToTerms: [], // u-checkbox-group 需要数组格式
      loginCode: null,
      showPhoneModal: false, // 控制手机号授权弹窗
      // 新增表单数据
      username: '',
      password: ''
    }
  },
  onLoad() {},
  methods: {
    // 微信登录处理
    async handleWechatLogin(e) {
      console.log('微信登录回调:', e)
      // 检查是否同意用户协议
      if (this.agreedToTerms.length === 0) {
        uni.showToast({ title: '请先同意用户协议', icon: 'none' })
        return
      }

      // 检查授权结果
      if (e.detail.errMsg !== 'getUserInfo:ok') {
        uni.showToast({ title: '授权失败，请重试', icon: 'none' })
        return
      }

      this.isLoading = true

      try {
        // 保存微信用户信息
        this.wechatUserInfo = e.detail.userInfo
        this.hasWechatAuth = true

        uni.reLaunch({ url: '/pages/index/index' })

        uni.showToast({ title: '微信登录成功', icon: 'success' })

        // // 调用后端接口进行微信登录
        // const result = await this.wechatLoginToServer()
        //
        // if (result.success) {
        //   uni.showToast({ title: '微信登录成功', icon: 'success' })
        //
        //   // 显示手机号授权弹窗
        //   setTimeout(() => {
        //     this.showPhoneModal = true
        //   }, 1500)
        // }
      } catch (error) {
        console.error('微信登录失败:', error)
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },

    // 授权获取手机号
    HandlePhoneNumber(e){
      console.log(e)
    },

    // 处理用户协议选择
    handleTermsChange(value) {
      this.agreedToTerms = value
    },

    // 显示用户协议
    showUserAgreement() {
      uni.showModal({
        title: '用户协议',
        content: '这里是用户协议的内容...',
        showCancel: false
      })
    },

    // 显示隐私政策
    showPrivacyPolicy() {
      uni.showModal({
        title: '隐私政策',
        content: '这里是隐私政策的内容...',
        showCancel: false
      })
    },


    // // 跳转到首页
    // redirectToHome() {
    //   uni.switchTab({
    //     url: '/pages/index/index'
    //   })
    // }
  }
}
</script>

<style lang="scss">
.login-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #7052a454 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  overflow: hidden;

  /* 背景装饰 */
  .bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;

    .bg-shape {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 50%;
    }

    .shape-1 {
      width: 300rpx;
      height: 300rpx;
      top: -150rpx;
      right: -150rpx;
      background: radial-gradient(circle, rgba(108, 115, 211, 0.3), rgba(108, 115, 211, 0.1));
      animation: float-1 8s ease-in-out infinite;
    }

    .shape-2 {
      width: 200rpx;
      height: 200rpx;
      bottom: 100rpx;
      left: -100rpx;
      background: radial-gradient(circle, rgba(112, 82, 164, 0.3), rgba(112, 82, 164, 0.1));
      animation: float-2 10s ease-in-out infinite;
    }

    .shape-3 {
      width: 150rpx;
      height: 150rpx;
      top: 40%;
      right: 50rpx;
      background: radial-gradient(circle, rgba(59, 85, 152, 0.2), rgba(59, 85, 152, 0.05));
      animation: float-3 12s ease-in-out infinite;
    }

    @keyframes float-1 {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-30rpx) rotate(180deg);
      }
    }

    @keyframes float-2 {
      0%, 100% {
        transform: translateX(0) translateY(0);
      }
      50% {
        transform: translateX(20rpx) translateY(-20rpx);
      }
    }

    @keyframes float-3 {
      0%, 100% {
        transform: scale(1) rotate(0deg);
      }
      50% {
        transform: scale(1.1) rotate(90deg);
      }
    }
  }

  /* 主要内容区域 */
  .login-content {
    width: 100%;
    max-width: 700rpx;
    padding: 0;
    position: relative;

    /* Logo区域 */
    .logo-section {
      text-align: center;
      color: #fff;

      .logo-container {
        width: 120rpx;
        height: 120rpx;
        margin: 0 auto 20rpx;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 25rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);

        .logo {
          width: 80rpx;
          height: 80rpx;
        }

      }

      .app-title {
        display: block;
        font-size: 44rpx;
        font-weight: 700;
        margin-bottom: 12rpx;
        letter-spacing: 2rpx;
        color: #3b5598;
      }

      .app-subtitle {
        display: block;
        font-size: 26rpx;
        opacity: 0.8;
        color: rgba(78, 78, 78, 0.4);
      }


    }

    /* 输入区域 */
    .input-section {
      padding: 50rpx 40rpx 40rpx;


      /* 其他登录方式 */
      .other-login {
        margin-bottom: 40rpx;


        ::v-deep .wechat-login-btn {
          width: 100%;
          height: 85rpx;
          background: #fff;
          border: 1px solid;
          border-radius: 100rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #07c160;
          font-size: 30rpx;
          font-weight: 500;
          transition: all 0.3s ease;

          &:active {
            background: #f8f9fa;
            border-color: #07c160;
            transform: translateY(2rpx);
          }

          &[disabled] {
            opacity: 0.6;
            transform: none;
          }
        }

        .wechat-text {
          margin-left: 16rpx;
        }
      }

      /* 用户协议 */
      .agreement {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        .agreement-item {
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .agreement-text {
          font-size: 24rpx;
          color: #666;
          line-height: 1.5;
          flex: 1;
          padding-top: 2rpx;
        }

        .link {
          color: #3b5598;
          margin: 0 4rpx;
          touch-action: manipulation;
        }
      }
    }
  }

}
</style>
