<template>
  <view class="page-container">
    <view class="repair-rate-page" v-if="!loading && !error">
      <view class="header">
        <text class="title">服务评价</text>
      </view>

      <view class="content">
        <!-- 评价卡片 -->
        <view class="rate-card" v-if="repairInfo">
          <view class="card-header">
            <view class="service-info">
              <text class="service-title">{{ repairInfo.title }}</text>
              <text class="service-category">{{ repairInfo.categoryName }}</text>
            </view>
            <view class="service-status">
              <view class="status-badge completed">
                <u-icon name="checkmark" size="16" color="#52c41a"></u-icon>
                <text>已完成</text>
              </view>
            </view>
          </view>

          <view class="handler-info" v-if="repairInfo.handlerName">
            <u-icon name="user" size="20" color="#3b5598"></u-icon>
            <text>服务人员：{{ repairInfo.handlerName }}</text>
          </view>

          <view class="complete-time" v-if="repairInfo.completeTime">
            <u-icon name="clock" size="20" color="#666"></u-icon>
            <text>完成时间：{{ formatDateTime(repairInfo.completeTime) }}</text>
          </view>
        </view>

        <!-- 评分区域 -->
        <view class="rating-section">
          <view class="section-title">
            <u-icon name="star" size="24" color="#3b5598"></u-icon>
            <text>服务评分</text>
          </view>

          <view class="rating-container">
            <text class="rating-label">请对本次服务进行评分</text>
            <view class="rating-stars">
              <view
                class="star-item"
                v-for="i in 5"
                :key="i"
                @click="selectRating(i)"
              >
                <u-icon
                  :name="i <= rating ? 'star-fill' : 'star'"
                  size="64"
                  :color="i <= rating ? '#ffc107' : '#ddd'"
                ></u-icon>
              </view>
            </view>
            <text class="rating-text">{{ getRatingText(rating) }}</text>
          </view>

          <!-- 评分维度 -->
          <view class="rating-dimensions" v-if="rating > 0">
            <view class="dimension-item">
              <text class="dimension-label">服务态度</text>
              <view class="dimension-stars">
                <view
                  class="mini-star"
                  v-for="i in 5"
                  :key="i"
                  @click="ratings.attitude = i"
                >
                  <u-icon
                    :name="i <= ratings.attitude ? 'star-fill' : 'star'"
                    size="32"
                    :color="i <= ratings.attitude ? '#ffc107' : '#ddd'"
                  ></u-icon>
                </view>
              </view>
            </view>

            <view class="dimension-item">
              <text class="dimension-label">专业水平</text>
              <view class="dimension-stars">
                <view
                  class="mini-star"
                  v-for="i in 5"
                  :key="i"
                  @click="ratings.professional = i"
                >
                  <u-icon
                    :name="i <= ratings.professional ? 'star-fill' : 'star'"
                    size="32"
                    :color="i <= ratings.professional ? '#ffc107' : '#ddd'"
                  ></u-icon>
                </view>
              </view>
            </view>

            <view class="dimension-item">
              <text class="dimension-label">响应速度</text>
              <view class="dimension-stars">
                <view
                  class="mini-star"
                  v-for="i in 5"
                  :key="i"
                  @click="ratings.response = i"
                >
                  <u-icon
                    :name="i <= ratings.response ? 'star-fill' : 'star'"
                    size="32"
                    :color="i <= ratings.response ? '#ffc107' : '#ddd'"
                  ></u-icon>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 评价内容 -->
        <view class="feedback-section">
          <view class="section-title">
            <u-icon name="edit" size="24" color="#3b5598"></u-icon>
            <text>评价内容</text>
          </view>

          <textarea
            v-model="feedback"
            class="feedback-textarea"
            placeholder="请分享您的服务体验，您的评价对我们很重要..."
            maxlength="500"
          ></textarea>
          <text class="char-count">{{ feedback.length }}/500</text>

          <!-- 快速标签 -->
          <view class="quick-tags">
            <text class="tags-title">快速评价</text>
            <view class="tag-list">
              <view
                class="tag-item"
                v-for="tag in quickTags"
                :key="tag"
                :class="{ active: selectedTags.includes(tag) }"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </view>
            </view>
          </view>
        </view>

        <!-- 提交按钮 -->
        <view class="submit-section">
          <button
            class="submit-btn"
            @click="submitRating"
            :disabled="!canSubmit || submitting"
          >
            <u-icon name="checkmark" size="18" color="#fff" v-if="!submitting"></u-icon>
            <u-loading-icon mode="circle" color="#fff" size="18" v-else></u-loading-icon>
            <text>{{ submitting ? '提交中...' : '提交评价' }}</text>
          </button>
        </view>
      </view>
    </view>

    <view class="loading-state" v-else-if="loading">
      <u-loading-icon mode="circle" color="#3b5598" size="40"></u-loading-icon>
      <text>加载中...</text>
    </view>

    <view class="error-state" v-else>
      <u-icon name="alert-circle" size="64" color="#ddd"></u-icon>
      <text class="error-text">加载失败</text>
      <button class="retry-btn" @click="loadRepairInfo">重试</button>
    </view>
  </view>
