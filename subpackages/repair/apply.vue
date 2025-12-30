<template>
  <view class="repair-apply-page">

    <view class="content">
      <view class="form-section">
        <view class="form-item required">
          <text class="form-label">报修分类</text>
          <view class="category-selector" @click="showCategoryPicker">
            <text class="picker-text" :class="{ placeholder: !formData.categoryName }">
              {{ formData.categoryName || '请选择报修分类' }}
            </text>
            <u-icon name="arrow-right" size="16" color="#999"></u-icon>
          </view>
        </view>

        <view class="form-item required">
          <text class="form-label">报修标题</text>
          <input
            v-model="formData.title"
            class="form-input"
            placeholder="请简要描述报修问题"
            maxlength="50"
          />
          <text class="input-count">{{ formData.title.length }}/50</text>
        </view>

        <view class="form-item required">
          <text class="form-label">详细描述</text>
          <textarea
            v-model="formData.description"
            class="form-textarea"
            placeholder="请详细描述报修问题的情况、故障现象等"
            maxlength="500"
          ></textarea>
          <text class="input-count">{{ formData.description.length }}/500</text>
        </view>

        <view class="form-item required">
          <text class="form-label">报修位置</text>
          <input
            v-model="formData.location"
            class="form-input"
            placeholder="请输入具体的报修位置"
            maxlength="100"
          />
        </view>

        <view class="form-item required">
          <text class="form-label">紧急程度</text>
          <view class="urgency-selector">
            <view
              class="urgency-item"
              :class="{ active: formData.urgentLevel === item.value }"
              v-for="item in urgencyLevels"
              :key="item.value"
              @click="selectUrgency(item)"
            >
              <text class="urgency-label">{{ item.label }}</text>
              <text class="urgency-desc">{{ item.description }}</text>
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">联系电话时间</text>
          <picker
            mode="selector"
            :range="contactTimes"
            :value="contactTimeIndex"
            @change="onContactTimeChange"
          >
            <view class="picker">
              {{ formData.contactTime || '请选择方便联系的时间' }}
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="form-label">现场照片</text>
          <view class="image-upload">
            <view class="image-list">
              <view class="image-item" v-for="(image, index) in formData.imageList" :key="index">
                <image :src="image" mode="aspectFill" @click="previewImage(index)"></image>
                <button class="delete-image" @click="deleteImage(index)">
                  <u-icon name="close" size="14" color="#fff"></u-icon>
                </button>
              </view>
              <view class="upload-btn" @click="chooseImage" v-if="formData.imageList.length < 6">
                <u-icon name="camera" size="32" color="#999"></u-icon>
                <text class="upload-text">添加照片</text>
                <text class="upload-tips">最多6张</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="submit-section">
        <button class="submit-btn" @click="submitRepair">
          <u-icon name="checkmark" size="16" color="#fff" v-if="canSubmit"></u-icon>
          <text>提交报修申请</text>
        </button>
      </view>
    </view>

    <!-- 分类选择弹窗 -->
    <u-popup :show="showCategoryModal" mode="bottom" border-radius="20">
      <view class="category-modal">
        <view class="modal-header">
          <text class="modal-title">选择报修分类</text>
          <view class="close-btn" @click="showCategoryModal = false">
            <u-icon name="close" size="20" color="#999"></u-icon>
          </view>
        </view>
        <view class="category-list">
          <view
            class="category-item"
            :class="{ active: selectedCategory && selectedCategory.id === item.id }"
            v-for="item in categories"
            :key="item.id"
            @click="selectCategory(item)"
          >
<!--            <view class="category-icon" v-if="item.icon">-->
<!--              <u-icon :name="item.icon" size="24" color="#3b5598"></u-icon>-->
<!--            </view>-->
            <view class="category-info">
              <text class="category-name">{{ item.name }}</text>
              <text class="category-desc" v-if="item.description">{{ item.description }}</text>
            </view>
            <u-icon name="checkmark" size="20" color="#3b5598" v-if="selectedCategory && selectedCategory.id === item.id"></u-icon>
          </view>
        </view>
        <view class="modal-footer">
          <button class="confirm-btn" @click="confirmCategory">确定</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getRepairCategories, submitRepairRequest } from '@/api/list/repair'
import { sendUpload } from '@/api/request'

