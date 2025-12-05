<template>
  <view class="article-detail-page">
    <view class="loading" v-if="loading">
      <u-loading-icon size="40" color="#3b5598"></u-loading-icon>
      <text class="loading-text">加载中...</text>
    </view>

    <view class="content" v-else-if="article">
      <!-- 文章封面 -->
      <view class="cover-section" v-if="article.coverImage">
        <image :src="article.coverImage" mode="aspectFill" class="cover-image"></image>
      </view>

      <!-- 文章信息 -->
      <view class="article-header">
        <text class="article-title">{{ article.title }}</text>
        <view class="article-meta">
          <view class="author-info">
            <u-icon name="account" size="16" color="#999"></u-icon>
            <text class="author">{{ article.author }}</text>
          </view>
          <view class="publish-time">
            <u-icon name="clock" size="16" color="#999"></u-icon>
            <text>{{ formatDateTime(article.publishTime) }}</text>
          </view>
        </view>
        <view class="article-stats">
          <view class="view-count">
            <u-icon name="eye" size="16" color="#999"></u-icon>
            <text>{{ article.viewCount }} 阅读</text>
          </view>
        </view>
      </view>

      <!-- 文章摘要 -->
      <view class="summary-section" v-if="article.summary">
        <view class="summary-card">
          <text class="summary-text">{{ article.summary }}</text>
        </view>
      </view>

      <!-- 文章内容 -->
      <view class="article-content">
        <rich-text :nodes="formatContent(article.content)" class="rich-content"></rich-text>
      </view>
    </view>

    <view class="error" v-else-if="error">
      <u-icon name="error-circle" size="60" color="#ccc"></u-icon>
      <text class="error-text">{{ error }}</text>
      <button class="retry-btn" @click="loadArticleDetail">重试</button>
    </view>
  </view>
</template>

<script>
import { getArticleDetail } from '../../api/list/home'

export default {
  data() {
    return {
      articleId: null,
      article: null,
      loading: false,
      error: null
    }
  },
  onLoad(options) {
    if (options.id) {
      this.articleId = options.id
      this.loadArticleDetail()
    } else {
      this.error = '文章ID不存在'
    }
  },
  methods: {
    async loadArticleDetail() {
      if (!this.articleId) return

      this.loading = true
      this.error = null

      try {
        const response = await getArticleDetail(this.articleId)
        this.article = response
      } catch (err) {
        console.error('获取文章详情失败:', err)
        this.error = '获取文章详情失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },

    formatDateTime(dateTime) {
      if (!dateTime) return ''

      try {
        const date = new Date(dateTime)
        const now = new Date()
        const diff = now - date

        // 小于1小时
        if (diff < 3600000) {
          const minutes = Math.floor(diff / 60000)
          return minutes <= 0 ? '刚刚' : `${minutes}分钟前`
        }

        // 小于1天
        if (diff < 86400000) {
          const hours = Math.floor(diff / 3600000)
          return `${hours}小时前`
        }

        // 小于7天
        if (diff < 604800000) {
          const days = Math.floor(diff / 86400000)
          return `${days}天前`
        }

        // 超过7天显示具体日期
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      } catch (err) {
        console.error('日期格式化失败:', err)
        return dateTime
      }
    },

    formatContent(content) {
      if (!content) return ''

      // 简单的内容格式化，可以根据需要扩展
      return content
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
    }
  }
}
</script>

<style lang="scss">
.article-detail-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f4f6f9 0%, #ffffff 100%);

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 200rpx 0;

    .loading-text {
      margin-top: 30rpx;
      font-size: 28rpx;
      color: #999;
    }
  }

  .content {
    .cover-section {
      width: 100%;
      height: 400rpx;
      overflow: hidden;

      .cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .article-header {
      padding: 40rpx 35rpx 30rpx;
      background: #ffffff;
      margin-bottom: 20rpx;

      .article-title {
        display: block;
        font-size: 40rpx;
        font-weight: 600;
        color: #333;
        line-height: 1.4;
        margin-bottom: 30rpx;
      }

      .article-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;

        .author-info, .publish-time {
          display: flex;
          align-items: center;
          font-size: 26rpx;
          color: #666;

          text {
            margin-left: 8rpx;
          }
        }
      }

      .article-stats {
        .view-count {
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: #999;

          text {
            margin-left: 8rpx;
          }
        }
      }
    }

    .summary-section {
      margin: 0 35rpx 30rpx;

      .summary-card {
        background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%);
        border-radius: 20rpx;
        padding: 30rpx;
        border-left: 6rpx solid #3b5598;

        .summary-text {
          font-size: 28rpx;
          color: #555;
          line-height: 1.6;
        }
      }
    }

    .article-content {
      background: #ffffff;
      margin: 0 35rpx;
      border-radius: 20rpx;
      padding: 40rpx;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

      .rich-content {
        font-size: 30rpx;
        color: #333;
        line-height: 1.8;

        :deep(strong) {
          font-weight: 600;
          color: #222;
        }

        :deep(em) {
          font-style: italic;
          color: #555;
        }
      }
    }
  }

  .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 200rpx 0;

    .error-text {
      margin: 30rpx 0;
      font-size: 28rpx;
      color: #999;
    }

    .retry-btn {
      background: #3b5598;
      color: #ffffff;
      border: none;
      border-radius: 20rpx;
      padding: 0 40rpx;
      font-size: 28rpx;
    }
  }
}
</style>