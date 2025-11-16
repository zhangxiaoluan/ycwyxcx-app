<template>
	<view class="user-center" :style="{ paddingTop: statusBarHeight + navBarHeight + 'px' }">

		<!-- 用户信息头部 -->
		<view class="user-header">
			<view class="user-info" @click="goToProfile">
				<view class="avatar-wrapper">
					<image :src="userInfo.avatarUrl || '/static/logo.png'" class="avatar" mode="scaleToFill"></image>
				</view>
				<view class="user-details">
					<text class="username">{{ userInfo.nickName || '点击设置昵称' }}</text>
					<text class="user-id">手机号: {{ userInfo.cellphone || '100001' }}</text>
				</view>
			</view>

			<!-- 统计信息 -->
			<view class="stats-info">
				<view class="stat-item" @click="goToPoints">
					<view class="stat-icon points">
						<u-icon name="star" size="30" color="#ffc107"></u-icon>
					</view>
					<text class="stat-value">{{ userInfo.points || 0 }}</text>
					<text class="stat-label">积分</text>
				</view>

				<view class="stat-item" @click="goToWallet">
					<view class="stat-icon wallet">
						<u-icon name="red-packet" size="30" color="#ec6a5d"></u-icon>
					</view>
					<text class="stat-value">¥{{ userInfo.balance || '0.00' }}</text>
					<text class="stat-label">余额</text>
				</view>

				<view class="stat-item" @click="goToOrders">
					<view class="stat-icon tasks">
						<u-icon name="list" size="30" color="#3b5598"></u-icon>
					</view>
					<text class="stat-value">{{ userInfo.orderCount || 0 }}</text>
					<text class="stat-label">任务</text>
				</view>
			</view>
		</view>

		<!-- 我的服务网格 -->
		<view class="services-section">
			<view class="section-title">我的服务</view>
			<view class="services-grid">
				<!-- 房屋信息绑定 -->
				<view class="service-card" @click="goToHouseBinding">
					<view class="service-icon house-binding">
						<u-icon name="home" size="28" color="#07c160"></u-icon>
					</view>
					<text class="service-title">房屋信息</text>
				</view>

				<!-- 家庭成员管理 -->
				<view class="service-card" @click="goToFamilyMembers">
					<view class="service-icon family">
						<u-icon name="man-add" size="28" color="#3b5598"></u-icon>
					</view>
					<text class="service-title">家庭成员</text>
				</view>

				<!-- 电子钱包 -->
				<view class="service-card" @click="goToWallet">
					<view class="service-icon wallet">
						<u-icon name="red-packet" size="28" color="#ec6a5d"></u-icon>
					</view>
					<text class="service-title">电子钱包</text>
				</view>

				<!-- 积分管理 -->
				<view class="service-card" @click="goToPoints">
					<view class="service-icon points">
						<u-icon name="star" size="28" color="#ffc107"></u-icon>
					</view>
					<text class="service-title">积分管理</text>
				</view>
			</view>
		</view>

		<!-- 常用功能 -->
		<view class="quick-actions">
			<view class="section-title">常用功能</view>
			<view class="action-list">

				<view class="action-item" @click="goToIdentityVerification">
					<view class="action-icon">
						<u-icon name="account-fill" size="20" color="#3b5598"></u-icon>
					</view>
					<text class="action-text">实名认证</text>
					<view class="action-status" :class="{ 'signed': userInfo.isVerified }">
						{{ userInfo.isVerified ? '已认证' : '未认证' }}
					</view>
					<u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
				</view>

				<view class="action-item">
					<view class="action-icon">
						<u-icon name="calendar" size="20" color="#3b5598"></u-icon>
					</view>
					<text class="action-text">每日签到</text>
					<view class="action-status" :class="{ 'signed': hasSignedToday }">
						{{ hasSignedToday ? '已签到' : '未签到' }}
					</view>
				</view>


				<view class="action-item" @click="goToSettings">
					<view class="action-icon">
						<u-icon name="setting" size="20" color="#3b5598"></u-icon>
					</view>
					<text class="action-text">设置</text>
					<u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 0,
        userInfo: uni.getStorageSync('wyUserInfo') || {
          avatar: null,
          nickname: null,
          userId: null,
          // isVerified: false,
          // houseVerified: false,
          // familyCount: 0,
          // points: 1250,
          // balance: '88.50',
          // orderCount: 12
        },
				hasSignedToday: false
			}
		},
		onLoad() {
			this.getStatusBarHeight()
      console.log('userInfo', this.userInfo)
		},
		onShow() {},
		methods: {
			getStatusBarHeight() {
				// 获取系统信息（包含状态栏高度）
				const systemInfo = uni.getSystemInfoSync();
				this.statusBarHeight = systemInfo.statusBarHeight; // 状态栏高度（像素）
				// 获取导航栏高度（仅微信小程序需要，其他平台可能不需要）

				// #ifdef MP-WEIXIN
				if (uni.getMenuButtonBoundingClientRect) {
					if (uni.getMenuButtonBoundingClientRect) {
						const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
						// 导航栏高度 = 菜单按钮底部距离 - 状态栏高度
						this.navBarHeight = menuButtonInfo.bottom - systemInfo.statusBarHeight;
					}
				}
				// #endif
			},

			// 个人资料
			goToProfile() {
				uni.navigateTo({
					url: '/subpackages/user/profile/profile'
				})
			},

			// 房屋信息绑定
			goToHouseBinding() {
				uni.navigateTo({
					url: '/subpackages/user/house-binding/house-binding'
				})
			},

			// 家庭成员管理
			goToFamilyMembers() {
				uni.navigateTo({
					url: '/subpackages/user/family-members/family-members'
				})
			},

			// 实名认证
			goToIdentityVerification() {
				uni.navigateTo({
					url: '/subpackages/user/identity-verification/identity-verification'
				})
			},

			// 电子钱包
			goToWallet() {
				uni.navigateTo({
					url: '/subpackages/wallet/wallet/wallet'
				})
			},

			// 积分管理
			goToPoints() {
				uni.navigateTo({
					url: '/subpackages/wallet/points/points'
				})
			},

			// 我的任务
			goToOrders() {
				uni.navigateTo({
					url: '/subpackages/tasks/task-list/task-list'
				})
			},

			// 设置
			goToSettings() {
				uni.navigateTo({
					url: '/subpackages/settings/settings/settings'
				})
			}
		}
	}