export default {
  name: 'repair-apply',
  data() {
    return {
      formData: {
        categoryId: '',
        categoryName: '',
        title: '',
        description: '',
        location: '',
        urgentLevel: 1,
        urgentLevelDesc: '一般',
        contactTime: '',
        imageList: []
      },
      categories: [],
      showCategoryModal: false,
      selectedCategory: null,
      urgencyLevels: [
        { value: 1, label: '一般', description: '常规维修，可安排在正常工作时间处理' },
        { value: 2, label: '紧急', description: '影响正常使用，需要尽快处理' },
        { value: 3, label: '非常紧急', description: '严重影响生活或存在安全隐患，需立即处理' }
      ],
      contactTimes: [
        '工作日 9:00-12:00',
        '工作日 14:00-18:00',
        '工作日 18:00-21:00',
        '周末 9:00-18:00',
        '随时联系'
      ],
      contactTimeIndex: -1,
      submitting: false
    }
  },
  computed: {
    canSubmit() {
      return this.formData.categoryId &&
             this.formData.title.trim() &&
             this.formData.description.trim() &&
             this.formData.location.trim()
    }
  },
  onLoad() {
    this.loadCategories()
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getRepairCategories()
        console.log(11, res)
        this.categories = res || []
      } catch (error) {
        uni.showToast({
          title: '获取分类失败',
          icon: 'none'
        })
      }
    },

    showCategoryPicker() {
      if (this.categories.length > 0) {
        this.showCategoryModal = true
      } else {
        uni.showToast({
          title: '暂无可用分类',
          icon: 'none'
        })
      }
    },

    selectCategory(category) {
      this.selectedCategory = category
    },

    confirmCategory() {
      if (this.selectedCategory) {
        this.formData.categoryId = this.selectedCategory.id
        this.formData.categoryName = this.selectedCategory.name
        this.showCategoryModal = false
      }
    },
    selectUrgency(item) {
      this.formData.urgentLevel = item.value
      this.formData.urgentLevelDesc = item.label
    },
    onContactTimeChange(e) {
      this.contactTimeIndex = e.detail.value
      this.formData.contactTime = this.contactTimes[e.detail.value]
    },
    async chooseImage() {
      try {
        const res = await uni.chooseImage({
          count: 6 - this.formData.imageList.length,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })

        if (res.tempFilePaths && res.tempFilePaths.length > 0) {
          // 上传图片
          uni.showLoading({ title: '上传中...' })

          for (let filePath of res.tempFilePaths) {
            try {
              const uploadRes = await sendUpload('/app/upload', filePath)
              if (uploadRes && uploadRes.code === 200) {
                this.formData.imageList.push(uploadRes.result)
              }
            } catch (error) {
              console.error('上传失败:', error)
            }
          }

          uni.hideLoading()
        }
      } catch (error) {
        console.error('选择图片失败:', error)
      }
    },
    deleteImage(index) {
      this.formData.imageList.splice(index, 1)
    },
    previewImage(current) {
      uni.previewImage({
        urls: this.formData.imageList,
        current: current
      })
    },
    async submitRepair() {
      if (!this.canSubmit || this.submitting) return

      this.submitting = true

      try {
        const submitData = {
          ...this.formData,
          imageList: this.formData.imageList.length > 0 ? this.formData.imageList : undefined
        }

        await submitRepairRequest(submitData)

        uni.showToast({
          title: '提交成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)

      } catch (error) {
        uni.showToast({
          title: '提交失败',
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
.repair-apply-page {
  min-height: 100vh;
  background: linear-gradient(to right, #e0ecfa 0%, #f4f6f9 50%, #f6f4fc 100%);
}


.content {
  padding: 20rpx;
}

.form-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.form-item {
  margin-bottom: 40rpx;

  &:last-child {
    margin-bottom: 0;
  }

  &.required {
    .form-label::before {
      content: '*';
      color: #f5222d;
      margin-right: 8rpx;
    }
  }
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 16rpx;
}

.form-input, .form-textarea {
  padding: 24rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: #fafafa;

  &::placeholder {
    color: #999;
  }
}

.form-textarea {
  height: 200rpx;
  resize: none;
}

.input-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  display: block;
  margin-top: 8rpx;
}

.picker, .category-selector {
  padding: 24rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 12rpx;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .picker-text {
    font-size: 28rpx;

    &.placeholder {
      color: #999;
    }
  }
}

.category-selector {
  cursor: pointer;
}

.urgency-selector {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.urgency-item {
  padding: 24rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 12rpx;
  background: #fafafa;

  &.active {
    border-color: #3b5598;
    background: #f0f5ff;
  }

  .urgency-label {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    display: block;
    margin-bottom: 8rpx;
  }

  .urgency-desc {
    font-size: 24rpx;
    color: #666;
  }
}

.image-upload {
  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }

  .image-item {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    overflow: hidden;
    position: relative;

    image {
      width: 100%;
      height: 100%;
    }

    .delete-image {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      width: 32rpx;
      height: 32rpx;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
    }
  }

  .upload-btn {
    width: 160rpx;
    height: 160rpx;
    border: 2rpx dashed #ddd;
    border-radius: 12rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fafafa;

    .upload-text {
      font-size: 24rpx;
      color: #666;
      margin-top: 8rpx;
    }

    .upload-tips {
      font-size: 20rpx;
      color: #999;
      margin-top: 4rpx;
    }
  }
}

.submit-section {
  padding: 40rpx 0;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #3b5598 0%, #2c3e50 100%);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  border: none;

  &:disabled {
    opacity: 0.6;
  }

  u-icon {
    margin-right: 12rpx;
  }
}

// 分类弹窗样式
.category-modal {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  max-height: 80vh;

  .modal-header {
    padding: 30rpx;
    border-bottom: 2rpx solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .modal-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .close-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 50%;
      border: none;
    }
  }

  .category-list {
    max-height: 60vh;
    overflow-y: auto;
  }

  .category-item {
    padding: 30rpx;
    display: flex;
    align-items: center;
    border-bottom: 2rpx solid #f8f8f8;

    &.active {
      background: #f0f5ff;
    }

    .category-icon {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f5ff;
      border-radius: 12rpx;
      margin-right: 20rpx;
    }

    .category-info {
      flex: 1;

      .category-name {
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        display: block;
        margin-bottom: 8rpx;
      }

      .category-desc {
        font-size: 24rpx;
        color: #666;
      }
    }
  }

  .modal-footer {
    padding: 30rpx;
    border-top: 2rpx solid #f0f0f0;

    .confirm-btn {
      width: 100%;
      height: 88rpx;
      background: #3b5598;
      border-radius: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 32rpx;
      font-weight: 500;
      border: none;
    }
  }
}
</style>
