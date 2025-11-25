<template>
  <view class="publish-page">
    <!-- 内容区域（可滚动） -->
    <scroll-view
      class="content-scroll"
      scroll-y="true"
      :style="{ height: `calc(100vh - 120px - env(safe-area-inset-bottom))` }">
      <view class="content-container">
        <!-- 标题输入 -->
        <view class="title-section">
          <input
            class="title-input"
            v-model="postForm.title"
            placeholder="填写标题，让你的动态更吸引人（选填）"
            maxlength="50"
          />
          <text class="title-count">{{ postForm.title.length }}/50</text>
        </view>

        <!-- 内容输入 -->
        <view class="content-section">
          <textarea
            class="content-input"
            v-model="postForm.content"
            placeholder="分享你的想法、经历或见闻..."
            maxlength="1000"
            auto-height
            :show-confirm-bar="false"
          />
          <text class="content-count">{{ postForm.content.length }}/1000</text>
        </view>

        <!-- 媒体文件上传 -->
        <view class="media-section">
          <view class="media-grid">
            <!-- 已选择的图片/视频 -->
            <view
              class="media-item"
              v-for="(media, index) in selectedMedia"
              :key="index">
              <view class="media-wrapper">
                <!-- 图片预览 -->
                <image
                  v-if="media.type === 'image'"
                  :src="media.url"
                  mode="aspectFill"
                  class="media-preview"
                  @click="previewMedia(index)"></image>
                <!-- 视频预览 -->
                <view v-else-if="media.type === 'video'" class="video-preview">
                  <image :src="media.thumbnail" mode="aspectFill" class="video-thumbnail"></image>
                  <view class="video-play-icon">
                    <u-icon name="play-circle-fill" size="40" color="rgba(255,255,255,0.8)"></u-icon>
                  </view>
                </view>
                <!-- 删除按钮 -->
                <view class="media-delete" @click="removeMedia(index)">
                  <u-icon name="close" size="16" color="#fff"></u-icon>
                </view>
                <!-- 上传状态 -->
                <view class="media-status" v-if="media.uploading">
                  <u-loading-icon mode="circle" size="20" color="#3b5598"></u-loading-icon>
                </view>
              </view>
            </view>

            <!-- 添加媒体按钮 -->
            <view
              class="media-item add-media"
              v-if="selectedMedia.length < 9"
              @click="showMediaOptions">
              <view class="add-media-icon">
                <u-icon name="camera" size="40" color="#ccc"></u-icon>
              </view>
              <text class="add-media-text">添加图片/视频</text>
            </view>
          </view>
          <text class="media-tip">最多上传9张图片或1个视频</text>
        </view>

        <!-- 话题标签 -->
        <view class="topic-section">
          <text class="section-title">添加话题</text>
          <view class="topic-input-wrapper">
            <input
              class="topic-input"
              v-model="topicInput"
              placeholder="#输入话题标签"
              @confirm="addTopic"
            />
            <view class="add-topic-btn" @click="addTopic">添加</view>
          </view>
          <view class="topic-list" v-if="postForm.topics.length > 0">
            <view
              class="topic-tag"
              v-for="(topic, index) in postForm.topics"
              :key="index">
              <text class="topic-text">#{{ topic }}</text>
              <view class="topic-remove" @click="removeTopic(index)">
                <u-icon name="close" size="12" color="#666"></u-icon>
              </view>
            </view>
          </view>
        </view>

        <!-- 发布设置 -->
        <view class="settings-section">
          <view class="setting-item">
            <text class="setting-label">谁可以看</text>
            <view class="setting-value" @click="showPrivacyOptions">
              <text class="setting-text">{{ getPrivacyText(postForm.privacy) }}</text>
              <u-icon name="arrow-right" size="16" color="#999"></u-icon>
            </view>
          </view>
          <view class="setting-item">
            <text class="setting-label">允许评论</text>
            <switch
              :checked="postForm.allowComment"
              @change="onCommentChange"
              color="#3b5598"
            />
          </view>
        </view>

        <!-- 底部占位，防止内容被悬浮按钮遮挡 -->
        <view class="bottom-placeholder"></view>
      </view>
    </scroll-view>

    <!-- 底部悬浮发布按钮 -->
    <view class="bottom-bar" :style="{ paddingBottom: `calc(20rpx + env(safe-area-inset-bottom))` }">
      <view
        class="publish-btn"
        :class="{ disabled: !canPublish, loading: submitting }"
        @click="submitPost">
        <u-loading-icon v-if="submitting" mode="circle" size="18" color="#fff"></u-loading-icon>
        <text v-else class="publish-text">发布</text>
      </view>
    </view>

    <!-- 媒体选择弹窗 -->
    <u-popup
      v-model="showMediaPicker"
      mode="bottom"
      :round="10"
      :safe-area-inset-bottom="true">
      <view class="media-picker">
        <view class="picker-header">
          <text class="picker-title">选择媒体</text>
          <view class="picker-close" @click="showMediaPicker = false">
            <u-icon name="close" size="20" color="#999"></u-icon>
          </view>
        </view>
        <view class="picker-options">
          <view class="picker-option" @click="chooseImage">
            <u-icon name="photo" size="24" color="#3b5598"></u-icon>
            <text class="option-text">从相册选择</text>
          </view>
          <view class="picker-option" @click="takePhoto">
            <u-icon name="camera" size="24" color="#3b5598"></u-icon>
            <text class="option-text">拍照</text>
          </view>
          <view class="picker-option" @click="chooseVideo" v-if="!hasVideo">
            <u-icon name="play-circle" size="24" color="#3b5598"></u-icon>
            <text class="option-text">选择视频</text>
          </view>
          <view class="picker-option" @click="recordVideo" v-if="!hasVideo">
            <u-icon name="videocam" size="24" color="#3b5598"></u-icon>
            <text class="option-text">录制视频</text>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 隐私设置弹窗 -->
    <u-popup
      v-model="showPrivacyPicker"
      mode="bottom"
      :round="10"
      :safe-area-inset-bottom="true">
      <view class="privacy-picker">
        <view class="picker-header">
          <text class="picker-title">谁可以看</text>
          <view class="picker-close" @click="showPrivacyPicker = false">
            <u-icon name="close" size="20" color="#999"></u-icon>
          </view>
        </view>
        <view class="privacy-options">
          <view
            class="privacy-option"
            v-for="option in privacyOptions"
            :key="option.value"
            @click="selectPrivacy(option.value)">
            <text class="option-text">{{ option.label }}</text>
            <u-icon
              v-if="postForm.privacy === option.value"
              name="checkmark"
              size="20"
              color="#3b5598"></u-icon>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {
  createPost,
  uploadMedia
} from '@/api/list/activity-list.js'

