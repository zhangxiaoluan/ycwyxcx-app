<template>
  <view class="property-application-page">
    <view class="content">
      <view class="notice-section">
        <view class="notice-icon">
          <u-icon name="info-circle" size="18" color="#3b5598"></u-icon>
        </view>
        <view class="notice-text">
          请认真填写以下信息，我们将尽快审核您的物业申请
        </view>
      </view>

      <view class="form-section">
        <view class="form-item required">
          <text class="form-label">申请人姓名</text>
          <input
            v-model="formData.applicantName"
            class="form-input"
            placeholder="请输入您的真实姓名"
            maxlength="20"
          />
        </view>

        <view class="form-item required">
          <text class="form-label">联系电话</text>
          <input
            v-model="formData.applicantPhone"
            class="form-input"
            placeholder="请输入您的联系电话"
            type="number"
            maxlength="11"
          />
        </view>

        <view class="form-item required">
          <text class="form-label">申请角色</text>
          <picker
            :value="selectedIndex"
            :range="propertyRoles"
            range-key="name"
            @change="onRoleChange"
          >
            <view class="picker">
              {{ selectedRoleName || '请选择申请的物业角色' }}
            </view>
          </picker>
          <view class="role-description" v-if="selectedRoleDescription">
            {{ selectedRoleDescription }}
          </view>
        </view>

        <view class="form-item required">
          <text class="form-label">申请原因</text>
          <textarea
            v-model="formData.applicationReason"
            class="form-textarea"
            placeholder="请详细说明您申请物业岗位的原因和相关经验"
            maxlength="500"
          ></textarea>
          <text class="input-count">{{ formData.applicationReason.length }}/500</text>
        </view>
      </view>

      <view class="submit-section">
        <button
          class="submit-btn"
          @click="submitApplication"
          :disabled="submitting"
        >
          <u-icon name="checkmark" size="16" color="#fff" v-if="!submitting"></u-icon>
          <u-loading-icon mode="circle" color="#fff" size="16" v-else></u-loading-icon>
          <text>{{ submitting ? '提交中...' : '提交申请' }}</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import {propertyApply, propertyRoles as getPropertyRoles} from "../../../api/list/user";

