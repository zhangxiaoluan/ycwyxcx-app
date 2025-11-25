<template>
  <view class="house-bindings-page">

    <!-- 绑定记录列表 -->
    <view class="bindings-list">
      <view
        v-for="(item, index) in bindingList"
        :key="index"
        class="binding-item"
      >
        <!-- 状态标签 -->
        <view
          v-if="item.status === 1"
          class="status-badge status-pending"
        >
          待审核
        </view>
        <view
          v-else-if="item.status === 2"
          class="status-badge status-approved"
        >
          已通过
        </view>
        <view
          v-else-if="item.status === 3"
          class="status-badge status-rejected"
        >
          已拒绝
        </view>
        <view
          v-else
          class="status-badge"
        >
          未知
        </view>

        <!-- 地址信息 -->
        <view class="address-info">
          <view class="community-name">
            {{ item.communityName || '小区名称' }}
            {{ item.buildingName || '栋' }} 栋
            {{ item.roomName || '房间' }}
          </view>
        </view>

        <!-- 用户信息 -->
        <view class="user-info">
          <view class="info-row">
            <text class="label">姓名：</text>
            <text class="value">{{ item.realName || '--' }}</text>
          </view>
          <view class="info-row">
            <text class="label">关系：</text>
            <text class="value">{{ getRelationText(item.relationType) }}</text>
          </view>
          <view class="info-row">
            <text class="label">电话：</text>
            <text class="value">{{ item.phone || '--' }}</text>
          </view>
        </view>

        <!-- 审核信息（如果已审核）-->
        <view class="audit-info" v-if="item.status !== 1">
          <view class="info-row">
            <text class="label">审核时间：</text>
            <text class="value">{{ formatTime(item.auditTime) }}</text>
          </view>
          <view class="info-row" v-if="item.auditRemark">
            <text class="label">审核备注：</text>
            <text class="value">{{ item.auditRemark }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-buttons">
          <button
            v-if="item.status === 1"
            class="btn-cancel"
            @click="cancelBinding(item)"
          >
            撤销申请
          </button>
          <button
            v-if="item.status === 2"
            class="btn-unbind"
            @click="unbindHouse(item)"
          >
            解除绑定
          </button>
          <button
            v-if="item.status === 3"
            class="btn-reapply"
            @click="reapplyBinding(item)"
          >
            重新申请
          </button>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="bindingList.length === 0 && !loading">
        <text class="empty-icon">🏠</text>
        <text class="empty-text">暂无房屋绑定记录</text>
        <text class="empty-desc">点击下方按钮添加房屋绑定</text>
      </view>

      <!-- 加载状态 -->
      <view class="loading-more" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>

    <!-- 底部悬浮添加按钮 -->
    <view class="fab-container">
      <button class="fab-button" @click="goToBinding">
        <text class="fab-icon">+</text>
        <text class="fab-text">添加绑定</text>
      </button>
    </view>
  </view>
</template>

<script>
import {houseBindings, houseBindingsDel} from '../../../api/list/house-binding'
export default {
  data() {
    return {
      bindingList: [], // 绑定记录列表
      loading: false,
      hasMore: true
    }
  },

  onLoad() {
    this.loadBindings()
  },

  onPullDownRefresh() {
    this.loadBindings(true)
  },

  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadBindings()
    }
  },

  methods: {
    // 加载绑定记录
    async loadBindings(refresh = false) {
      try {
        this.loading = true

        const params = {
          page: refresh ? 1 : Math.ceil(this.bindingList.length / 10) + 1,
          pageSize: 10
        }

        const result = await houseBindings(params)

        if (result && Array.isArray(result.records)) {
          const newRecords = result.records.map(item => {
            // 这里需要根据实际API返回的字段进行映射
            return {
              ...item,
              // 如果API没有返回这些字段，需要通过其他接口获取或省略显示
              communityName: item.communityName || '小区名称',
              buildingName: item.buildingName || '楼栋',
              roomName: item.roomName || '房间'
            }
          })

          if (refresh) {
            this.bindingList = newRecords
          } else {
            this.bindingList = [...this.bindingList, ...newRecords]
          }

          this.hasMore = newRecords.length >= params.pageSize
        }
      } catch (error) {
        console.error('获取绑定记录失败:', error)
        uni.showToast({
          title: '获取绑定记录失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
        if (refresh) {
          uni.stopPullDownRefresh()
        }
      }
    },

  
    // 获取关系文本
    getRelationText(relationType) {
      const relationMap = {
        1: '业主',
        2: '家人',
        3: '租客',
        4: '其他'
      }
      return relationMap[relationType] || '未知'
    },

    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '--'
      const date = new Date(timeStr)
      return date.toLocaleString('zh-CN')
    },

    // 撤销申请
    async cancelBinding(item) {
      try {
        const result = await uni.showModal({
          title: '确认撤销',
          content: '确定要撤销该绑定申请吗？',
          confirmText: '确定',
          cancelText: '取消'
        })

        if (result.confirm) {
          uni.showLoading({ title: '处理中...' })
          // 调用解除绑定接口，使用绑定ID
          await houseBindingsDel(item.id)
          uni.hideLoading()
          uni.showToast({
            title: '撤销成功',
            icon: 'success'
          })
          // 重新加载列表
          this.loadBindings(true)
        }
      } catch (error) {
        uni.hideLoading()
        console.error('撤销申请失败:', error)
        uni.showToast({
          title: error.message || '撤销失败',
          icon: 'none'
        })
      }
    },

    // 解除绑定
    async unbindHouse(item) {
      try {
        const result = await uni.showModal({
          title: '确认解绑',
          content: '确定要解除该房屋绑定吗？',
          confirmText: '确定',
          cancelText: '取消'
        })

        if (result.confirm) {
          uni.showLoading({ title: '处理中...' })
          // 同样使用 houseBindingsDel 接口进行解绑
          await houseBindingsDel(item.id)
          uni.hideLoading()
          uni.showToast({
            title: '解绑成功',
            icon: 'success'
          })
          this.loadBindings(true)
        }
      } catch (error) {
        uni.hideLoading()
        console.error('解除绑定失败:', error)
        uni.showToast({
          title: error.message || '解绑失败',
          icon: 'none'
        })
      }
    },

    // 重新申请
    reapplyBinding(item) {
      // 跳转到绑定页面，并预填信息
      uni.navigateTo({
        url: `/subpackages/user/house-binding/house-binding?reapply=true&data=${JSON.stringify(item)}`
      })
    },

    // 去绑定页面
    goToBinding() {
      uni.navigateTo({
        url: '/subpackages/user/house-binding/house-binding'
      })
    }
  }
}
</script>