export default {
  data() {
    return {
      postForm: {
        title: '',
        content: '',
        mediaUrls: [],
        mediaTypes: [],
        topics: [],
        privacy: 0, // 0: 公开 1: 仅好友 2: 仅自己
        allowComment: true
      },
      selectedMedia: [],
      topicInput: '',
      showMediaPicker: false,
      showPrivacyPicker: false,
      privacyOptions: [
        { value: 0, label: '公开' },
        { value: 1, label: '仅好友可见' },
        { value: 2, label: '仅自己可见' }
      ],
      submitting: false
    }
  },
  computed: {
    canPublish() {
      return this.postForm.content.trim().length > 0 && !this.submitting
    },
    hasVideo() {
      return this.selectedMedia.some(media => media.type === 'video')
    }
  },
  onLoad() {

  },
  methods: {


    // 是否有内容
     hasContent() {
      return this.postForm.title.trim() ||
             this.postForm.content.trim() ||
             this.selectedMedia.length > 0 ||
             this.postForm.topics.length > 0
    },

    // 显示媒体选择选项
    showMediaOptions() {
      this.showMediaPicker = true
    },

    // 选择图片
    chooseImage() {
      const remainingSlots = 9 - this.selectedMedia.filter(m => m.type === 'image').length
      uni.chooseImage({
        count: remainingSlots,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          this.showMediaPicker = false
          this.processImages(res.tempFilePaths)
        },
        fail: (err) => {
          console.error('选择图片失败:', err)
        }
      })
    },

    // 拍照
    takePhoto() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera'],
        success: (res) => {
          this.showMediaPicker = false
          this.processImages(res.tempFilePaths)
        },
        fail: (err) => {
          console.error('拍照失败:', err)
        }
      })
    },

    // 选择视频
    chooseVideo() {
      uni.chooseVideo({
        sourceType: ['album'],
        maxDuration: 60,
        camera: 'back',
        success: (res) => {
          this.showMediaPicker = false
          this.processVideo(res)
        },
        fail: (err) => {
          console.error('选择视频失败:', err)
        }
      })
    },

    // 录制视频
    recordVideo() {
      uni.chooseVideo({
        sourceType: ['camera'],
        maxDuration: 60,
        camera: 'back',
        success: (res) => {
          this.showMediaPicker = false
          this.processVideo(res)
        },
        fail: (err) => {
          console.error('录制视频失败:', err)
        }
      })
    },

    // 处理图片
    processImages(filePaths) {
      filePaths.forEach((filePath, index) => {
        const mediaItem = {
          type: 'image',
          url: filePath,
          uploading: true,
          localPath: filePath
        }
        this.selectedMedia.push(mediaItem)

        // 上传图片
        this.uploadSingleMedia(mediaItem, 0)
      })
    },

    // 处理视频
    processVideo(videoInfo) {
      const mediaItem = {
        type: 'video',
        url: videoInfo.tempFilePath,
        thumbnail: videoInfo.thumbTempFilePath,
        uploading: true,
        localPath: videoInfo.tempFilePath,
        thumbnailPath: videoInfo.thumbTempFilePath
      }
      this.selectedMedia.push(mediaItem)

      // 先上传缩略图
      this.uploadVideoThumbnail(mediaItem)
    },

    // 上传单个媒体文件
    async uploadSingleMedia(mediaItem, mediaType) {
      try {
        const uploadResult = await uploadMedia(mediaItem.localPath, {
          type: mediaItem.type === 'video' ? 'video' : 'image'
        })

        if (uploadResult && uploadResult.url) {
          mediaItem.url = uploadResult.url
          mediaItem.uploading = false

          // 更新表单数据
          this.postForm.mediaUrls.push(uploadResult.url)
          this.postForm.mediaTypes.push(mediaType)
        } else {
          throw new Error('上传失败：服务器未返回文件URL')
        }
      } catch (error) {
        console.error('媒体上传失败:', error)
        mediaItem.uploading = false

        uni.showToast({
          title: '上传失败，请重试',
          icon: 'none'
        })

        // 移除失败的媒体项
        const index = this.selectedMedia.indexOf(mediaItem)
        if (index > -1) {
          this.selectedMedia.splice(index, 1)
        }
      }
    },

    // 上传视频缩略图
    async uploadVideoThumbnail(mediaItem) {
      try {
        const thumbnailResult = await uploadMedia(mediaItem.thumbnailPath, {
          type: 'image'
        })

        if (thumbnailResult && thumbnailResult.url) {
          mediaItem.thumbnail = thumbnailResult.url

          // 再上传视频文件
          this.uploadSingleMedia(mediaItem, 1)
        } else {
          throw new Error('缩略图上传失败')
        }
      } catch (error) {
        console.error('视频缩略图上传失败:', error)
        uni.showToast({
          title: '视频上传失败',
          icon: 'none'
        })

        // 移除失败的视频项
        const index = this.selectedMedia.indexOf(mediaItem)
        if (index > -1) {
          this.selectedMedia.splice(index, 1)
        }
      }
    },

    // 移除媒体
    removeMedia(index) {
      const media = this.selectedMedia[index]

      // 从表单数据中移除
      const urlIndex = this.postForm.mediaUrls.indexOf(media.url)
      if (urlIndex > -1) {
        this.postForm.mediaUrls.splice(urlIndex, 1)
        this.postForm.mediaTypes.splice(urlIndex, 1)
      }

      // 从选中列表中移除
      this.selectedMedia.splice(index, 1)
    },

    // 预览媒体
    previewMedia(index) {
      const media = this.selectedMedia[index]
      if (media.type === 'image') {
        const images = this.selectedMedia
          .filter(m => m.type === 'image')
          .map(m => m.url)
        const currentIndex = this.selectedMedia
          .slice(0, index)
          .filter(m => m.type === 'image').length

        uni.previewImage({
          urls: images,
          current: currentIndex
        })
      }
    },

    // 添加话题
    addTopic() {
      const topic = this.topicInput.trim().replace(/^#/, '')
      if (topic && !this.postForm.topics.includes(topic)) {
        this.postForm.topics.push(topic)
        this.topicInput = ''
      }
    },

    // 移除话题
    removeTopic(index) {
      this.postForm.topics.splice(index, 1)
    },

    // 显示隐私选项
    showPrivacyOptions() {
      this.showPrivacyPicker = true
    },

    // 选择隐私设置
    selectPrivacy(value) {
      this.postForm.privacy = value
      this.showPrivacyPicker = false
    },

    // 获取隐私文本
    getPrivacyText(value) {
      const option = this.privacyOptions.find(opt => opt.value === value)
      return option ? option.label : '公开'
    },

    // 评论设置变更
    onCommentChange(e) {
      this.postForm.allowComment = e.detail.value
    },

    // 提交动态
    async submitPost() {
      if (!this.canPublish) return

      // 检查是否有正在上传的媒体
      const uploadingMedia = this.selectedMedia.filter(m => m.uploading)
      if (uploadingMedia.length > 0) {
        uni.showToast({
          title: '请等待媒体文件上传完成',
          icon: 'none'
        })
        return
      }

      this.submitting = true

      try {
        const postData = {
          title: this.postForm.title.trim(),
          content: this.postForm.content.trim(),
          mediaUrls: this.postForm.mediaUrls,
          mediaTypes: this.postForm.mediaTypes,
          privacy: this.postForm.privacy,
          allowComment: this.postForm.allowComment
        }

        const result = await createPost(postData)

        uni.showToast({
          title: '发布成功',
          icon: 'success'
        })

        // 延迟返回，让用户看到成功提示
        setTimeout(() => {
          // 返回上一页并刷新
          const pages = getCurrentPages()
          const prevPage = pages[pages.length - 2]
          if (prevPage && prevPage.route && prevPage.route.includes('activity-list')) {
            prevPage.$vm && prevPage.$vm.refreshPosts && prevPage.$vm.refreshPosts()
          }
          uni.navigateBack()
        }, 1500)

      } catch (error) {
        console.error('发布失败:', error)
        uni.showToast({
          title: error.message || '发布失败，请重试',
          icon: 'none'
        })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.content-scroll {
  flex: 1;
}

.content-container {
  padding: 20rpx 30rpx 120rpx;
}

.title-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  position: relative;

  .title-input {
    width: 100%;
    font-size: 32rpx;
    color: #333;
    line-height: 1.5;
  }

  .title-count {
    position: absolute;
    bottom: 30rpx;
    right: 30rpx;
    font-size: 24rpx;
    color: #999;
  }
}

.content-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  position: relative;

  .content-input {
    width: 100%;
    min-height: 200rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
  }

  .content-count {
    position: absolute;
    bottom: 30rpx;
    right: 30rpx;
    font-size: 24rpx;
    color: #999;
  }
}

.media-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .media-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 20rpx;

    .media-item {
      width: 200rpx;
      height: 200rpx;
      border-radius: 12rpx;
      overflow: hidden;
      position: relative;

      &.add-media {
        background-color: #f8f8f8;
        border: 2rpx dashed #ddd;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .add-media-icon {
          margin-bottom: 10rpx;
        }

        .add-media-text {
          font-size: 24rpx;
          color: #999;
          text-align: center;
        }
      }

      .media-wrapper {
        width: 100%;
        height: 100%;
        position: relative;

        .media-preview,
        .video-thumbnail {
          width: 100%;
          height: 100%;
        }

        .video-preview {
          position: relative;

          .video-play-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        .media-delete {
          position: absolute;
          top: 10rpx;
          right: 10rpx;
          width: 40rpx;
          height: 40rpx;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .media-status {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  .media-tip {
    font-size: 24rpx;
    color: #999;
  }
}

.topic-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .section-title {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }

  .topic-input-wrapper {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 20rpx;

    .topic-input {
      flex: 1;
      height: 70rpx;
      background-color: #f8f8f8;
      border-radius: 35rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
    }

    .add-topic-btn {
      padding: 16rpx 30rpx;
      background-color: #3b5598;
      color: white;
      border-radius: 30rpx;
      font-size: 26rpx;
    }
  }

  .topic-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15rpx;

    .topic-tag {
      display: flex;
      align-items: center;
      background-color: #f0f5ff;
      padding: 10rpx 20rpx;
      border-radius: 30rpx;

      .topic-text {
        font-size: 26rpx;
        color: #3b5598;
        margin-right: 10rpx;
      }

      .topic-remove {
        width: 30rpx;
        height: 30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.settings-section {
  background: white;
  border-radius: 16rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;

    .setting-label {
      font-size: 28rpx;
      color: #333;
    }

    .setting-value {
      display: flex;
      align-items: center;
      gap: 10rpx;

      .setting-text {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}

.bottom-placeholder {
  height: 120rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1rpx solid #f0f0f0;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: center;

  .publish-btn {
    width: 600rpx;
    height: 88rpx;
    background: linear-gradient(135deg, #3b5598 0%, #5a7dd8 100%);
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;

    &.disabled {
      background: #ccc;
    }

    &.loading {
      opacity: 0.8;
    }

    .publish-text {
      font-size: 30rpx;
      font-weight: 600;
      color: white;
    }
  }
}

.media-picker,
.privacy-picker {
  background: white;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;

  .picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40rpx;

    .picker-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .picker-close {
      width: 50rpx;
      height: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .picker-options,
  .privacy-options {
    .picker-option,
    .privacy-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100rpx;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .option-text {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}
</style>
