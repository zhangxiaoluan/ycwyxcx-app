<template>
  <view class="task-publish-page">
    <view class="content">

      <view class="form-section">
        <view class="form-item required">
          <text class="form-label">任务类型</text>
          <picker
              :value="formData.taskType"
              :range="taskTypes"
              range-key="label"
              @change="onTaskTypeChange"
          >
            <view class="picker">
              {{ formData.taskTypeName || "请选择任务类型" }}
            </view>
          </picker>
        </view>

        <view class="form-item required">
          <text class="form-label">任务标题</text>
          <input
              v-model="formData.title"
              class="form-input"
              placeholder="请简要描述您的任务需求"
              maxlength="50"
          />
          <text class="input-count">{{ formData.title.length }}/50</text>
        </view>

        <view class="form-item required">
          <text class="form-label">任务描述</text>
          <textarea
              v-model="formData.content"
              class="form-textarea"
              placeholder="请详细描述您的任务需求，包括具体要求、注意事项等"
              maxlength="500"
          ></textarea>
          <text class="input-count">{{ formData.content.length }}/500</text>
        </view>

        <view class="form-item required">
          <text class="form-label">联系电话</text>
          <input
              v-model="formData.contactPhone"
              class="form-input"
              placeholder="请输入联系电话"
              type="number"
          />
        </view>

        <view class="form-item required">
          <text class="form-label">联系地址</text>
          <input
              v-model="formData.contactAddress"
              class="form-input"
              placeholder="请输入详细地址"
          />
        </view>

        <view class="form-item required">
          <text class="form-label">截止时间</text>
          <picker
              mode="date"
              :value="formData.deadlineTime"
              :start="getMinDate()"
              @change="onDeadlineTimeChange"
          >
            <view class="picker">
              {{ formData.deadlineTime || '请选择截止时间' }}
            </view>
          </picker>
          <text class="error-text" v-if="deadlineError">截止时间不能早于当前时间</text>
        </view>

        <view class="form-item required">
          <text class="form-label">积分奖励</text>
          <input
              v-model="formData.rewardPoints"
              class="form-input"
              placeholder="请输入积分奖励数量"
              type="number"
          />
        </view>

        <view class="form-item">
          <text class="form-label">备注</text>
          <textarea
              v-model="formData.remark"
              class="form-textarea"
              placeholder="请输入备注信息（选填）"
              maxlength="200"
          ></textarea>
          <text class="input-count">{{ formData.remark.length }}/200</text>
        </view>

        <view class="form-item">
          <text class="form-label">任务图片</text>
          <view class="image-upload">
            <view class="image-list">
              <view class="image-item" v-for="(image, index) in formData.taskImages" :key="index">
                <image :src="image" mode="aspectFill" @click="previewImage(index)"></image>
                <button class="delete-image" @click="deleteImage(index)">
                  <u-icon name="close" size="14" color="#fff"></u-icon>
                </button>
              </view>
              <view class="upload-btn" @click="chooseImage" v-if="formData.taskImages.length < 6">
                <u-icon name="camera" size="32" color="#999"></u-icon>
                <text class="upload-text">添加图片</text>
                <text class="upload-tips">最多6张</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="submit-section">
        <button class="submit-btn" @click="submitTask" :disabled="submitting">
          <u-icon name="checkmark" size="16" color="#fff" v-if="!submitting"></u-icon>
          <u-loading-icon mode="circle" color="#fff" size="16" v-else></u-loading-icon>
          <text>{{ submitting ? '提交中...' : '发布任务' }}</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import {uploadFile} from "@/api/list/upload";
