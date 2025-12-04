<template>
  <view class="community-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">社区动态</text>
      <text class="page-subtitle">分享社区生活，共建和谐邻里</text>
      <view class="publish-btn" @click="goToPublish">
        <u-icon name="plus" size="16" color="#fff"></u-icon>
        <text class="publish-text">发布</text>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-section">
      <view class="search-box">
        <u-icon name="search" size="20" color="#999"></u-icon>
        <input
          class="search-input"
          placeholder="搜索社区动态"
          v-model="searchKeyword"
          @input="onSearchInput"
        />
      </view>
    </view>

    <!-- 动态列表 -->
    <view class="post-list">
      <view class="post-item" v-for="post in posts" :key="post.id" @click="goToPostDetail(post)">
        <!-- 用户信息 -->
        <view class="user-info">
          <image :src="post.userAvatar || '/static/image/default-avatar.png'" class="user-avatar"></image>
          <view class="user-details">
            <text class="user-name">{{ post.userName }}</text>
            <text class="post-time">{{ formatTime(post.createdAt) }}</text>
          </view>
          <view class="post-status" :class="'post-status-' + post.status">
            {{ getStatusText(post.status) }}
          </view>
        </view>

        <!-- 动态内容 -->
        <view class="post-content">
          <text class="post-title" v-if="post.title">{{ post.title }}</text>
          <text class="post-text">{{ post.content }}</text>
        </view>

        <!-- 媒体内容 -->
        <view class="media-section" v-if="post.mediaList && post.mediaList.length > 0">
          <!-- 图片网格 -->
          <view class="image-grid" v-if="post.mediaList[0].type === 0">
            <view
              class="image-item"
              :class="post.mediaList.length === 1 ? 'grid-single' : (post.mediaList.length === 2 ? 'grid-double' : (post.mediaList.length <= 4 ? 'grid-four' : 'grid-nine'))"
              v-for="(media, index) in post.mediaList.slice(0, 9)"
              :key="media.id"
              @click.stop="previewImage(post.mediaList, index)">
              <image :src="media.thumbnail || media.url" mode="aspectFill" class="media-image"></image>
            </view>
            <view class="more-images" v-if="post.mediaList.length > 9" @click.stop="previewImage(post.mediaList, 9)">
              <text>+{{ post.mediaList.length - 9 }}</text>
            </view>
          </view>
          <!-- 视频 -->
          <view class="video-item" v-else-if="post.mediaList[0].type === 1">
            <image :src="post.mediaList[0].thumbnail" mode="aspectFill" class="video-thumbnail"></image>
            <view class="video-play-btn">
              <u-icon name="play-circle-fill" size="60" color="rgba(255,255,255,0.8)"></u-icon>
            </view>
          </view>
        </view>

        <!-- 互动区域 -->
        <view class="interaction-section">
          <view class="interaction-item" @click.stop="toggleLike(post)">
            <u-icon :name="post.isLiked ? 'heart-fill' : 'heart'" :color="post.isLiked ? '#ff4d4f' : '#999'" size="20"></u-icon>
            <text class="interaction-text" :class="{ liked: post.isLiked }">{{ post.likes || 0 }}</text>
          </view>
          <view class="interaction-item" @click.stop="goToPostDetail(post, 'comment')">
            <u-icon name="eye" size="20" color="#999"></u-icon>
            <text class="interaction-text">{{ post.commentsCount || 0 }}</text>
          </view>
          <view class="interaction-item" @click.stop="sharePost(post)">
            <u-icon name="share" size="20" color="#999"></u-icon>
            <text class="interaction-text">分享</text>
          </view>
          <!-- 操作按钮（仅自己的动态显示） -->
          <view class="post-actions" v-if="post.canEdit || post.canDelete" @click.stop="showActionSheet(post)">
            <u-icon name="more-horizontal" size="20" color="#999"></u-icon>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-if="posts.length === 0 && !loading">
      <u-icon name="message-circle" size="60" color="#ccc"></u-icon>
      <text class="empty-text">暂无动态</text>
      <text class="empty-desc">快来发布第一条动态吧</text>
      <button class="empty-publish-btn" @click="goToPublish">发布动态</button>
    </view>

    <!-- 加载状态 -->
    <view class="loading-section" v-if="loading">
      <u-loading-icon mode="flower" size="40"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="hasMore && !loading">
      <text class="load-more-text" @click="loadMore">加载更多</text>
    </view>

    <!-- 到底了 -->
    <view class="no-more" v-if="!hasMore && posts.length > 0">
      <text class="no-more-text">已经到底了</text>
    </view>
  </view>
</template>

