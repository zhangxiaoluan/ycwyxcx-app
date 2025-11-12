<template>
	<view class="index-container">
		<!-- 轮播图 -->
		<view class="banner-section">
			<swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500"
				indicator-color="rgba(255, 255, 255, 0.5)" indicator-active-color="#fff">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<view class="banner-item" @click="handleBannerClick(item)">
						<image :src="item.image" mode="aspectFill" class="banner-image" />
						<view class="banner-content">
							<text class="banner-title">{{ item.title }}</text>
							<text class="banner-desc">{{ item.desc }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 快速窗口 -->
		<view class="quick-access-section">
			<view class="section-header">
				<text class="section-title">快捷入口</text>
			</view>
			<view class="quick-access-grid">
				<view v-for="(item, index) in quickAccessList" :key="index" class="quick-access-item"
					@click="handleQuickAccess(item)">
					<view class="icon-wrapper">
						<image :src="item.icon" mode="aspectFill" class="iconfont" />
					</view>
					<text class="item-title">{{ item.title }}</text>
				</view>
			</view>
		</view>

		<!-- 惠警政策 -->
		<view class="policy-section">
			<view class="section-header">
				<text class="section-title">惠警政策</text>
				<text class="more-btn" @click="goToPolicyList">更多</text>
			</view>
			<view class="policy-list">
				<view v-for="(item, index) in policyList" :key="index" class="policy-item"
					@click="goToPolicyDetail(item)">
					<view class="policy-tag new">
						封面
					</view>
					<view class="policy-content">
						<text class="policy-title">{{ item.title }}</text>
						<text class="policy-desc">{{ item.summary }}</text>
						<!-- <text class="policy-date"></text> -->
						<view class="policy-hang">
							<view class="policy-date">{{ item.publishDate }}</view>
							<view class="policy-look">
								<u-icon name="eye" size="16" color="#909399"></u-icon>
								<text style="margin-left: 8rpx;">{{ item.readCount }}</text>
							</view>

						</view>
					</view>

				</view>
			</view>
		</view>

		<!-- 文体联盟 -->
		<view class="activities-section">
			<view class="section-header">
				<text class="section-title">文体联盟</text>
				<text class="more-btn" @click="goToActivities">更多</text>
			</view>
			<scroll-view class="activities-scroll" scroll-x="true" show-scrollbar="false">
				<view class="activities-container">
					<view v-for="(item, index) in activityList" :key="index" class="activity-card"
						@click="goToActivityDetail(item)">
						<image :src="item.image" mode="aspectFill" class="activity-image" />
						<view class="activity-info">
							<text class="activity-title">{{ item.title }}</text>
							<text class="activity-date">{{ item.startDate}}</text>
							<view class="activity-participants">
								<text class="participants-count">{{ item.participants }}人参加</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'Index',
		data() {
			return {
				// 轮播图数据
				bannerList: [{
						id: 1,
						title: '爱警暖警在行动',
						desc: '关心关爱每一位警务人员',
						// image: '/static/images/banner1.jpg',
						link: ''
					},
					{
						id: 2,
						title: '惠警政策新发布',
						desc: '多项便民政策正式实施',
						// image: '/static/images/banner2.jpg',
						// link: '/pages/policy/list'
					},
					{
						id: 3,
						title: '文体活动精彩纷呈',
						desc: '丰富警务人员业余生活',
						// image: '/static/images/banner3.jpg',
						// link: '/pages/activities/events'
					}
				],

				// 快速窗口数据
				quickAccessList: [{
						id: 1,
						title: '惠警政策',
						icon: '/static/images/police.jpg',
						url: '/pages/policePolicies/index'
					},
					{
						id: 2,
						title: '惠警福利',
						icon: '/static/images/welfare.jpg'
						// url: '/pages/reunion/apply'
					},
					{
						id: 3,
						title: '家属就业',
						icon: '',
						// url: '/pages/reunion/apply'
					},
					{
						id: 4,
						title: '两地团圆',
						icon: '👨‍👩‍👧‍👦',
						// url: '/pages/reunion/apply'
					},
					{
						id: 5,
						title: '医疗救助',
						icon: '🏥',
						// url: '/pages/medical/apply'
					},
					{
						id: 6,
						title: '意见收集',
						icon: '🏠',
						// url: '/pages/homevisit/needs'
					},
					{
						id: 7,
						title: '心理服务',
						icon: '🧠',
						// url: '/pages/psychology/test'
					},
					{
						id: 8,
						title: '共享商城',
						icon: '🧠',
						// url: '/pages/psychology/test'
					}
				],

				// 惠警政策数据
				policyList: [{
						id: 1,
						title: '关于进一步加强警务人员健康保障的通知',
						summary: '完善医疗救助体系，提高医疗保障水平，为全体警务人员提供更全面的健康保障服务...',
						publishDate: '2024-01-15',
						type: 'hot',
						readCount: 1523
					},
					{
						id: 2,
						title: '警务人员子女教育优惠政策实施细则',
						summary: '为解决警务人员子女教育问题，现推出多项优惠政策，包括入学优先、学费减免等...',
						publishDate: '2024-01-10',
						type: 'new',
						readCount: 856
					},
					{
						id: 3,
						title: '优化警务人员福利待遇的实施意见',
						summary: '进一步提高警务人员福利待遇，改善工作条件，激励警务人员更好地履职尽责...',
						publishDate: '2024-01-05',
						type: 'recommend',
						readCount: 623
					}
				],

				// 文体活动数据
				activityList: [{
						id: 1,
						title: '篮球友谊赛',
						// image: '/static/images/activity1.jpg',
						startDate: '2024-01-20',
						participants: 45,
						status: 'ongoing'
					},
					{
						id: 2,
						title: '书法培训班',
						// image: '/static/images/activity2.jpg',
						startDate: '2024-01-25',
						participants: 28,
						status: 'recruiting'
					},
					{
						id: 3,
						title: '摄影采风活动',
						// image: '/static/images/activity3.jpg',
						startDate: '2024-02-01',
						participants: 36,
						status: 'upcoming'
					}
				]
			}
		},

		onLoad() {
			this.initPage()
		},

		onShow() {
			this.updateMessageCount()
		},

		onPullDownRefresh() {
			this.refreshData()
		},

		methods: {


			initPage() {
				console.log('首页初始化')
				this.fetchHomePageData()
			},

			updateMessageCount() {
				// 更新消息计数
				this.$store.dispatch('fetchMessageStats')
			},

			async fetchHomePageData() {
				try {
					// 这里可以调用实际的API获取首页数据
					// const result = await api.getHomePageData()

					console.log('获取首页数据成功')
				} catch (error) {
					console.error('获取首页数据失败:', error)
					uni.showToast({
						title: '获取数据失败',
						icon: 'none'
					})
				}
			},

			refreshData() {
				// 下拉刷新数据
				setTimeout(() => {
					this.fetchHomePageData()
					uni.stopPullDownRefresh()
					uni.showToast({
						title: '刷新成功',
						icon: 'success'
					})
				}, 1000)
			},

			handleBannerClick(banner) {
				if (banner.link) {
					if (banner.link.startsWith('/pages/')) {
						uni.navigateTo({
							url: banner.link
						})
					} else {
						// 处理外部链接
						console.log('跳转到外部链接:', banner.link)
					}
				} else {
					uni.showToast({
						title: '暂无详情',
						icon: 'none'
					})
				}
			},

			handleQuickAccess(item) {
				if (item.url) {
					uni.navigateTo({
						url: item.url
					})
				} else {
					uni.showToast({
						title: '功能开发中',
						icon: 'none'
					})
				}
			},

			goToPolicyList() {
				uni.navigateTo({
					// url: '/pages/policy/list'
				})
			},

			goToPolicyDetail(policy) {
				uni.navigateTo({
					// url: `/pages/policy/detail?id=${policy.id}`
				})
			},

			goToActivities() {
				uni.navigateTo({
					// url: '/pages/activities/events'
				})
			},

			goToActivityDetail(activity) {
				uni.navigateTo({
					// url: `/pages/activities/detail?id=${activity.id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-container {
		background: #f5f5f5;
		min-height: 100vh;
	}

	/* 轮播图样式 */
	.banner-section {
		position: relative;
		height: 320rpx;
	}

	.banner-swiper {
		width: 100%;
		height: 100%;
	}

	.banner-item {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.banner-image {
		width: 100%;
		height: 100%;
	}

	.banner-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
		color: #fff;
		padding: 30rpx 40rpx;
	}

	.banner-title {
		display: block;
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 10rpx;
	}

	.banner-desc {
		display: block;
		font-size: 24rpx;
		opacity: 0.8;
	}

	/* 通用部分样式 */
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 40rpx 20rpx;
	}

	.section-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
	}

	.more-btn {
		font-size: 28rpx;
		color: #666;
		position: relative;
		padding-right: 30rpx;

		&::after {
			content: '';
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 0;
			height: 0;
			border-left: 8rpx solid #999;
			border-top: 6rpx solid transparent;
			border-bottom: 6rpx solid transparent;
		}
	}

	/* 快速窗口样式 */
	.quick-access-section {
		background: #fff;
		margin-bottom: 20rpx;
	}

	.quick-access-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20rpx;
		padding: 0 40rpx 40rpx;
	}

	.quick-access-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx;
		border-radius: 16rpx;
		background: #f8f9fa;
		transition: all 0.3s;

		&:active {
			background: #e9ecef;
			transform: scale(0.95);
		}
	}

	.icon-wrapper {
		width: 120rpx;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #1e40af, #3b82f6);
		border-radius: 50%;
		margin-bottom: 16rpx;
	}

	.iconfont {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.item-title {
		font-size: 26rpx;
		color: #333;
		text-align: center;
	}

	/* 惠警政策样式 */
	.policy-section {
		background: #fff;
		margin-bottom: 20rpx;
	}

	.policy-list {
		padding: 0 40rpx 40rpx;
	}

	.policy-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 24rpx;
		border: 1rpx solid #f0f0f0;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		background: #fafafa;

		&:last-child {
			margin-bottom: 0;
		}

		&:active {
			background: #f0f0f0;
		}
	}

	.policy-content {
		flex: 1;
		padding-right: 20rpx;
	}

	.policy-title {
		display: block;
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 10rpx;
		line-height: 1.4;
	}

	.policy-desc {
		display: block;
		font-size: 26rpx;
		color: #666;
		margin-bottom: 12rpx;
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.policy-hang {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;

		.policy-date {
			display: block;

		}

		.policy-look {
			display: flex;
		}
	}

	.policy-tag {
		padding: 8rpx 16rpx;
		border-radius: 20rpx;
		font-size: 22rpx;
		font-weight: 500;
		flex-shrink: 0;
		width: 240rpx;
		height: 190rpx;
		margin-right: 15rpx;
		background-color: #059669;

		&.hot {
			background: #fee2e2;
			color: #dc2626;
		}

		&.new {
			background: #dcfce7;
			color: #059669;
		}

		&.recommend {
			background: #fef3c7;
			color: #d97706;
		}
	}

	/* 文体联盟样式 */
	.activities-section {
		background: #fff;
		margin-bottom: 20rpx;
	}

	.activities-scroll {
		white-space: nowrap;
	}

	.activities-container {
		display: flex;
		padding: 0 40rpx 40rpx;
		gap: 20rpx;
	}

	.activity-card {
		flex-shrink: 0;
		width: 280rpx;
		background: #fafafa;
		border-radius: 16rpx;
		overflow: hidden;
		border: 1rpx solid #f0f0f0;

		&:active {
			background: #f0f0f0;
		}
	}

	.activity-image {
		width: 100%;
		height: 180rpx;
	}

	.activity-info {
		padding: 20rpx;
	}

	.activity-title {
		display: block;
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 8rpx;
		line-height: 1.4;
	}

	.activity-date {
		display: block;
		font-size: 24rpx;
		color: #666;
		margin-bottom: 8rpx;
	}

	.participants-count {
		display: inline-block;
		font-size: 22rpx;
		color: #1e40af;
		background: #dbeafe;
		padding: 4rpx 12rpx;
		border-radius: 12rpx;
	}
</style>