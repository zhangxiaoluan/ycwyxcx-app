<template>
  <view class="profile-page">
    <view class="content">
      <!-- 头像 Cell -->
      <view class="cell-item" @click="chooseavatar">
        <view class="cell-left">
          <text class="cell-title">头像</text>
        </view>
        <view class="cell-right">
          <view class="avatar-wrapper">
            <image
              :src="userInfo.avatar || '/static/default-avatar.png'"
              class="avatar-image"
              mode="aspectFill"
            />
            <button
                class="avatar-hidden-btn"
                open-type="chooseAvatar"
                @chooseavatar="chooseavatar"
            />
          </view>
        </view>
      </view>

      <!-- 昵称 Cell -->
      <view class="cell-item">
        <view class="cell-left">
          <text class="cell-title">昵称</text>
        </view>
        <view class="cell-right">
          <input
            type="nickname"
            v-model="userInfo.nickname"
            class="cell-input"
            placeholder="请输入昵称"
          />
        </view>
      </view>

      <!-- 性别 Cell -->
      <view class="cell-item">
        <view class="cell-left">
          <text class="cell-title">性别</text>
        </view>
        <view class="cell-right">
          <radio-group @change="onGenderChange" class="gender-group">
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
      </view>

      <!-- 生日 Cell -->
      <view class="cell-item">
        <view class="cell-left">
          <text class="cell-title">生日</text>
        </view>
        <view class="cell-right">
          <picker mode="date" :value="userInfo.birthday" @change="onBirthdayChange">
            <view class="cell-picker">
              <text class="cell-text" :class="{ placeholder: !userInfo.birthday }">
                {{ userInfo.birthday || '请选择生日' }}
              </text>
            </view>
          </picker>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="btn-container">
        <button class="save-btn" @click="saveProfile">保存</button>
      </view>
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
        gender: 'male',
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

    chooseavatar(e) {
      let detail = e.detail || {}
      // 处理微信选择头像
      if (detail.avatarUrl) {
        this.userInfo.avatar = e.detail.avatarUrl
      }

      // #ifdef H5 | WEB
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.userInfo.avatar = res.tempFilePaths[0]
        }
      })
      // #endif
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
  padding: 30rpx;


  .content {
    background: white;
    border-radius: 20rpx;
    overflow: hidden;
    padding: 0 20rpx;
    .cell-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx;
      border-bottom: 1rpx solid #e5e5e5;
      background: white;
      transition: background-color 0.2s;

      &:active {
        background: #f5f5f5;
      }

      &:last-child {
        border-bottom: none;
      }

      .cell-left {
        flex-shrink: 0;

        .cell-title {
          font-size: 32rpx;
          color: #333;
          font-weight: 500;
        }
      }

      .cell-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-left: 30rpx;

        .avatar-wrapper {
          position: relative;
          width: 120rpx;
          height: 120rpx;

          .avatar-image {
            width: 100%;
            height: 100%;
            border-radius: 60rpx;
            overflow: hidden;
          }

          .avatar-hidden-btn {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            z-index: 10;
            border: 1px solid red;
          }
        }

        .cell-input {
          text-align: right;
          font-size: 30rpx;
          color: #333;
          flex: 1;
          min-height: 40rpx;

          &::placeholder {
            color: #999;
            font-size: 30rpx;
          }
        }

        .gender-group {
          display: flex;
          gap: 40rpx;

          .radio-item {
            display: flex;
            align-items: center;

            text {
              margin-left: 10rpx;
              font-size: 30rpx;
              color: #333;
            }
          }
        }

        .cell-picker {
          display: flex;
          align-items: center;

          .cell-text {
            font-size: 30rpx;
            color: #333;

            &.placeholder {
              color: #999;
            }
          }

          .cell-arrow {
            margin-left: 16rpx;
            font-size: 28rpx;
            color: #c8c9cc;
            font-weight: bold;
          }
        }

        .cell-arrow {
          margin-left: 16rpx;
          font-size: 28rpx;
          color: #c8c9cc;
          font-weight: bold;
        }
      }
    }

    .btn-container {
      padding: 60rpx 30rpx 40rpx;

      .save-btn {
        background: #3b5598;
        color: white;
        border: none;
        border-radius: 12rpx;
        height: 80rpx;
        font-size: 30rpx;
        font-weight: 600;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
          background: #2d4a7d;
          transform: scale(0.9);
        }
      }
    }
  }
}
</style>
