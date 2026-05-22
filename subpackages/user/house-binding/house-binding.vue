<template>
  <view class="house-binding-page">
    <view class="content">
      <view class="form-section">
        <!-- 真实姓名 -->
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

        <!-- 手机号 -->
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

        <!-- 性别 -->
        <view class="form-item">
          <text class="label">性别</text>
          <picker
            @change="onGenderChange"
            :value="genderIndex"
            :range="genderList"
            range-key="name"
          >
            <view class="picker-content">
              <text class="picker-text" :class="{ placeholder: genderIndex === null }">
                {{ genderIndex !== null ? genderList[genderIndex].name : '请选择性别' }}
              </text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 年龄 -->
        <view class="form-item">
          <text class="label">年龄</text>
          <input
            v-model="formData.age"
            class="input"
            type="number"
            placeholder="请输入年龄"
            maxlength="3"
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
            :range="currentRelationList"
            range-key="name"
            :disabled="currentRelationList.length === 0"
          >
            <view class="picker-content">
              <text class="picker-text" :class="{ placeholder: !selectedRelation }">
                {{ selectedRelation ? selectedRelation.name : (formData.roomId ? '请选择业主关系' : '请先选择房间') }}
              </text>
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
          <text v-if="!currentRoomHasOwner && formData.roomId" class="hint-text">该房间暂无业主，请先以业主身份绑定</text>
        </view>

        <!-- 车牌号 -->
        <view class="form-item">
          <text class="label">车牌号（选填）</text>
          <view class="plate-list">
            <view class="plate-row" v-for="(plate, index) in plateNumbers" :key="index">
              <input
                v-model="plateNumbers[index]"
                class="input plate-input"
                placeholder="请输入车牌号"
                maxlength="10"
              />
              <view class="plate-remove" @click="removePlate(index)" v-if="plateNumbers.length > 1">
                <text class="remove-text">删除</text>
              </view>
            </view>
          </view>
          <view class="add-plate" @click="addPlate" v-if="plateNumbers.length < 5">
            <text class="add-plate-text">+ 添加车牌</text>
          </view>
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
import { getCommunities, getBuildings, getRooms, submitHouseBinding, addUserPlate, getUserPlates } from '../../../api/list/house-binding.js'