<script>
import {
  getPostList,
  getPostDetail,
  likePost,
  unlikePost,
  createPost,
  getMyPosts,
  deletePost,
  getLikedPosts,
  uploadMedia
} from '@/api/list/activity-list.js'

export default {
  data() {
    return {
      searchKeyword: '',
      loading: false,
      posts: [],
      page: 1,
      size: 10,
      hasMore: true,
      searchTimer: null
    }
  },
  onLoad() {
    this.loadPosts()
  },
  onPullDownRefresh() {
    this.refreshPosts()
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadMore()
    }
  },
  methods: {
    // 加载动态列表
    async loadPosts(reset = false) {
      if (this.loading) return

      if (reset) {
        this.page = 1
        this.hasMore = true
      }

      this.loading = true

      try {
        const params = {
          page: this.page,
          size: this.size,
          keyword: this.searchKeyword
        }

        const response = await getPostList(params)
        let records = response.records || []
        console.log(response)
        const newPosts = records
        if (reset) {
          this.posts = newPosts
        } else {
          this.posts = [...this.posts, ...newPosts]
        }

        this.hasMore = newPosts.length >= this.size
        this.page++
      } catch (error) {
        console.error('加载动态列表失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
        if (reset) {
          uni.stopPullDownRefresh()
        }
      }
    },

    // 刷新列表
    refreshPosts() {
      this.loadPosts(true)
    },

    // 加载更多
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.loadPosts(false)
      }
    },

    // 搜索输入
    onSearchInput() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }

      this.searchTimer = setTimeout(() => {
        this.refreshPosts()
      }, 500)
    },

    // 切换点赞状态
    async toggleLike(post) {
      try {
        if (post.isLiked) {
          await unlikePost(post.id)
          post.likes = Math.max(0, (post.likes || 0) - 1)
        } else {
          await likePost(post.id)
          post.likes = (post.likes || 0) + 1
        }
        post.isLiked = !post.isLiked
      } catch (error) {
        console.error('操作失败:', error)
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },

    // 预览图片
    previewImage(mediaList, index) {
      const images = mediaList
        .filter(media => media.type === 0)
        .map(media => media.url)

      if (images.length > 0) {
        uni.previewImage({
          urls: images,
          current: index
        })
      }
    },

    // 分享动态
    sharePost(post) {
      uni.showActionSheet({
        itemList: ['分享给好友', '生成海报'],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 分享给好友
            this.shareToFriend(post)
          } else if (res.tapIndex === 1) {
            // 生成海报
            this.generatePoster(post)
          }
        }
      })
    },

    // 分享给好友
    shareToFriend(post) {
      // TODO: 实现分享功能
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      })
    },

    // 生成海报
    generatePoster(post) {
      // TODO: 实现海报生成功能
      uni.showToast({
        title: '海报生成功能开发中',
        icon: 'none'
      })
    },

    // 显示操作菜单
    showActionSheet(post) {
      const itemList = []
      if (post.canEdit) {
        itemList.push('编辑')
      }
      if (post.canDelete) {
        itemList.push('删除')
      }

      if (itemList.length === 0) return

      uni.showActionSheet({
        itemList,
        success: async (res) => {
          const action = itemList[res.tapIndex]

          if (action === '编辑') {
            // TODO: 跳转到编辑页面
            uni.showToast({
              title: '编辑功能开发中',
              icon: 'none'
            })
          } else if (action === '删除') {
            this.deletePost(post)
          }
        }
      })
    },

    // 删除动态
    deletePost(post) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条动态吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await deletePost(post.id)
              const index = this.posts.findIndex(p => p.id === post.id)
              if (index > -1) {
                this.posts.splice(index, 1)
              }
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
            } catch (error) {
              console.error('删除失败:', error)
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },

    // 跳转到发布页面
    goToPublish() {
      uni.navigateTo({
        url: '/subpackages/community/activity-list/apublish'
      })
    },

    // 跳转到详情页
    goToPostDetail(post, action = '') {
      let url = `/subpackages/community/post-detail?id=${post.id}`
      if (action) {
        url += `&action=${action}`
      }
      uni.navigateTo({
        url
      })
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: '正常',
        1: '待审核',
        2: '已拒绝',
        3: '已删除'
      }
      return statusMap[status] || '未知'
    },

    // 获取状态样式类
    getStatusClass(status) {
      const classMap = {
        0: 'status-normal',
        1: 'status-pending',
        2: 'status-rejected',
        3: 'status-deleted'
      }
      return classMap[status] || ''
    },

    // 获取图片网格样式类
    getImageGridClass(count) {
      if (count === 1) return 'grid-single'
      if (count === 2) return 'grid-double'
      if (count <= 4) return 'grid-four'
      return 'grid-nine'
    },

    // 格式化时间
    formatTime(time) {
      const now = new Date()
      const postTime = new Date(time)
      const diff = now - postTime

      const minute = 60 * 1000
      const hour = 60 * minute
      const day = 24 * hour

      if (diff < minute) {
        return '刚刚'
      } else if (diff < hour) {
        return `${Math.floor(diff / minute)}分钟前`
      } else if (diff < day) {
        return `${Math.floor(diff / hour)}小时前`
      } else if (diff < 7 * day) {
        return `${Math.floor(diff / day)}天前`
      } else {
        return postTime.toLocaleDateString()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.community-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background: linear-gradient(135deg, #3b5598 0%, #5a7dd8 100%);
  padding: 40rpx 30rpx 30rpx;
  color: white;
  position: relative;

  .page-title {
    font-size: 36rpx;
    font-weight: 600;
    display: block;
    margin-bottom: 10rpx;
  }

  .page-subtitle {
    font-size: 24rpx;
    opacity: 0.9;
    display: block;
  }

  .publish-btn {
    position: absolute;
    right: 30rpx;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 30rpx;
    padding: 12rpx 20rpx;

    .publish-text {
      font-size: 24rpx;
      margin-left: 8rpx;
    }
  }
}

.search-section {
  background: white;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;

  .search-box {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 30rpx;
    padding: 16rpx 24rpx;

    .search-input {
      flex: 1;
      font-size: 28rpx;
      margin-left: 16rpx;
    }
  }
}

.post-list {
  padding: 0 30rpx;

  .post-item {
    background: white;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  }

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .user-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .user-details {
      flex: 1;

      .user-name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
        display: block;
      }

      .post-time {
        font-size: 24rpx;
        color: #999;
        display: block;
        margin-top: 4rpx;
      }
    }

    .post-status {
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      color: white;

      &.post-status-0 {
        background-color: #07c160;
      }

      &.post-status-1 {
        background-color: #ff9500;
      }

      &.post-status-2 {
        background-color: #ff4d4f;
      }

      &.post-status-3 {
        background-color: #999;
      }
    }
  }

  .post-content {
    margin-bottom: 20rpx;

    .post-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 12rpx;
    }

    .post-text {
      font-size: 28rpx;
      color: #333;
      line-height: 1.6;
      display: block;
    }
  }

  .media-section {
    margin-bottom: 20rpx;

    .image-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8rpx;

      .image-item {
        border-radius: 12rpx;
        overflow: hidden;

        &.grid-single {
          width: 100%;
          height: 400rpx;
        }

        &.grid-double {
          width: calc(50% - 4rpx);
          height: 200rpx;
        }

        &.grid-four {
          width: calc(50% - 4rpx);
          height: 200rpx;
        }

        &.grid-nine {
          width: calc(33.33% - 6rpx);
          height: 180rpx;
        }

        .media-image {
          width: 100%;
          height: 100%;
        }
      }

      .more-images {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f0f0;
        border-radius: 12rpx;
        width: calc(33.33% - 6rpx);
        height: 180rpx;
        font-size: 24rpx;
        color: #666;
      }
    }

    .video-item {
      position: relative;
      border-radius: 12rpx;
      overflow: hidden;
      height: 400rpx;

      .video-thumbnail {
        width: 100%;
        height: 100%;
      }

      .video-play-btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .interaction-section {
    display: flex;
    align-items: center;
    border-top: 1rpx solid #f0f0f0;
    padding-top: 20rpx;

    .interaction-item {
      display: flex;
      align-items: center;
      margin-right: 40rpx;

      .interaction-text {
        font-size: 26rpx;
        color: #999;
        margin-left: 8rpx;

        &.liked {
          color: #ff4d4f;
        }
      }
    }

    .post-actions {
      margin-left: auto;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 30rpx;

  .empty-text {
    font-size: 28rpx;
    color: #666;
    margin: 20rpx 0 10rpx;
  }

  .empty-desc {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 30rpx;
  }

  .empty-publish-btn {
    background-color: #3b5598;
    color: white;
    border: none;
    border-radius: 30rpx;
    padding: 16rpx 40rpx;
    font-size: 28rpx;
  }
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 30rpx;

  .loading-text {
    font-size: 26rpx;
    color: #666;
    margin-top: 20rpx;
  }
}

.load-more {
  text-align: center;
  padding: 30rpx;

  .load-more-text {
    font-size: 26rpx;
    color: #3b5598;
    padding: 16rpx 40rpx;
    background-color: #f0f5ff;
    border-radius: 30rpx;
    display: inline-block;
  }
}

.no-more {
  text-align: center;
  padding: 30rpx;

  .no-more-text {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
