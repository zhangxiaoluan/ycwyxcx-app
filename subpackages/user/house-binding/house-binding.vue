<template>
  <view class="house-binding-page">
    <view class="content">
      <view class="form-section">
        <!-- 手机号输入 -->
        <view class="form-item">
          <text class="label">真实姓名</text>
          <input
              v-model="formData.realName"
              class="input"
              type="text"
              placeholder="请输入真实姓名"
              maxlength="20"
          />
        </view>

        <!-- 手机号输入 -->
        <view class="form-item">
          <text class="label">手机号</text>
          <input
            v-model="formData.phone"
            class="input"
            type="number"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </view>

        <!-- 小区选择 -->
        <view class="form-item">
          <text class="label">选择小区</text>
          <picker
            @change="onCommunityChange"
            :value="communityIndex"
            :range="communityList"
            range-key="name"
            :disabled="communityList.length === 0"
          >
            <view class="picker-content">
              <text class="picker-text" :class="{ placeholder: !selectedCommunity }">
                {{ selectedCommunity ? selectedCommunity.name : '请选择小区' }}
              </text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 楼栋选择 -->
        <view class="form-item">
          <text class="label">选择楼栋</text>
          <picker
            @change="onBuildingChange"
            :value="buildingIndex"
            :range="buildingList"
            range-key="name"
            :disabled="buildingList.length === 0"
          >
            <view class="picker-content">
              <text class="picker-text" :class="{ placeholder: !selectedBuilding }">
                {{ selectedBuilding ? selectedBuilding.name : '请选择楼栋' }}
              </text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 房间选择 -->
        <view class="form-item">
          <text class="label">选择房间</text>
          <picker
            @change="onRoomChange"
            :value="roomIndex"
            :range="roomList"
            range-key="roomNumber"
            :disabled="roomList.length === 0"
          >
            <view class="picker-content">
              <text class="picker-text" :class="{ placeholder: !selectedRoom }">
                {{ selectedRoom ? selectedRoom.roomNumber : '请选择房间' }}
              </text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 业主关系 -->
        <view class="form-item">
          <text class="label">业主关系</text>
          <picker
            @change="onRelationChange"
            :value="relationIndex"
            :range="relationList"
            range-key="name"
          >
            <view class="picker-content">
              <text class="picker-text" :class="{ placeholder: !selectedRelation }">
                {{ selectedRelation ? selectedRelation.name : '请选择业主关系' }}
              </text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 备注 -->
        <view class="form-item">
          <text class="label">备注</text>
          <textarea
            v-model="formData.remark"
            class="textarea"
            placeholder="请输入备注信息（选填）"
            maxlength="200"
          />
        </view>

        <!-- 提交按钮 -->
        <button
          class="submit-btn"
          @click="submitBinding"
          :class="{ disabled: !canSubmit }"
          :disabled="!canSubmit"
        >
          提交绑定
        </button>
      </view>
    </view>

    </view>
</template>

<script>
import { getCommunities, getBuildings, getRooms, submitHouseBinding } from '../../../api/list/house-binding.js'

