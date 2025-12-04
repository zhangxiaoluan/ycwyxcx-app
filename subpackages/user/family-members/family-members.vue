<template>
  <view class="family-members-page">


    <view class="content">
      <view class="members-list" v-if="familyMembers.length > 0">
        <view
          class="member-item"
          v-for="(member, index) in familyMembers"
          :key="member.id"
        >
          <view class="member-info">
            <view class="member-avatar">
              <image :src="member.avatar" class="avatar" mode="aspectFill"></image>
            </view>
            <view class="member-details">
              <text class="member-name">{{ member.name }}</text>
              <text class="member-relation">{{ member.relation }}</text>
              <view class="member-permissions">
                <text class="permission-tag" v-for="permission in member.permissions" :key="permission">
                  {{ getPermissionText(permission) }}
                </text>
              </view>
            </view>
          </view>
          <view class="member-actions">
            <button class="action-btn edit" @click="editMember(member)">
              <u-icon name="edit-pen" size="16" color="#3b5598"></u-icon>
            </button>
            <button class="action-btn delete" @click="deleteMember(index)">
              <u-icon name="trash" size="16" color="#f5222d"></u-icon>
            </button>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else>
        <view class="empty-icon">👨</view>
        <text class="empty-text">暂无家庭成员</text>
        <text class="empty-desc">添加家庭成员后可以设置不同的访问权限</text>
        <button class="empty-add-btn" @click="addMember">
          <u-icon name="plus" size="20" color="#3b5598"></u-icon>
          <text>添加第一个成员</text>
        </button>
      </view>
    </view>

    <!-- 添加/编辑成员弹窗 -->
    <u-modal
        :show="showMemberModal"
      :title="isEditing ? '编辑成员' : '添加成员'"
      @confirm="saveMember"
      @cancel="cancelMember"
    >
      <view class="modal-form">
        <view class="form-item">
          <text class="form-label">姓名</text>
          <input v-model="memberForm.name" class="form-input" placeholder="请输入成员姓名" />
        </view>

        <view class="form-item">
          <text class="form-label">关系</text>
          <picker :range="relationOptions" range-key="value" @change="onRelationChange">
            <view class="picker">
              {{ memberForm.relation || '请选择关系' }}
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label">手机号</text>
          <input v-model="memberForm.phone" class="form-input" placeholder="请输入手机号" type="number" />
        </view>

        <view class="form-item">
          <text class="form-label">头像</text>
          <view class="avatar-upload" @click="chooseAvatar">
            <image v-if="memberForm.avatar" :src="memberForm.avatar" class="avatar-preview" mode="aspectFill"></image>
            <view v-else class="avatar-placeholder">
              <u-icon name="camera" size="30" color="#999"></u-icon>
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">权限设置</text>
          <view class="permissions-group">
            <checkbox-group @change="onPermissionsChange">
              <label class="permission-item" v-for="permission in permissionOptions" :key="permission.value">
                <checkbox :value="permission.value" :checked="memberForm.permissions.includes(permission.value)" />
                <text>{{ permission.label }}</text>
              </label>
            </checkbox-group>
          </view>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import {familyMembers} from "@/api/list/family-members";
export default {
  data() {
    return {
      familyMembers: [
        {
          id: 1,
          name: '张三',
          relation: '配偶',
          phone: '13800138000',
          avatar: '/static/images/avatar1.png',
          permissions: ['view', 'pay', 'notice']
        },
        {
          id: 2,
          name: '李四',
          relation: '子女',
          phone: '13900139000',
          avatar: '/static/images/avatar2.png',
          permissions: ['view']
        }
      ],
      showMemberModal: false,
      isEditing: false,
      currentMemberId: null,
      memberForm: {
        name: '',
        relation: '',
        phone: '',
        avatar: '',
        permissions: []
      },
      relationOptions: [
        { label: '配偶', value: 'spouse' },
        { label: '子女', value: 'child' },
        { label: '父母', value: 'parent' },
        { label: '兄弟姐妹', value: 'sibling' },
        { label: '其他', value: 'other' }
      ],
      permissionOptions: [
        { label: '查看账单', value: 'view' },
        { label: '支付权限', value: 'pay' },
        { label: '接收通知', value: 'notice' },
        { label: '管理权限', value: 'manage' }
      ]
    }
  },
  onLoad() {
    this.getFamilyMembers()
  },
  methods: {
    getFamilyMembers(){
      familyMembers().then(res => {
        console.log(11, res)
      })
    },
    addMember() {
      this.isEditing = false
      this.currentMemberId = null
      this.resetForm()
      this.showMemberModal = true
    },

    editMember(member) {
      console.log(member)
      this.isEditing = true
      this.currentMemberId = member.id
      this.memberForm = {
        name: member.name,
        relation: member.relation,
        phone: member.phone,
        avatar: member.avatar,
        permissions: [...member.permissions]
      }
      this.showMemberModal = true
    },

    deleteMember(index) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该家庭成员吗？',
        success: (res) => {
          if (res.confirm) {
            this.familyMembers.splice(index, 1)
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }
        }
      })
    },

    saveMember() {
      if (!this.validateForm()) {
        return
      }

      if (this.isEditing) {
        const index = this.familyMembers.findIndex(m => m.id === this.currentMemberId)
        if (index !== -1) {
          this.familyMembers[index] = {
            ...this.familyMembers[index],
            ...this.memberForm,
            id: this.currentMemberId
          }
        }
      } else {
        const newMember = {
          id: Date.now(),
          ...this.memberForm
        }
        this.familyMembers.push(newMember)
      }

      this.showMemberModal = false
      uni.showToast({
        title: this.isEditing ? '更新成功' : '添加成功',
        icon: 'success'
      })
    },

    cancelMember() {
      this.showMemberModal = false
    },

    resetForm() {
      this.memberForm = {
        name: '',
        relation: '',
        phone: '',
        avatar: '',
        permissions: []
      }
    },

    validateForm() {
      if (!this.memberForm.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        return false
      }
      if (!this.memberForm.relation) {
        uni.showToast({
          title: '请选择关系',
          icon: 'none'
        })
        return false
      }
      if (!this.memberForm.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return false
      }
      if (this.memberForm.permissions.length === 0) {
        uni.showToast({
          title: '请设置权限',
          icon: 'none'
        })
        return false
      }
      return true
    },

    onRelationChange(e) {
      this.memberForm.relation = e.detail.value
      const option = this.relationOptions.find(opt => opt.value === e.detail.value)
      if (option) {
        this.memberForm.relation = option.label
      }
    },

    onPermissionsChange(e) {
      this.memberForm.permissions = e.detail.value
    },

    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.memberForm.avatar = res.tempFilePaths[0]
        }
      })
    },

    getPermissionText(permission) {
      const option = this.permissionOptions.find(opt => opt.value === permission)
      return option ? option.label : permission
    }
  }
}
</script>

