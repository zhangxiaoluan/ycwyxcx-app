<template>
	<view class="user-center" :style="{ paddingTop: statusBarHeight + navBarHeight + 'px' }">

		<!-- 用户信息头部 -->
		<view class="user-header">
			<view class="user-info" @click="goToProfile">
				<view class="avatar-wrapper">
					<image :src="userInfo.avatar || '/static/logo.png'" class="avatar" mode="scaleToFill"></image>
				</view>
				<view class="user-details">
					<text class="username">{{ userInfo.name || '点击设置昵称' }}</text>
					<text class="user-id">手机号: {{ userInfo.cellphone || '100001' }}</text>
				</view>
			</view>

			<!-- 统计信息 -->
			<view class="stats-info">
				<view class="stat-item" @click="goToPoints">
					<view class="stat-icon points">
						<u-icon name="star" size="30" color="#ffc107"></u-icon>
					</view>
					<text class="stat-value">{{ points.totalPoints || 0 }}</text>
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

        <!-- 电子钱包 -->
        <view class="service-card" @click="goToWallet">
          <view class="service-icon wallet">
            <u-icon name="red-packet" size="28" color="#ec6a5d"></u-icon>
          </view>
          <text class="service-title">电子钱包</text>
        </view>

				<!-- 家庭成员管理 -->
				<view class="service-card" @click="goToFamilyMembers">
					<view class="service-icon family">
						<u-icon name="man-add" size="28" color="#3b5598"></u-icon>
					</view>
					<text class="service-title">家庭成员</text>
				</view>

				<!-- 积分管理 -->
				<view class="service-card" @click="goToShopping">
					<view class="service-icon shopping">
						<u-icon name="shopping-cart" size="28" color="#d33c21"></u-icon>
					</view>
					<text class="service-title">积分商城</text>
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

				<view class="action-item" @click="handleSign">
					<view class="action-icon">
						<u-icon name="calendar" size="20" color="#3b5598"></u-icon>
					</view>
					<text class="action-text">每日签到</text>
					<view class="action-status" :class="{ 'signed': SignDara.monthSignDays }">
            <view v-if="SignDara.todaySigned">本月签到{{ SignDara.monthSignDays }}天，连续签到{{ SignDara.continuousSignDays }}天</view>
            <view v-else>今日未签到</view>
					</view>
				</view>

        <view class="action-item" @click="goToProperty">
          <view class="action-icon">
            <u-icon name="kefu-ermai" size="20" color="#3b5598"></u-icon>
          </view>
          <text class="action-text">成为物业</text>
          <u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
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

		<!-- 签到成功弹窗 -->
		<view class="sign-success-modal" v-if="showSignModal" @click.stop="closeSignModal">
			<view class="modal-content" @click.stop>
				<view class="modal-close" @click="closeSignModal">
					<u-icon name="close" size="20" color="#999"></u-icon>
				</view>

				<!-- 成功动画图标 -->
				<view class="success-animation">
					<view class="success-circle">
						<view class="success-checkmark">✓</view>
					</view>
					<view class="sparkles">
						<view class="sparkle sparkle-1">✨</view>
						<view class="sparkle sparkle-2">⭐</view>
						<view class="sparkle sparkle-3">✨</view>
					</view>
				</view>

				<view class="modal-title">签到成功！</view>
				<view class="modal-subtitle">恭喜您完成今日签到</view>

				<view class="reward-info">
					<view class="reward-item">
						<view class="reward-icon">
							<u-icon name="star" size="24" color="#ffc107"></u-icon>
						</view>
						<view class="reward-text">
							<text class="reward-value">+5</text>
							<text class="reward-label">积分</text>
						</view>
					</view>

					<view class="reward-divider"></view>

					<view class="reward-item">
						<view class="reward-icon">
							<u-icon name="checkmark" size="24" color="#ffc107"></u-icon>
						</view>
						<view class="reward-text">
							<text class="reward-value">{{ SignDara.continuousSignDays || 1 }}</text>
							<text class="reward-label">连续天数</text>
						</view>
					</view>
				</view>

				<view class="sign-stats">
					<view class="stat-row">
						<text class="stat-label">本月签到</text>
						<text class="stat-value">{{ SignDara.monthSignDays }}天</text>
					</view>
					<view class="stat-row">
						<text class="stat-label">总积分</text>
						<text class="stat-value">{{ points.totalPoints || 0 }}分</text>
					</view>
				</view>

				<view class="modal-actions">
					<view class="action-btn secondary" @click="closeSignModal">
						知道了
					</view>
					<view class="action-btn primary" @click="goToPoints">
						查看积分
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
  import {sign, signInfo, userMe, signStatus} from "../../api/list/login";
	export default {
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 0,
				userInfo: uni.getStorageSync('wyUserInfo') || {
					avatar: null,
					nickname: null,
					userId: null,
				},

        // 签到数据
        SignDara: {
          // 连续签到天数
          continuousSignDays: 0,
          // 今天是否已签到
          todaySigned: false,
          // 本月签到天数
          monthSignDays: 0,
        },
        // 积分
        points: {
          totalPoints: 0,
        },
				// 签到弹窗相关
				showSignModal: false,
			}
		},
		onLoad() {},
		onShow() {
      this.initHandle()
    },
		methods: {
      initHandle(){
        this.getStatusBarHeight()
        this.getSignStatus()
        this.getUserMe()
        this.getSignInfo()
      },

      // 状态栏目高度
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

			// 获取用户信息
			getUserMe(){
				userMe().then(res=>{
					let info = { ...this.userInfo, ...res }
					uni.setStorageSync('wyUserInfo', info)
					this.userInfo = info
				})
			},

      // 获取用户签到状态
      getSignStatus(){
        signStatus().then(res=>{
          this.SignDara = res || {}
        })
      },

      // 用户积分
      getSignInfo(){
        signInfo().then(res=>{
          this.points = res || {}
        })
      },

      // 用户签到
      handleSign(){
        if (!this.SignDara.todaySigned){
          sign().then(res=>{
            // 签到成功，更新数据
            this.getSignStatus()
            this.getSignInfo()
            // 设置奖励信息
            this.SignDara = res
            // 显示签到成功弹窗
            this.showSignModal = true
          })
        } else {
          // 今日已签到，显示提示
          uni.showToast({ title: '今日已签到', icon: 'none'  })
        }
      },

      // 关闭签到弹窗
      closeSignModal(){
        this.showSignModal = false
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
					url: '/subpackages/user/house-binding/house-bindings'
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

      // 积分商城
      goToShopping() {
        uni.navigateTo({
          url: '/subpackages/wallet/points-mall/points-mall'
        })
      },

      // 成为物业
      goToProperty(){
        uni.navigateTo({
          url: '/subpackages/user/property/index'
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
				padding: 30rpx 30rpx 30rpx 0;
				border-radius: 24rpx 24rpx 16rpx 16rpx;

				.avatar-wrapper {
					position: relative;
					margin-right: 30rpx;

					.avatar {
						width: 160rpx;
						height: 160rpx;
						border-radius: 30rpx;
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
					padding: 20rpx;
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

						&.shopping {
							background: rgba(211, 60, 33, 0.15);
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

		// 签到成功弹窗样式
		.sign-success-modal {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.6);
			z-index: 9999;
			display: flex;
			align-items: center;
			justify-content: center;
			backdrop-filter: blur(8rpx);
			animation: fadeIn 0.3s ease-out;

			.modal-content {
				background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
				border-radius: 32rpx;
				margin: 60rpx 40rpx;
				padding: 50rpx 40rpx 40rpx;
				position: relative;
				max-width: 600rpx;
				width: 100%;
				box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
				backdrop-filter: blur(20rpx);
				animation: slideUp 0.4s ease-out;

				.modal-close {
					position: absolute;
					top: 30rpx;
					right: 30rpx;
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					background: rgba(153, 153, 153, 0.1);
					display: flex;
					align-items: center;
					justify-content: center;
					transition: all 0.3s ease;

					&:active {
						background: rgba(153, 153, 153, 0.2);
						transform: scale(0.9);
					}
				}

				.success-animation {
					position: relative;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-bottom: 40rpx;

					.success-circle {
						width: 120rpx;
						height: 120rpx;
						border-radius: 50%;
						background: linear-gradient(135deg, #07c160 0%, #10b470 100%);
						display: flex;
						align-items: center;
						justify-content: center;
						box-shadow: 0 8rpx 24rpx rgba(7, 193, 96, 0.3);
						animation: scaleIn 0.6s ease-out, pulse 2s ease-in-out infinite;

						.success-checkmark {
							font-size: 60rpx;
							font-weight: bold;
							color: white;
							animation: checkmarkPop 0.4s ease-out 0.3s;
						}
					}

					.sparkles {
						position: absolute;
						width: 200rpx;
						height: 200rpx;

						.sparkle {
							position: absolute;
							font-size: 24rpx;
							animation: sparkleFloat 3s ease-in-out infinite;

							&.sparkle-1 {
								top: 10rpx;
								left: 20rpx;
								animation-delay: 0s;
							}

							&.sparkle-2 {
								top: 15rpx;
								right: 25rpx;
								animation-delay: 0.6s;
							}

							&.sparkle-3 {
								bottom: 20rpx;
								left: 30rpx;
								animation-delay: 1.2s;
							}
						}
					}
				}

				.modal-title {
					text-align: center;
					font-size: 36rpx;
					font-weight: 700;
					color: #2c3e50;
					margin-bottom: 16rpx;
					background: linear-gradient(135deg, #07c160 0%, #10b470 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}

				.modal-subtitle {
					text-align: center;
					font-size: 28rpx;
					color: #7f8c8d;
					margin-bottom: 40rpx;
					font-weight: 400;
				}

				.reward-info {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 40rpx;
					background: linear-gradient(135deg, rgba(7, 193, 96, 0.05) 0%, rgba(16, 180, 112, 0.05) 100%);
					border-radius: 24rpx;
					padding: 30rpx;
					border: 2rpx solid rgba(7, 193, 96, 0.1);

					.reward-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						flex: 1;

						.reward-icon {
							width: 60rpx;
							height: 60rpx;
							border-radius: 30rpx;
							background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.2) 100%);
							display: flex;
							align-items: center;
							justify-content: center;
							margin-bottom: 12rpx;
						}

						.reward-text {
							display: flex;
							flex-direction: column;
							align-items: center;

							.reward-value {
								font-size: 32rpx;
								font-weight: 700;
								color: #07c160;
								margin-bottom: 4rpx;
							}

							.reward-label {
								font-size: 22rpx;
								color: #7f8c8d;
								font-weight: 400;
							}
						}
					}

					.reward-divider {
						width: 2rpx;
						height: 80rpx;
						background: rgba(7, 193, 96, 0.2);
						margin: 0 40rpx;
					}
				}

				.sign-stats {
					background: linear-gradient(135deg, rgba(59, 85, 152, 0.05) 0%, rgba(112, 82, 164, 0.05) 100%);
					border-radius: 20rpx;
					padding: 30rpx;
					margin-bottom: 40rpx;
					border: 1rpx solid rgba(59, 85, 152, 0.1);

					.stat-row {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 20rpx;

						&:last-child {
							margin-bottom: 0;
						}

						.stat-label {
							font-size: 26rpx;
							color: #7f8c8d;
							font-weight: 400;
						}

						.stat-value {
							font-size: 28rpx;
							font-weight: 600;
							color: #3b5598;
						}
					}
				}

				.modal-actions {
					display: flex;
					gap: 20rpx;

					.action-btn {
						flex: 1;
						padding: 24rpx;
						border-radius: 16rpx;
						text-align: center;
						font-size: 28rpx;
						font-weight: 600;
						transition: all 0.3s ease;
						position: relative;
						overflow: hidden;

						&::before {
							content: '';
							position: absolute;
							top: 0;
							left: -100%;
							width: 100%;
							height: 100%;
							background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
							transition: left 0.5s;
						}

						&:active::before {
							left: 100%;
						}

						&.secondary {
							background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
							color: #6c757d;
							border: 2rpx solid #dee2e6;

							&:active {
								background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
								transform: translateY(2rpx);
							}
						}

						&.primary {
							background: linear-gradient(135deg, #07c160 0%, #10b470 100%);
							color: white;
							box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.3);

							&:active {
								background: linear-gradient(135deg, #06b658 0%, #0ea368 100%);
								transform: translateY(2rpx);
								box-shadow: 0 2rpx 8rpx rgba(7, 193, 96, 0.4);
							}
						}
					}
				}
			}
		}

		// 动画效果
		@keyframes fadeIn {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		@keyframes slideUp {
			from {
				opacity: 0;
				transform: translateY(100rpx);
			}
			to {
				opacity: 1;
				transform: translateY(0);
			}
		}

		@keyframes scaleIn {
			from {
				opacity: 0;
				transform: scale(0.3);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}
		}

		@keyframes pulse {
			0%, 100% {
				transform: scale(1);
			}
			50% {
				transform: scale(1.05);
			}
		}

		@keyframes checkmarkPop {
			from {
				opacity: 0;
				transform: scale(0);
			}
			to {
				opacity: 1;
				transform: scale(1);
			}
		}

		@keyframes sparkleFloat {
			0%, 100% {
				opacity: 0.3;
				transform: translateY(0) rotate(0deg);
			}
			50% {
				opacity: 1;
				transform: translateY(-20rpx) rotate(180deg);
			}
		}
	}
</style>