export default {
  data() {
    return {
      formData: {
        realName: '',
        phone: '',
        gender: null,
        age: '',
        communityId: '',
        communityName: '',
        buildingId: '',
        buildingName: '',
        roomId: '',
        roomName: '',
        relationType: '',
        relationName: '',
        remark: ''
      },

      // 性别
      genderList: [
        { id: 1, name: '男' },
        { id: 2, name: '女' }
      ],
      genderIndex: null,

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
      allRelationList: [
        { id: 1, name: '业主' },
        { id: 2, name: '家人' },
        { id: 3, name: '租客' },
        { id: 4, name: '其他' }
      ],
      relationIndex: null,

      // 业主校验
      currentRoomHasOwner: false,

      // 车牌号
      plateNumbers: [''],

      // 加载状态
      isLoading: false
    }
  },

  computed: {
    selectedCommunity() {
      return this.communityList[this.communityIndex] || null
    },
    selectedBuilding() {
      return this.buildingList[this.buildingIndex] || null
    },
    selectedRoom() {
      return this.roomList[this.roomIndex] || null
    },
    currentRelationList() {
      if (!this.formData.roomId) return []
      if (!this.currentRoomHasOwner) {
        return [{ id: 1, name: '业主' }]
      }
      return this.allRelationList
    },
    selectedRelation() {
      return this.currentRelationList[this.relationIndex] || null
    },
    canSubmit() {
      let { realName, phone, gender, age, communityId, buildingId, roomId, relationType } = this.formData
      return realName && phone && gender && age && communityId && buildingId && roomId && relationType
    }
  },

  onLoad() {
    let wyUserInfo = uni.getStorageSync('wyUserInfo')
    this.formData.phone = wyUserInfo.cellphone
    this.initPage()
  },

  methods: {
    async initPage() {
      await this.loadCommunities()
    },

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

    async loadBuildings(communityId) {
      if (!communityId) return
      try {
        const result = await getBuildings(communityId)
        if (result && Array.isArray(result)) {
          this.buildingList = result
        }
      } catch (error) {
        console.error('获取楼栋列表失败:', error)
        uni.showToast({ title: '获取楼栋列表失败', icon: 'none' })
      }
    },

    async loadRooms(communityId, buildingId) {
      if (!communityId || !buildingId) return
      try {
        const result = await getRooms(communityId, buildingId)
        if (result && Array.isArray(result)) {
          this.roomList = result
        }
      } catch (error) {
        console.error('获取房间列表失败:', error)
        uni.showToast({ title: '获取房间列表失败', icon: 'none' })
      }
    },

    onGenderChange(e) {
      this.genderIndex = e.detail.value
      const selected = this.genderList[this.genderIndex]
      if (selected) {
        this.formData.gender = selected.id
      }
    },

    onCommunityChange(e) {
      this.communityIndex = e.detail.value
      const selected = this.communityList[this.communityIndex]
      if (selected) {
        this.formData.communityId = selected.id
        this.formData.communityName = selected.name
        this.formData.buildingId = ''
        this.formData.buildingName = ''
        this.formData.roomId = ''
        this.formData.roomName = ''
        this.buildingList = []
        this.roomList = []
        this.buildingIndex = null
        this.roomIndex = null
        this.resetRelation()
        this.loadBuildings(selected.id)
      }
    },

    onBuildingChange(e) {
      this.buildingIndex = e.detail.value
      const selected = this.buildingList[this.buildingIndex]
      if (selected) {
        this.formData.buildingId = selected.id
        this.formData.buildingName = selected.name
        this.formData.roomId = ''
        this.formData.roomName = ''
        this.roomList = []
        this.roomIndex = null
        this.resetRelation()
        this.loadRooms(this.formData.communityId, selected.id)
      }
    },

    onRoomChange(e) {
      this.roomIndex = e.detail.value
      const selected = this.roomList[this.roomIndex]
      if (selected) {
        this.formData.roomId = selected.id
        this.formData.roomName = selected.roomNumber || selected.name
        // 业主校验
        this.currentRoomHasOwner = !!selected.hasOwner
        this.relationIndex = null
        this.formData.relationType = ''
        this.formData.relationName = ''
      }
    },

    resetRelation() {
      this.relationIndex = null
      this.formData.relationType = ''
      this.formData.relationName = ''
      this.currentRoomHasOwner = false
    },

    onRelationChange(e) {
      this.relationIndex = e.detail.value
      const selected = this.currentRelationList[this.relationIndex]
      if (selected) {
        this.formData.relationType = selected.id
        this.formData.relationName = selected.name
      }
    },

    addPlate() {
      if (this.plateNumbers.length < 5) {
        this.plateNumbers.push('')
      }
    },

    removePlate(index) {
      this.plateNumbers.splice(index, 1)
    },

    async submitBinding() {
      if (!this.canSubmit) {
        uni.showToast({ title: '请完善所有必填信息', icon: 'none' })
        return
      }

      try {
        uni.showLoading({ title: '提交中...' })
        const result = await submitHouseBinding(this.formData)

        // 提交车牌号
        const validPlates = this.plateNumbers.filter(p => p && p.trim())
        if (validPlates.length > 0 && result) {
          for (const plate of validPlates) {
            try {
              await addUserPlate({ plateNumber: plate.trim() })
            } catch (e) {
              console.error('添加车牌失败:', e)
            }
          }
        }

        uni.hideLoading()
        if (result) {
          uni.showToast({ title: '绑定成功', icon: 'success' })
          setTimeout(() => {
            uni.navigateTo({ url: '/subpackages/user/house-binding/house-bindings' })
          }, 1500)
        }
      } catch (error) {
        uni.hideLoading()
        console.error('提交绑定失败:', error)
        uni.showToast({ title: error.message || '提交失败，请重试', icon: 'none' })
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

        .hint-text {
          display: block;
          font-size: 24rpx;
          color: #e6a23c;
          margin-top: 10rpx;
        }

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
          }
        }

        .input {
          height: 80rpx;
          border-bottom: 1rpx solid #e0e0e0;
          padding: 0 20rpx;
          font-size: 28rpx;
        }

        .plate-list {
          .plate-row {
            display: flex;
            align-items: center;
            margin-bottom: 15rpx;

            .plate-input {
              flex: 1;
            }

            .plate-remove {
              margin-left: 20rpx;
              padding: 10rpx 20rpx;

              .remove-text {
                font-size: 24rpx;
                color: #e6a23c;
              }
            }
          }
        }

        .add-plate {
          margin-top: 10rpx;
          padding: 15rpx 0;

          .add-plate-text {
            font-size: 28rpx;
            color: #3b5598;
          }
        }

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