<style lang="scss">
.family-members-page {
  background: #f5f5f5;
  min-height: 100vh;

  .header {
    background: #3b5598;
    padding: 40rpx 35rpx;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 36rpx;
      font-weight: 600;
    }

    .add-btn {
      display: flex;
      align-items: center;
      background: #415594;
      //background: rgba(255, 255, 255, 0.2);
      //border: 1rpx solid rgba(255, 255, 255, 0.3);
      border-radius: 20rpx;
      padding: 12rpx 20rpx;
      font-size: 24rpx;

      text {
        margin-left: 8rpx;
      }
    }
  }

  .content {
    padding: 35rpx;

    .members-list {
      .member-item {
        background: white;
        border-radius: 16rpx;
        padding: 30rpx;
        margin-bottom: 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .member-info {
          display: flex;
          align-items: center;
          flex: 1;

          .member-avatar {
            margin-right: 20rpx;

            .avatar {
              width: 80rpx;
              height: 80rpx;
              border-radius: 40rpx;
              background: #f0f0f0;
            }
          }

          .member-details {
            flex: 1;

            .member-name {
              display: block;
              font-size: 30rpx;
              font-weight: 600;
              color: #333;
              margin-bottom: 8rpx;
            }

            .member-relation {
              font-size: 24rpx;
              color: #666;
              margin-bottom: 12rpx;
            }

            .member-permissions {
              display: flex;
              flex-wrap: wrap;
              gap: 8rpx;

              .permission-tag {
                background: #e6f7ff;
                color: #1890ff;
                font-size: 20rpx;
                padding: 4rpx 12rpx;
                border-radius: 12rpx;
              }
            }
          }
        }

        .member-actions {
          display: flex;
          gap: 15rpx;

          .action-btn {
            width: 60rpx;
            height: 60rpx;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1rpx solid #e0e0e0;
            background: white;

            &.edit {
              border-color: #3b5598;
            }

            &.delete {
              border-color: #f5222d;
            }
          }
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 100rpx 30rpx;

      .empty-icon {
        font-size: 120rpx;
        margin-bottom: 30rpx;
      }

      .empty-text {
        display: block;
        font-size: 32rpx;
        color: #333;
        margin-bottom: 10rpx;
        font-weight: 600;
      }

      .empty-desc {
        display: block;
        font-size: 26rpx;
        color: #999;
        margin-bottom: 40rpx;
      }

      .empty-add-btn {
        background: #3b5598;
        color: white;
        border: none;
        border-radius: 20rpx;
        padding: 20rpx 40rpx;
        font-size: 28rpx;
        font-weight: 600;
        display: inline-flex;
        align-items: center;

        text {
          margin-left: 10rpx;
        }
      }
    }
  }

  .modal-form {
    .form-item {
      margin-bottom: 30rpx;

      .form-label {
        display: block;
        font-size: 28rpx;
        color: #333;
        margin-bottom: 15rpx;
        font-weight: 500;
      }

      .form-input {
        width: 100%;
        height: 80rpx;
        border: 1rpx solid #e0e0e0;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
      }

      .picker {
        width: 100%;
        height: 80rpx;
        border: 1rpx solid #e0e0e0;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #333;
        display: flex;
        align-items: center;
      }

      .avatar-upload {
        border: 2rpx dashed #d9d9d9;
        border-radius: 12rpx;
        padding: 40rpx;
        text-align: center;

        .avatar-preview {
          width: 120rpx;
          height: 120rpx;
          border-radius: 60rpx;
        }

        .avatar-placeholder {
          width: 120rpx;
          height: 120rpx;
          border-radius: 60rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
        }
      }

      .permissions-group {
        .permission-item {
          display: flex;
          align-items: center;
          margin-bottom: 20rpx;

          text {
            margin-left: 15rpx;
            font-size: 28rpx;
            color: #333;
          }
        }
      }
    }
  }
}
</style>