</template>

<script>
import { getRepairList, submitRepairRate } from '@/api/list/repair'

export default {
  name: 'repair-rate',
  data() {
    return {
      repairId: '',
      repairInfo: null,
      rating: 0,
      ratings: {
        attitude: 0,
        professional: 0,
        response: 0
      },
      feedback: '',
      selectedTags: [],
      quickTags: [
        '服务态度很好',
        '专业水平高',
        '响应及时',
        '解决问题快',
        '认真负责',
        '耐心解答',
        '技术过硬',
        '服务规范'
      ],
      loading: false,
      error: false,
      submitting: false
    }
  },
  computed: {
    canSubmit() {
      return this.rating > 0 && this.feedback.trim().length > 0
    }
  },
  onLoad(options) {
    if (options.id) {
      this.repairId = options.id
      this.loadRepairInfo()
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      })
      uni.navigateBack()
    }
  },
  methods: {
    async loadRepairInfo() {
      if (this.loading) return

      this.loading = true
      try {
        const res = await getRepairList({
          page: 1,
          size: 100
        })

        const repair = res.records.find(item => item.id == this.repairId)
        if (repair) {
          if (!repair.canRate || repair.status !== 4) {
            uni.showModal({
              title: '提示',
              content: '该报修单无法评价',
              showCancel: false,
              success: () => {
                uni.navigateBack()
              }
            })
            return
          }
          this.repairInfo = repair
        } else {
          throw new Error('报修记录不存在')
        }

      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    selectRating(value) {
      this.rating = value
      // 选择总体评分时，自动设置各维度评分
      if (value > 0) {
        this.ratings.attitude = value
        this.ratings.professional = value
        this.ratings.response = value
      }
    },
    getRatingText(rating) {
      const texts = {
        1: '非常不满意',
        2: '不满意',
        3: '一般',
        4: '满意',
        5: '非常满意'
      }
      return texts[rating] || '请评分'
    },
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index > -1) {
        this.selectedTags.splice(index, 1)
      } else {
        if (this.selectedTags.length < 3) {
          this.selectedTags.push(tag)
        } else {
          uni.showToast({
            title: '最多选择3个标签',
            icon: 'none'
          })
        }
      }
    },
    formatDateTime(time) {
      if (!time) return ''
      const date = new Date(time)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    async submitRating() {
      if (!this.canSubmit || this.submitting) return

      // 验证必填项
      if (this.rating === 0) {
        uni.showToast({
          title: '请选择评分',
          icon: 'none'
        })
        return
      }

      if (!this.feedback.trim()) {
        uni.showToast({
          title: '请填写评价内容',
          icon: 'none'
        })
        return
      }

      this.submitting = true

      try {
        // 构建评价内容
        let finalFeedback = this.feedback.trim()
        if (this.selectedTags.length > 0) {
          finalFeedback += `\n\n标签：${this.selectedTags.join(', ')}`
        }

        const submitData = {
          rating: this.rating,
          feedback: finalFeedback
        }

        await submitRepairRate(this.repairId, submitData)

        uni.showToast({
          title: '评价成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)

      } catch (error) {
        uni.showToast({
          title: '评价失败',
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
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.repair-rate-page {
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #3b5598 0%, #2c3e50 100%);
  padding: 20rpx 30rpx 40rpx;

  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #fff;
  }
}

.content {
  padding: 20rpx;
}

.rate-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(59, 85, 152, 0.1);

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .service-info {
      flex: 1;

      .service-title {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
        display: block;
        margin-bottom: 8rpx;
      }

      .service-category {
        font-size: 24rpx;
        color: #666;
      }
    }

    .service-status {
      .status-badge {
        display: flex;
        align-items: center;
        gap: 8rpx;
        padding: 8rpx 16rpx;
        border-radius: 8rpx;
        font-size: 22rpx;

        &.completed {
          background: #f6ffed;
          color: #52c41a;
        }
      }
    }
  }

  .handler-info, .complete-time {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 12rpx;

    &:last-child {
      margin-bottom: 0;
    }

    text {
      font-size: 26rpx;
      color: #666;
    }
  }
}

.rating-section, .feedback-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 30rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #f0f0f0;

  text {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
  }
}

.rating-container {
  text-align: center;

  .rating-label {
    font-size: 28rpx;
    color: #666;
    display: block;
    margin-bottom: 30rpx;
  }

  .rating-stars {
    display: flex;
    justify-content: center;
    gap: 20rpx;
    margin-bottom: 20rpx;

    .star-item {
      cursor: pointer;
      transition: transform 0.2s;

      &:active {
        transform: scale(0.9);
      }
    }
  }

  .rating-text {
    font-size: 26rpx;
    color: #666;
  }
}

.rating-dimensions {
  margin-top: 40rpx;
  padding-top: 30rpx;
  border-top: 2rpx solid #f0f0f0;

  .dimension-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .dimension-label {
      font-size: 26rpx;
      color: #333;
      min-width: 120rpx;
    }

    .dimension-stars {
      display: flex;
      gap: 12rpx;

      .mini-star {
        cursor: pointer;
        transition: transform 0.2s;

        &:active {
          transform: scale(0.9);
        }
      }
    }
  }
}

.feedback-section {
  .feedback-textarea {
    width: 100%;
    min-height: 200rpx;
    padding: 24rpx;
    border: 2rpx solid #e8e8e8;
    border-radius: 12rpx;
    font-size: 28rpx;
    background: #fafafa;
    margin-bottom: 12rpx;

    &::placeholder {
      color: #999;
    }
  }

  .char-count {
    font-size: 24rpx;
    color: #999;
    text-align: right;
    display: block;
    margin-bottom: 30rpx;
  }

  .quick-tags {
    .tags-title {
      font-size: 26rpx;
      color: #333;
      font-weight: 500;
      display: block;
      margin-bottom: 20rpx;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;

      .tag-item {
        padding: 16rpx 24rpx;
        background: #f8f9fa;
        border: 2rpx solid #e9ecef;
        border-radius: 24rpx;
        font-size: 24rpx;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;

        &.active {
          background: #f0f5ff;
          border-color: #3b5598;
          color: #3b5598;
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}

.submit-section {
  margin-top: 40rpx;

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

    u-icon, u-loading-icon {
      margin-right: 12rpx;
    }
  }
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40rpx;

  text {
    font-size: 28rpx;
    color: #999;
    margin-top: 20rpx;
  }

  .error-text {
    color: #666;
    margin-bottom: 40rpx;
  }

  .retry-btn {
    height: 80rpx;
    background: #3b5598;
    color: #fff;
    border-radius: 40rpx;
    padding: 0 60rpx;
    font-size: 28rpx;
    border: none;
  }
}
</style>