import {getTaskTypes, publishTask} from "../../../api/list/tasks";
export default {
  name: 'task-publish',
  data() {
    return {
      formData: {
        taskType: null,
        taskTypeName: null,
        deadlineTime: null,
        rewardPoints: null,
        contactPhone: '',
        content: '',
        title: '',
        contactAddress: '',
        remark: '',
        taskImages: []
      },
      taskTypes: [],
      submitting: false,
      deadlineError: false
    }
  },
  onLoad() {
    this.isGetTaskTypes()
  },
  methods: {

    // 任务类型
    isGetTaskTypes() {
      getTaskTypes().then(res => {
        this.taskTypes = res || []
      })
    },

    // 选择任务
    onTaskTypeChange(e) {
      let index = e.detail.value
      this.formData.taskType = index
      this.formData.taskTypeName = this.taskTypes[index]?.label || e.detail.value
    },

    // 获取最小可选日期（今天）
    getMinDate() {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    onDeadlineTimeChange(e) {
      const selectedDate = e.detail.value
      const minDate = this.getMinDate()

      // 验证选择的日期不能早于今天
      if (selectedDate < minDate) {
        this.deadlineError = true
        this.formData.deadlineTime = '' // 清空无效选择
      } else {
        this.deadlineError = false
        this.formData.deadlineTime = selectedDate
      }
    },

    async chooseImage() {
      try {
        const res = await uni.chooseImage({
          count: 6 - this.formData.taskImages.length,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera']
        })
        let tempFiles = res.tempFiles
        for (const file of tempFiles) {
          try {
            const uploadRes = await uploadFile(file.path, file)
            let url = uploadRes.url
            if (url) {
              this.formData.taskImages.push(url)
            }
          } catch (error) {
            console.error('上传失败:', error)
          }
        }
      } catch (error) {
        console.error('选择图片失败:', error)
      }
    },

    // 删除图片
    deleteImage(index) {
      this.formData.taskImages.splice(index, 1)
    },

    // 查看图片
    previewImage(current) {
      uni.previewImage({
        urls: this.formData.taskImages,
        current: current
      })
    },

    // 验证
    handleVerify(){
      let f = this.formData
      let status = false
      if (!f.taskTypeName){
        uni.showToast({ title: '任务类型不能为空', icon: 'none' })
        return status = true
      }

      if (!f.title){
        uni.showToast({ title: '任务标题不能为空', icon: 'none' })
        return status = true
      }

      if (!f.content){
        uni.showToast({ title: '任务描述不能为空', icon: 'none' })
        return status = true
      }

      if (!f.contactPhone){
        uni.showToast({ title: '联系电话不能为空', icon: 'none' })
        return status = true
      }

      if (!f.contactAddress){
        uni.showToast({ title: '联系地址不能为空', icon: 'none' })
        return status = true
      }

      if (!f.deadlineTime){
        uni.showToast({ title: '截止时间不能为空', icon: 'none' })
        return status = true
      }

      if (!f.rewardPoints){
        uni.showToast({ title: '积分奖励不能为空', icon: 'none' })
        return status = true
      }

      return status
    },

    // 提交
    async submitTask() {
      try {
        if (await this.handleVerify()) return
        const submitData = {
          ...this.formData,
          deadlineTime: this.formData.deadlineTime + ' 00:00:00',
          rewardPoints: parseInt(this.formData.rewardPoints),
          taskImages: this.formData.taskImages.length > 0 ? this.formData.taskImages : undefined
        }
        this.submitting = true

        await publishTask(submitData)

        uni.showToast({ title: '发布成功', icon: 'success' })

        setTimeout(() => { uni.navigateBack() }, 1500)

      }finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.task-publish-page {
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
  width: auto;
}

.input-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  display: block;
  margin-top: 8rpx;
}


.picker {
  padding: 24rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 12rpx;
  background: #fafafa;
  color: #333;
}

.error-text {
  display: block;
  font-size: 24rpx;
  color: #f5222d;
  margin-top: 8rpx;
}

.image-upload {
  .image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }

  .image-item {
    width: 180rpx;
    height: 180rpx;
    border-radius: 12rpx;
    overflow: hidden;
    position: relative;
    border: 1px solid red;

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
    width: 180rpx;
    height: 180rpx;
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

uni-button[disabled]:not([type]), uni-button[disabled][type=default] {
  color: #fff;
  opacity: 0.7;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #3b5598 0%, #39648f 100%);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
  border: none;

  &:disabled {
    color: #fff;
  }


  u-icon, u-loading-icon {
    margin-right: 12rpx;
  }
}
</style>