export default {
  name: "property-application",
  data() {
    return {
      formData: {
        applicantName: '',
        applicantPhone: '',
        appliedRoleId: null,
        applicationReason: ''
      },
      propertyRoles: [],
      submitting: false,
      userInfo: {}
    }
  },
  computed: {
    // 获取选中角色的索引
    selectedIndex() {
      if (!this.formData.appliedRoleId || this.propertyRoles.length === 0) {
        return 0
      }
      for (let i = 0; i < this.propertyRoles.length; i++) {
        if (this.propertyRoles[i].id === this.formData.appliedRoleId) {
          return i
        }
      }
      return 0
    },
    // 获取选中角色的名称
    selectedRoleName() {
      if (!this.formData.appliedRoleId || this.propertyRoles.length === 0) {
        return ''
      }
      for (let i = 0; i < this.propertyRoles.length; i++) {
        if (this.propertyRoles[i].id === this.formData.appliedRoleId) {
          return this.propertyRoles[i].name
        }
      }
      return ''
    },
    // 获取选中角色的描述
    selectedRoleDescription() {
      if (!this.formData.appliedRoleId || this.propertyRoles.length === 0) {
        return ''
      }
      for (let i = 0; i < this.propertyRoles.length; i++) {
        if (this.propertyRoles[i].id === this.formData.appliedRoleId) {
          return this.propertyRoles[i].description
        }
      }
      return ''
    }
  },
  onLoad() {
    this.getUserInfo()
    this.getPropertyRoles()
  },
  methods: {

    getUserInfo() {
      const userInfo = uni.getStorageSync('wyUserInfo')
      if (userInfo) {
        this.userInfo = userInfo
        this.formData.applicantName = userInfo.name || ''
        this.formData.applicantPhone = userInfo.cellphone || ''
      }
    },

    // 获取物业角色列表
    async getPropertyRoles() {
      try {
        const res = await getPropertyRoles()
        this.propertyRoles = res || []
      } catch (error) {
        console.error('获取物业角色失败:', error)
        // 如果API失败，使用默认角色数据
        this.propertyRoles = [
          { id: 1, name: '物业管理员', description: '负责小区物业管理和维护' },
          { id: 2, name: '安保人员', description: '负责小区安全巡查和门禁管理' },
          { id: 3, name: '维修工程师', description: '负责公共设施维修和保养' },
          { id: 4, name: '绿化养护员', description: '负责小区绿化和环境卫生' }
        ]
      }
    },

    onRoleChange(e) {
      const index = e.detail.value
      this.formData.appliedRoleId = this.propertyRoles[index].id
    },

    validateForm() {
      if (!this.formData.applicantName.trim()) {
        uni.showToast({ title: '请输入申请人姓名', icon: 'none' })
        return false
      }

      if (!this.formData.applicantPhone.trim()) {
        uni.showToast({ title: '请输入联系电话', icon: 'none' })
        return false
      }

      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(this.formData.applicantPhone)) {
        uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
        return false
      }

      if (!this.formData.appliedRoleId) {
        uni.showToast({ title: '请选择申请的物业角色', icon: 'none' })
        return false
      }

      if (!this.formData.applicationReason.trim()) {
        uni.showToast({ title: '请输入申请原因', icon: 'none' })
        return false
      }

      return true
    },

    async submitApplication() {
      if (!this.validateForm()) {
        return
      }

      try {
        this.submitting = true

        await propertyApply(this.formData)

        uni.showToast({
          title: '申请提交成功',
          icon: 'success'
        })

        this.formData = {
          applicantName: this.userInfo.name || '',
          applicantPhone: this.userInfo.cellphone || '',
          appliedRoleId: null,
          applicationReason: ''
        }

        setTimeout(() => {
          uni.navigateBack()
        }, 2000)

      } catch (error) {
        console.error('物业申请提交失败:', error)
        uni.showToast({
          title: error.message || '申请提交失败，请重试',
          icon: 'none'
        })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.property-application-page {
  min-height: 100vh;
  background: linear-gradient(to right, #e0ecfa 0%, #f4f6f9 50%, #f6f4fc 100%);
  padding: 30rpx 35rpx;
}

.notice-section {
  display: flex;
  align-items: flex-start;
  background: linear-gradient(135deg, rgba(59, 85, 152, 0.1) 0%, rgba(112, 82, 164, 0.1) 100%);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
  border: 1rpx solid rgba(59, 85, 152, 0.2);

  .notice-icon {
    margin-right: 16rpx;
    margin-top: 4rpx;
  }

  .notice-text {
    flex: 1;
    font-size: 26rpx;
    color: #3b5598;
    line-height: 1.6;
  }
}

.form-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 35rpx;
  box-shadow: 0 4rpx 20rpx rgba(59, 85, 152, 0.06);
}

.form-item {
  margin-bottom: 50rpx;

  &:last-child {
    margin-bottom: 0;
  }

  &.required .form-label::before {
    content: '*';
    color: #f5222d;
    margin-right: 8rpx;
  }
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  display: block;
  margin-bottom: 20rpx;
}

.form-input, .form-textarea {
  padding: 28rpx 24rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 16rpx;
  font-size: 28rpx;
  background: #fafafa;
  color: #333;
  transition: all 0.3s ease;

  &:focus {
    border-color: #3b5598;
    background: #fff;
  }

  &::placeholder {
    color: #999;
  }
}

.form-textarea {
  height: 240rpx;
  resize: none;
  width: auto;
}

.input-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  display: block;
  margin-top: 12rpx;
}

.picker {
  padding: 28rpx 24rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 16rpx;
  background: #fafafa;
  color: #333;
  font-size: 28rpx;
  transition: all 0.3s ease;

  &:active {
    border-color: #3b5598;
    background: #fff;
  }
}

.role-description {
  font-size: 24rpx;
  color: #666;
  margin-top: 12rpx;
  padding: 16rpx;
  background: rgba(59, 85, 152, 0.05);
  border-radius: 12rpx;
  border-left: 4rpx solid #3b5598;
}

.submit-section {
  padding: 50rpx 0 30rpx;
}

.submit-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #3b5598 0%, #39648f 100%);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(59, 85, 152, 0.3);
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.7;
    transform: none;
  }

  &:active:not(:disabled) {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 12rpx rgba(59, 85, 152, 0.4);
  }

  u-icon, u-loading-icon {
    margin-right: 12rpx;
  }
}

uni-button[disabled]:not([type]), uni-button[disabled][type=default] {
  color: #fff !important;
  background: linear-gradient(135deg, #3b5598 0%, #39648f 100%) !important;
  opacity: 0.7;
}
</style>
