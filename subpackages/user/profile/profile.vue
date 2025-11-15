<template>
  <view class="profile-page">

    <view class="content">
      <view class="form-item">
        <text class="label">头像</text>
        <view class="avatar-section" @click="chooseAvatar">
          <image :src="userInfo.avatar" class="avatar" mode="aspectFill"></image>
          <text class="change-text">点击更换</text>
        </view>
      </view>

      <view class="form-item">
        <text class="label">昵称</text>
        <input v-model="userInfo.nickname" class="input" placeholder="请输入昵称" />
      </view>

      <view class="form-item">
        <text class="label">性别</text>
        <radio-group @change="onGenderChange">
          <label class="radio-item">
            <radio value="male" color="#3b5598" :checked="userInfo.gender === 'male'" />
            <text>男</text>
          </label>
          <label class="radio-item">
            <radio value="female" color="#3b5598" :checked="userInfo.gender === 'female'" />
            <text>女</text>
          </label>
        </radio-group>
      </view>

      <view class="form-item">
        <text class="label">生日</text>
        <picker mode="date" :value="userInfo.birthday" @change="onBirthdayChange">
          <view class="picker">{{ userInfo.birthday || '请选择生日' }}</view>
        </picker>
      </view>

      <button class="save-btn" @click="saveProfile">保存</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        avatar: '/static/logo.png',
        nickname: '',
        gender: '',
        birthday: ''
      }
    }
  },
  onLoad() {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo() {
      // 加载用户信息
      console.log('加载用户信息')
    },

    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.userInfo.avatar = res.tempFilePaths[0]
        }
      })
    },

    onGenderChange(e) {
      this.userInfo.gender = e.detail.value
    },

    onBirthdayChange(e) {
      this.userInfo.birthday = e.detail.value
    },

    saveProfile() {
      // 保存用户信息
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss">
.profile-page {
  background: #f5f5f5;
  min-height: 100vh;

  .content {
    background: white;
    padding: 35rpx;

    .form-item {
      border-bottom: 1px solid #f2f2f2;
      padding: 0 0 25rpx 0;
      margin-bottom: 40rpx;

      .label {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
        font-weight: 500;
      }

      .avatar-section {
        display: flex;
        align-items: center;

        .avatar {
          width: 120rpx;
          height: 120rpx;
          border-radius: 60rpx;
          margin-right: 20rpx;
        }

        .change-text {
          color: #3b5598;
          font-size: 26rpx;
        }
      }

      .input {
        width: 100%;
        height: 80rpx;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
      }

      .radio-item {
        display: inline-flex;
        align-items: center;
        margin-right: 40rpx;

        text {
          margin-left: 10rpx;
          font-size: 28rpx;
        }
      }

      .picker {
        width: 100%;
        height: 80rpx;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        color: #333;
      }
    }

    .save-btn {
      background: #3b5598;
      color: white;
      border: none;
      border-radius: 8rpx;
      height: 80rpx;
      font-size: 30rpx;
      font-weight: 600;
      margin-top: 20rpx;
    }
  }
}
</style>