export default {
  data() {
    return {
      // 表单数据 - 包含所有需要提交的字段
      formData: {
        realName: '',     // 真实姓名
        phone: '',        // 手机号
        communityId: '',  // 小区ID
        communityName: '',// 小区名称
        buildingId: '',   // 楼栋ID
        buildingName: '', // 楼栋名称
        roomId: '',       // 房间ID
        roomName: '',     // 房间名称
        relationType: '', // 业主关系ID
        relationName: '', // 业主关系名称
        remark: ''        // 备注
      },

      // 小区相关
      communityList: [],
      communityIndex: null,

      // 楼栋相关
      buildingList: [],
      buildingIndex: null,

      // 房间相关
      roomList: [],
      roomIndex: null,

      // 业主关系
      relationList: [
        { id: 1, name: '业主' },
        { id: 2, name: '家人' },
        { id: 3, name: '租客' },
        { id: 4, name: '其他' }
      ],
      relationIndex: null,

      // 加载状态
      isLoading: false
    }
  },

  computed: {
    // 当前选中的小区
    selectedCommunity() {
      return this.communityList[this.communityIndex] || null
    },

    // 当前选中的楼栋
    selectedBuilding() {
      return this.buildingList[this.buildingIndex] || null
    },

    // 当前选中的房间
    selectedRoom() {
      return this.roomList[this.roomIndex] || null
    },

    // 当前选中的业主关系
    selectedRelation() {
      return this.relationList[this.relationIndex] || null
    },

    // 是否可以提交
    canSubmit() {
      let realName = this.formData.realName
      let phone = this.formData.phone
      let communityId = this.formData.communityId
      let buildingId = this.formData.buildingId
      let roomId = this.formData.roomId
      let relationType = this.formData.relationType
      // remark 保持非必填

      // 调试信息 - 在开发时检查各字段状态
      console.log('表单验证状态:', {
        realName: !!realName,
        phone: !!phone,
        communityId: !!communityId,
        buildingId: !!buildingId,
        roomId: !!roomId,
        relationType: !!relationType,
        canSubmit: !!(realName && phone && communityId && buildingId && roomId && relationType)
      })

      return realName && phone && communityId && buildingId && roomId && relationType
    }
  },

  onLoad() {
    let wyUserInfo =uni.getStorageSync('wyUserInfo')
    this.formData.phone = wyUserInfo.cellphone
    this.initPage()
  },

  methods: {
    // 初始化页面
    async initPage() {
      await this.loadCommunities()
    },

    // 加载小区列表
    async loadCommunities() {
      try {
        const result = await getCommunities()
        if (result && Array.isArray(result)) {
          this.communityList = result
        }
      } catch (error) {
        console.error('获取小区列表失败:', error)
        uni.showToast({ title: '获取小区列表失败', icon: 'none' })
      }
    },

    // 加载楼栋列表
    async loadBuildings(communityId) {
      if (!communityId) return

      try {
        const result = await getBuildings(communityId)
        if (result && Array.isArray(result)) {
          this.buildingList = result
        }
      } catch (error) {
        console.error('获取楼栋列表失败:', error)
        uni.showToast({
          title: '获取楼栋列表失败',
          icon: 'none'
        })
      }
    },

    // 加载房间列表
    async loadRooms(communityId, buildingId) {
      if (!communityId || !buildingId) return

      try {
        const result = await getRooms(communityId, buildingId)
        if (result && Array.isArray(result)) {
          this.roomList = result
        }
      } catch (error) {
        console.error('获取房间列表失败:', error)
        uni.showToast({
          title: '获取房间列表失败',
          icon: 'none'
        })
      }
    },

    // 小区选择变化
    onCommunityChange(e) {
      this.communityIndex = e.detail.value
      const selected = this.communityList[this.communityIndex]

      if (selected) {
        // 更新formData
        this.formData.communityId = selected.id
        this.formData.communityName = selected.name

        // 清空下级选择
        this.formData.buildingId = ''
        this.formData.buildingName = ''
        this.formData.roomId = ''
        this.formData.roomName = ''

        this.buildingList = []
        this.roomList = []
        this.buildingIndex = null
        this.roomIndex = null

        this.loadBuildings(selected.id)
      }
    },

    // 楼栋选择变化
    onBuildingChange(e) {
      this.buildingIndex = e.detail.value
      const selected = this.buildingList[this.buildingIndex]

      if (selected) {
        // 更新formData
        this.formData.buildingId = selected.id
        this.formData.buildingName = selected.name

        // 清空下级选择
        this.formData.roomId = ''
        this.formData.roomName = ''

        this.roomList = []
        this.roomIndex = null

        this.loadRooms(this.formData.communityId, selected.id)
      }
    },

    // 房间选择变化
    onRoomChange(e) {
      this.roomIndex = e.detail.value
      const selected = this.roomList[this.roomIndex]

      if (selected) {
        // 更新formData
        this.formData.roomId = selected.id
        // 使用roomNumber字段保持一致性，如果没有则使用name作为备选
        this.formData.roomName = selected.roomNumber || selected.name
      }
    },

    // 业主关系选择变化
    onRelationChange(e) {
      this.relationIndex = e.detail.value
      const selected = this.relationList[this.relationIndex]

      if (selected) {
        // 更新formData
        this.formData.relationType = selected.id
        this.formData.relationName = selected.name
      }
    },

    // 提交绑定
    async submitBinding() {
      if (!this.canSubmit) {
        uni.showToast({
          title: '请完善所有必填信息',
          icon: 'none'
        })
        return
      }

      try {
        uni.showLoading({ title: '提交中...' })

        // 直接提交formData
        const result = await submitHouseBinding(this.formData)

        uni.hideLoading()

        if (result) {
          uni.showToast({ title: '绑定成功', icon: 'success' })
          setTimeout(() => { uni.navigateTo({ url: '/subpackages/user/house-binding/house-bindings' })
          }, 1500)
        }
      } catch (error) {
        uni.hideLoading()
        console.error('提交绑定失败:', error)
        uni.showToast({
          title: error.message || '提交失败，请重试',
          icon: 'none'
        })
      }
    },

    }
}
</script>

<style lang="scss">
.house-binding-page {
  background: linear-gradient(to right, #e0ecfa 0%, #f4f6f9 50%, #f6f4fc 100%);
  min-height: 100vh;

  .content {
    padding: 35rpx;

    .form-section {
      background: white;
      border-radius: 16rpx;
      padding: 40rpx 30rpx;

      .form-item {
        margin-bottom: 40rpx;

        .label {
          display: block;
          font-size: 28rpx;
          color: #333;
          margin-bottom: 15rpx;
          font-weight: 500;
        }


        // 选择器样式
        .picker-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80rpx;
          border-bottom: 1rpx solid #e0e0e0;
          padding: 0 20rpx;

          .picker-text {
            flex: 1;
            font-size: 28rpx;
            color: #333;

            &.placeholder {
              color: #999;
            }
          }

          .picker-arrow {
            font-size: 20rpx;
            color: #999;
            transition: transform 0.3s;
          }
        }

        // 输入框样式
        .input {
          height: 80rpx;
          border-bottom: 1rpx solid #e0e0e0;
          padding: 0 20rpx;
          font-size: 28rpx;
        }

        // 文本域样式
        .textarea {
          width: 100%;
          min-height: 120rpx;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          padding: 20rpx;
          font-size: 28rpx;
          line-height: 1.5;
          box-sizing: border-box;
        }
      }

      // 提交按钮样式
      .submit-btn {
        width: 100%;
        height: 80rpx;
        background: #3b5598;
        color: white;
        border: none;
        border-radius: 8rpx;
        font-size: 28rpx;
        font-weight: 600;
        margin-top: 20rpx;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 2rpx;


        &.disabled {
          background: rgba(59, 85, 152, 0.8);
        }

        &:not(.disabled):active {
          background: #2d4a7d;
          transform: scale(0.98);
        }
      }
    }
  }
}
</style>
