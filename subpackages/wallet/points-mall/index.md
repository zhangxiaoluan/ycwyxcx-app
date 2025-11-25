### 商城
> 根据积分兑换商品，点击是否兑换，完成兑换。  
> 商品分类接口：/app/points/mall/categories  请求方式（get）  
> 接口返回数据： "result": [
{
"id": 0,
"name": "string",
"icon": "string",
"productCount": 0,
"products": [
{
"id": 0,
"categoryId": 0,
"categoryName": "string",
"name": "string",
"description": "string",
"image": "string",
"imageList": [
"string"
],
"points": 0,
"stock": 0,
"soldCount": 0,
"exchangeLimit": 0,
"userExchangedCount": 0,
"canExchange": true,
"status": 0,
"startTime": "2025-11-25T02:49:24.291Z",
"endTime": "2025-11-25T02:49:24.291Z",
"createdAt": "2025-11-25T02:49:24.291Z"
}
]
}
]
>  
> 商品列表接口：/app/points/mall/products 请求方式（get）参数categoryId  
> 接口返回数据：   "records": [
{
"id": 0,
"categoryId": 0,
"categoryName": "string",
"name": "string",
"description": "string",
"image": "string",
"imageList": [
"string"
],
"points": 0,
"stock": 0,
"soldCount": 0,
"exchangeLimit": 0,
"userExchangedCount": 0,
"canExchange": true,
"status": 0,
"startTime": "2025-11-25T02:50:53.942Z",
"endTime": "2025-11-25T02:50:53.942Z",
"createdAt": "2025-11-25T02:50:53.942Z"
}
],
> 
> 兑换商品：/app/points/mall/exchange 请求方式（post） 参数{  "productId": 0,
"quantity": 1,
"contactInfo": "string",
"remark": "string"}
>  
> 
> 
> 兑换记录：/app/points/mall/exchange/records 请求方式（get）
> 返回数据：  "records": [
{
"id": 0,
"userId": 0,
"productId": 0,
"productName": "string",
"productImage": "string",
"points": 0,
"quantity": 0,
"status": 0,
"statusName": "string",
"contactInfo": "string",
"remark": "string",
"shippingInfo": "string",
"completedAt": "2025-11-25T02:53:39.634Z",
"createdAt": "2025-11-25T02:53:39.634Z"
}
],
> 
