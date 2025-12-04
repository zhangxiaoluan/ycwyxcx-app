### 报修管理
> 报修管理：/app/repair/list  （post） 。  
> 返回数据：    "records": [
{
"id": 0,
"requestNo": "string",
"categoryId": 0,
"categoryName": "string",
"title": "string",
"description": "string",
"location": "string",
"urgentLevel": 0,
"urgentLevelDesc": "string",
"imageList": [
"string"
],
"contactTime": "string",
"status": 0,
"statusDesc": "string",
"handlerId": 0,
"handlerName": "string",
"handleTime": "2025-11-25T13:20:12.719Z",
"startTime": "2025-11-25T13:20:12.719Z",
"completeTime": "2025-11-25T13:20:12.719Z",
"remark": "string",
"rating": 0,
"feedback": "string",
"feedbackTime": "2025-11-25T13:20:12.719Z",
"createdAt": "2025-11-25T13:20:12.719Z",
"updatedAt": "2025-11-25T13:20:12.719Z",
"canRate": true,
"progressList": [
{
"id": 0,
"requestId": 0,
"status": 0,
"statusDesc": "string",
"description": "string",
"operatorId": 0,
"operatorName": "string",
"operatorType": 0,
"operatorTypeDesc": "string",
"imageList": [
"string"
],
"createdAt": "2025-11-25T13:20:12.719Z"
}
]
}
], 
> 

> 报修申请：/app/repair/request（post）请求  
> 请求数据：{    "id": 0,
"requestNo": "string",
"categoryId": 0,
"categoryName": "string",
"title": "string",
"description": "string",
"location": "string",
"urgentLevel": 0,
"urgentLevelDesc": "string",
"imageList": [
"string"
],
"contactTime": "string",
"status": 0,
"statusDesc": "string",
"handlerId": 0,
"handlerName": "string",
"handleTime": "2025-11-25T13:21:06.268Z",
"startTime": "2025-11-25T13:21:06.268Z",
"completeTime": "2025-11-25T13:21:06.268Z",
"remark": "string",
"rating": 0,
"feedback": "string",
"feedbackTime": "2025-11-25T13:21:06.268Z",
"createdAt": "2025-11-25T13:21:06.268Z",
"updatedAt": "2025-11-25T13:21:06.268Z",
"canRate": true,
"progressList": [
{
"id": 0,
"requestId": 0,
"status": 0,
"statusDesc": "string",
"description": "string",
"operatorId": 0,
"operatorName": "string",
"operatorType": 0,
"operatorTypeDesc": "string",
"imageList": [
"string"
],
"createdAt": "2025-11-25T13:21:06.268Z"
}}
> 
> 
>  
> 报修分类：/app/repair/categories get 请求  
> 返回数据：  "result": [
{
"id": 0,
"name": "string",
"description": "string",
"icon": "string",
"sort": 0,
"status": 0,
"requestCount": 0
}
]
>  
> 
> 报修服务进度：/app/repair/progress/{requestId} （get请求）  
> 返回数据：  {
"id": 0,
"requestId": 0,
"status": 0,
"statusDesc": "string",
"description": "string",
"operatorId": 0,
"operatorName": "string",
"operatorType": 0,
"operatorTypeDesc": "string",
"imageList": [
"string"
],
"createdAt": "2025-11-25T13:24:17.589Z"
} 
> 
> 报修评价：/app/repair/rate/{id} 。（post请求）  
> 请求数据：{  "rating": 5,
"feedback": "string"