</script>

<style lang="scss">
	.user-center {
    background: linear-gradient(to right, #e0ecfa 0%, #f4f6f9 50%, #f6f4fc 100%);
		//background: linear-gradient(180deg, #c1e0ff 0%, #f4f6f9 50%);
		min-height: 100vh;
		position: relative;

		.user-header {
			position: relative;
			z-index: 1;
			padding: 50rpx 35rpx 35rpx;

			//background: linear-gradient(180deg, #c1e0ff 0%, #f4f6f9 100%);
			.user-info {
				display: flex;
				align-items: center;
				padding: 30rpx;
				border-radius: 24rpx 24rpx 16rpx 16rpx;

				.avatar-wrapper {
					position: relative;
					margin-right: 30rpx;

					.avatar {
						width: 160rpx;
						height: 160rpx;
						border-radius: 100%;
						background: #f0f4f8;
					}
				}

				.user-details {
					flex: 1;

					.username {
						display: block;
						font-size: 32rpx;
						font-weight: 600;
						color: #2c3e50;
						margin-bottom: 8rpx;
					}

					.user-id {
						display: block;
						font-size: 24rpx;
						color: #7f8c8d;
					}
				}

			}

			.stats-info {
				display: flex;
				justify-content: space-around;
				padding: 24rpx 0;
				margin-top: 20rpx;
        gap: 30rpx;

				.stat-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					flex: 1;
					padding: 15rpx 20rpx;
					transition: all 0.3s ease;
          background: linear-gradient(50deg, #e5e0f175 0%, #f5f4fb 50%, #e3ecf8 100%);
          border-radius: 40rpx;

					&:active {
						transform: scale(0.95);
					}

					.stat-icon {
						width: 45rpx;
						height: 45rpx;
						border-radius: 20rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 8rpx;
						padding: 10rpx;

						&.points {
							background: rgba(255, 193, 7, 0.1);
						}

						&.wallet {
							background: rgba(236, 106, 93, 0.1);
						}

						&.tasks {
							background: rgba(59, 85, 152, 0.1);
						}
					}

					.stat-value {
						font-size: 28rpx;
						font-weight: 700;
						color: #2c3e50;
						margin-bottom: 4rpx;
					}

					.stat-label {
						font-size: 22rpx;
						color: #7f8c8d;
						font-weight: 500;
					}
				}
			}
		}

		.services-section {
			margin: 0 35rpx 35rpx;
			position: relative;
			z-index: 1;
      background: linear-gradient(to right, #f6f4fc 0%, #f4f6f9 50%, #e0ecfa 100%);
			//background: linear-gradient(180deg, #f8f3ff 0%, #ffffff 100%);
			border-radius: 24rpx;
			padding: 20rpx;

			.section-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #2c3e50;
				margin-bottom: 24rpx;
			}

			.services-grid {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr 1fr;

				.service-card {
					transition: all 0.3s ease;
					position: relative;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					&:active {
						transform: translateY(4rpx);
					}

					.service-icon {
						width: 40rpx;
						height: 40rpx;
						border-radius: 20rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 20rpx;

						&.personal-info {
							background: rgba(59, 85, 152, 0.1);
						}

						&.house-binding {
							background: rgba(7, 193, 96, 0.1);
						}

						&.family {
							background: rgba(59, 85, 152, 0.1);
						}

						&.verification {
							background: rgba(255, 107, 53, 0.1);
						}

						&.wallet {
							background: rgba(255, 107, 53, 0.1);
							//background: rgba(7, 193, 96, 0.1);
						}

						&.points {
							background: rgba(255, 193, 7, 0.1);
						}
					}

					.service-title {
						display: block;
						font-size: 25rpx;
						color: #2c3e50;
						line-height: 1.2;
						text-align: center;
						word-wrap: break-word;
						word-break: break-all;
						padding: 20rpx 0;
					}


					.service-status {
						position: absolute;
						top: 6rpx;
						right: 6rpx;
						font-size: 20rpx;
						padding: 2rpx 4rpx;
						border-radius: 6rpx;
						background: rgba(255, 107, 53, 0.1);
						color: #ff6b35;
						font-weight: 500;

						&.verified {
							background: rgba(7, 193, 96, 0.1);
							color: #07c160;
						}
					}

					.wallet-balance {
						font-size: 16rpx;
						color: #07c160;
						font-weight: 600;
						margin-top: 2rpx;
					}

					.points-count {
						font-size: 24rpx;
						color: #ffc107;
						margin-top: 2rpx;
					}
				}
			}
		}

		.quick-actions {
			padding: 0 30rpx 40rpx;
			position: relative;
			z-index: 1;

			.section-title {
				font-size: 30rpx;
				font-weight: 600;
				color: #2c3e50;
				margin-bottom: 40rpx;
			}

			.action-list {
        background: linear-gradient(to right, #f6f4fc 0%, #f4f6f9 50%, #e0ecfa 100%);
				border-radius: 20rpx;
				overflow: hidden;
				//box-shadow: 0 4rpx 20rpx rgba(112, 82, 164, 0.06);
				backdrop-filter: blur(10rpx);

				.action-item {
					display: flex;
					align-items: center;
					padding: 28rpx 30rpx;
					border-bottom: 1rpx solid rgba(112, 82, 164, 0.05);
					transition: background-color 0.2s;

					&:last-child {
						border-bottom: none;
					}

					&:active {
						background-color: rgba(112, 82, 164, 0.04);
					}

					.action-icon {
						width: 50rpx;
						height: 50rpx;
						border-radius: 15rpx;
						background: rgba(112, 82, 164, 0.1);
						display: flex;
						align-items: center;
						justify-content: center;
						margin-right: 20rpx;
					}

					.action-text {
						flex: 1;
						font-size: 28rpx;
						color: #2c3e50;
					}

					.action-status {
						font-size: 22rpx;
						padding: 4rpx 12rpx;
						border-radius: 12rpx;
						background: rgba(255, 107, 53, 0.1);
						color: #ff6b35;
						font-weight: 500;

						&.signed {
							background: rgba(7, 193, 96, 0.1);
							color: #07c160;
						}
					}

					.action-badge {
						background: #3b5598;
						color: white;
						font-size: 20rpx;
						padding: 4rpx 10rpx;
						border-radius: 12rpx;
						font-weight: 500;
						margin-right: 16rpx;
					}
				}
			}
		}
	}
</style>
