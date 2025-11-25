### 社区活动
>  社区动态列表：/app/community/post/list 请求方式（post）。  
>  返回数据：  "records": [
{
"id": 0,
"userId": 0,
"userName": "string",
"userAvatar": "string",
"title": "string",
"content": "string",
"status": 0,
"reason": "string",
"likes": 0,
"commentsCount": 0,
"mediaList": [
{
"id": 0,
"postId": 0,
"type": 0,
"typeDesc": "string",
"url": "string",
"thumbnail": "string",
"size": 0,
"fileName": "string"
}
],
"isLiked": true,
"createdAt": "2025-11-25T08:05:45.315Z",
"updatedAt": "2025-11-25T08:05:45.315Z",
"canEdit": true,
"canDelete": true
}
],
> 
> 社区动态详情：/app/community/post/{id} 请求方式（get）  
> 返回数据： "result": {
"id": 0,
"userId": 0,
"userName": "string",
"userAvatar": "string",
"title": "string",
"content": "string",
"status": 0,
"reason": "string",
"likes": 0,
"commentsCount": 0,
"mediaList": [
{
"id": 0,
"postId": 0,
"type": 0,
"typeDesc": "string",
"url": "string",
"thumbnail": "string",
"size": 0,
"fileName": "string"
}
],
"isLiked": true,
"createdAt": "2025-11-25T08:08:46.214Z",
"updatedAt": "2025-11-25T08:08:46.214Z",
"canEdit": true,
"canDelete": true
}
> 
> 点赞动态：/app/community/post/like/{id} 请求方式（post）。  
> 取消点赞：/app/community/post/unlike/{id} 请求方式（post）。
>
> 
> 发布社区动态：/app/community/post/create 请求方式（post）。  
> 入参：  "title": "string",
"content": "string",
"mediaUrls": [
"string"
],
"mediaTypes": [
0
]
> 
> 获取我的动态列表：/app/community/post/my 请求方式（post）  
> 返回数据：  "records": [
{
"id": 0,
"userId": 0,
"userName": "string",
"userAvatar": "string",
"title": "string",
"content": "string",
"status": 0,
"reason": "string",
"likes": 0,
"commentsCount": 0,
"mediaList": [
{
"id": 0,
"postId": 0,
"type": 0,
"typeDesc": "string",
"url": "string",
"thumbnail": "string",
"size": 0,
"fileName": "string"
}
],
"isLiked": true,
"createdAt": "2025-11-25T08:13:09.296Z",
"updatedAt": "2025-11-25T08:13:09.296Z",
"canEdit": true,
"canDelete": true
}
],
"pages": 0,
"searchCount": true
}
> 
> 删除我的动态：/app/community/post/delete/{id} 请求方式（post）
> 
> 获取我的点赞列表：/app/community/post/liked 请求方式（post）  
> 返回数据：   "records": [
{
"id": 0,
"userId": 0,
"userName": "string",
"userAvatar": "string",
"title": "string",
"content": "string",
"status": 0,
"reason": "string",
"likes": 0,
"commentsCount": 0,
"mediaList": [
{
"id": 0,
"postId": 0,
"type": 0,
"typeDesc": "string",
"url": "string",
"thumbnail": "string",
"size": 0,
"fileName": "string"
}
],
"isLiked": true,
"createdAt": "2025-11-25T08:15:15.230Z",
"updatedAt": "2025-11-25T08:15:15.230Z",
"canEdit": true,
"canDelete": true
}
],
> 
> 
