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
              open-type="getPhoneNumber"
              @getphonenumber="HandlePhoneNumber"
              :disabled="isLoading"
              v-if="agreedToTerms.length !== 0 && !userForm.cellphone && !userForm.openid"
          >
            <u-icon name="weixin-fill" size="36" color="#07c160" v-if="!isLoading"></u-icon>
            <text class="wechat-text" v-if="!isLoading">微信一键登录</text>
            <u-loading-icon size="36" color="#07c160" v-else></u-loading-icon>
          </button>

          <button v-else class="wechat-login-btn" @click="HandlePhoneNumber">
            <u-icon name="weixin-fill" size="36" color="#07c160"></u-icon>
            <text class="wechat-text">微信一键登录</text>
          </button>
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
import {decryptPhoneNumber, getUserDetail} from "./auth";
import {Login} from "../../api/list/login";

export default {
  name: 'Login',
  data() {
    return {
      // 用户协议
      agreedToTerms: [],
      isLoading: false,
      userForm: uni.getStorageSync('wyUserInfo') || {
        openid: null,
        cellphone: null,
        nickName: null,
      },
      testCathH5: {
        "nickName": "微信用户",
        "gender": 0,
        "language": "",
        "city": "",
        "province": "",
        "country": "",
        "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
        "session_key": "LxvA8kyhjwKImPNOhMqbkw==",
        "openid": "oEctd16R4FFa6wLIjqOlnq1SA_xU",
        "cellphone": "18009501501",
        "id": "1990064316522438657",
        "name": "微信用户",
        "email": null,
        "emailVerifiedAt": null,
        "deptId": null,
        "deptName": null,
        "employeeNumber": null,
        "qywUserid": null,
        "loginName": "wx_oEctd16R",
        "region": null,
        "regionId": null,
        "subCompany": null,
        "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
        "subCompanyId": null
      }
    }
  },
  onLoad() {
    // todo 自定义缓存
    // #ifdef H5 | WEB
    uni.setStorageSync('wyUserInfo', this.testCathH5);
    // #endif
  },
  methods: {
    // 授权获取手机号
    HandlePhoneNumber(e) {
      let detail = e.detail || {}

      // 是否阅读协议
      if (this.agreedToTerms.length === 0) {
        return uni.showToast({title: '请先同意用户协议', icon: 'none'})
      }

      console.log(this.userForm)

      // 用户已经授权了直接登录
      if (this.userForm.cellphone && this.userForm.openid) {
        return this.toLogin()
      }

      // 用户第一次没有授权先去授权在登录
      let code = detail.code
      if (code) {
        this.getUserAuth(code)
      }
    },

    // 获取用户信息
    getUserAuth(code) {
      let $that = this
      this.isLoading = true
      try {
        decryptPhoneNumber(code).then(res => {
          let phoneNumber = res.phoneNumber
          uni.login({
            provider: 'weixin',
            onlyAuthorize: true,
            success: function (loginRes) {
              getUserDetail(loginRes.code).then(res => {
                let wyUserInfo = {...res, cellphone: phoneNumber}
                uni.setStorageSync('wyUserInfo', wyUserInfo)
                $that.userForm = wyUserInfo
                $that.toLogin()
              })
            }
          });
        })
      } catch (err) {
        this.isLoading = false
      }
    },

    // 登录请求后台接口
    toLogin() {
      let $that = this
      let query = { cellphone: this.userForm.cellphone, openid: this.userForm.openid }
      Login(query).then(res => {
        let token = res.token || ''
        uni.setStorage({
          key: 'token',
          data: token,
          success: function () {
            $that.redirectToHome()
            $that.isLoading = false
          }
        })
      })
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


    // 跳转到首页
    redirectToHome() {
      uni.switchTab({url: '/pages/index/index'})
    }
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