<style lang="scss">
.house-bindings-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx; // 为悬浮按钮预留空间

  // 绑定记录列表
  .bindings-list {
    padding: 20rpx;
  }

  .binding-item {
    background: white;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    position: relative;

    .status-badge {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 24rpx;
      font-weight: 500;

      &.status-pending {
        background: #fff3cd;
        color: #856404;
      }

      &.status-approved {
        background: #d4edda;
        color: #155724;
      }

      &.status-rejected {
        background: #f8d7da;
        color: #721c24;
      }
    }

    .address-info {
      margin-bottom: 20rpx;
      padding-right: 120rpx; // 为状态标签预留空间

      .community-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }
    }

    .user-info,
    .audit-info {
      margin-bottom: 20rpx;

      .info-row {
        display: flex;
        margin-bottom: 12rpx;
        font-size: 28rpx;

        .label {
          color: #999;
          width: 140rpx;
          flex-shrink: 0;
        }

        .value {
          color: #333;
          flex: 1;
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 20rpx;
      margin-top: 20rpx;

      button {
        flex: 1;
        height: 70rpx;
        border-radius: 8rpx;
        font-size: 28rpx;
        border: none;

        &.btn-cancel {
          background: #ffc107;
          color: #333;
        }

        &.btn-unbind {
          background: #dc3545;
          color: white;
        }

        &.btn-reapply {
          background: #007bff;
          color: white;
        }
      }
    }
  }

  // 空状态
  .empty-state {
    text-align: center;
    padding: 100rpx 0;

    .empty-icon {
      font-size: 120rpx;
      margin-bottom: 20rpx;
      display: block;
    }

    .empty-text {
      font-size: 32rpx;
      color: #999;
      margin-bottom: 12rpx;
      display: block;
    }

    .empty-desc {
      font-size: 28rpx;
      color: #ccc;
      display: block;
    }
  }

  // 加载状态
  .loading-more {
    text-align: center;
    padding: 40rpx 0;
    color: #999;
    font-size: 28rpx;
  }

  // 底部悬浮按钮
  .fab-container {
    position: fixed;
    bottom: 40rpx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;

    .fab-button {
      background: #3b5598;
      color: white;
      border: none;
      border-radius: 50rpx;
      height: 90rpx;
      padding: 0 40rpx;
      display: flex;
      align-items: center;
      gap: 12rpx;
      box-shadow: 0 4rpx 20rpx rgba(59, 85, 152, 0.3);
      font-size: 28rpx;
      font-weight: 600;

      .fab-icon {
        font-size: 36rpx;
        line-height: 1;
      }

      .fab-text {
        line-height: 1;
      }
    }
  }
}
</style>
