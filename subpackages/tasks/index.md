### 任务

> 任务列表：/api/community/task/list get请求
>
> 返回参数：    "records": [
>       {
>         "id": 0,
>         "publisherId": 0,
>         "publisherName": "string",
>         "publisherAvatar": "string",
>         "communityId": 0,
>         "communityName": "string",
>         "title": "string",
>         "content": "string",
>         "taskType": 0,
>         "taskTypeName": "string",
>         "rewardPoints": 0,
>         "publishTime": "2025-11-26T02:14:46.478Z",
>         "deadlineTime": "2025-11-26T02:14:46.478Z",
>         "taskStatus": 0,
>         "taskStatusName": "string",
>         "takerId": 0,
>         "takerName": "string",
>         "takerAvatar": "string",
>         "takeTime": "2025-11-26T02:14:46.478Z",
>         "completeTime": "2025-11-26T02:14:46.478Z",
>         "contactPhone": "string",
>         "contactAddress": "string",
>         "remark": "string",
>         "taskImages": [
>           "string"
>         ],
>         "hasApplied": true,
>         "canTake": true,
>         "remainingHours": 0
>       }
>     ],



> 领取任务：/api/community/task/take （post请求）
>
> 返回：  "result": true



> 任务详情：/api/community/task/detail/{taskId}（get请求）



> 获取我发布的任务：/api/community/task/my-published（get请求）
>
> 返回数据：   "records": [
>       {
>         "id": 0,
>         "publisherId": 0,
>         "publisherName": "string",
>         "publisherAvatar": "string",
>         "communityId": 0,
>         "communityName": "string",
>         "title": "string",
>         "content": "string",
>         "taskType": 0,
>         "taskTypeName": "string",
>         "rewardPoints": 0,
>         "publishTime": "2025-11-26T02:18:01.686Z",
>         "deadlineTime": "2025-11-26T02:18:01.686Z",
>         "taskStatus": 0,
>         "taskStatusName": "string",
>         "takerId": 0,
>         "takerName": "string",
>         "takerAvatar": "string",
>         "takeTime": "2025-11-26T02:18:01.686Z",
>         "completeTime": "2025-11-26T02:18:01.686Z",
>         "contactPhone": "string",
>         "contactAddress": "string",
>         "remark": "string",
>         "taskImages": [
>           "string"
>         ],
>         "hasApplied": true,
>         "canTake": true,
>         "remainingHours": 0
>       }
>     ],



> 获取喔领取的任务：/api/community/task/my-taken（get请求）
>
> 返回数据：  "records": [
>       {
>         "id": 0,
>         "publisherId": 0,
>         "publisherName": "string",
>         "publisherAvatar": "string",
>         "communityId": 0,
>         "communityName": "string",
>         "title": "string",
>         "content": "string",
>         "taskType": 0,
>         "taskTypeName": "string",
>         "rewardPoints": 0,
>         "publishTime": "2025-11-26T02:19:26.182Z",
>         "deadlineTime": "2025-11-26T02:19:26.182Z",
>         "taskStatus": 0,
>         "taskStatusName": "string",
>         "takerId": 0,
>         "takerName": "string",
>         "takerAvatar": "string",
>         "takeTime": "2025-11-26T02:19:26.182Z",
>         "completeTime": "2025-11-26T02:19:26.182Z",
>         "contactPhone": "string",
>         "contactAddress": "string",
>         "remark": "string",
>         "taskImages": [
>           "string"
>         ],
>         "hasApplied": true,
>         "canTake": true,
>         "remainingHours": 0
>       }
>     ],



> 获取任务状态：/api/community/task/task-statuses （get请求）
>
> 返回数据：  "result": [
>     {
>       "additionalProp1": {},
>       "additionalProp2": {},
>       "additionalProp3": {}
>     }
>   ]



> 获取任务类型列表：/api/community/task/task-types （get请求）
>
> 返回数据： "result": [
>     {
>       "additionalProp1": {},
>       "additionalProp2": {},
>       "additionalProp3": {}
>     }
>   ]



> 取消任务：/api/community/task/cancel/{taskId} （post请求）
>
> 返回数据：  "result": true



> 完成任务：/api/community/task/complete/{taskId} （post请求）
>
> 返回数据：  "result": true



> 发布任务：/api/community/task/publish （post请求）
>
> 返回数据：  "result": {
>     "id": 0,
>     "publisherId": 0,
>     "publisherName": "string",
>     "publisherAvatar": "string",
>     "communityId": 0,
>     "communityName": "string",
>     "title": "string",
>     "content": "string",
>     "taskType": 0,
>     "taskTypeName": "string",
>     "rewardPoints": 0,
>     "publishTime": "2025-11-26T02:23:05.287Z",
>     "deadlineTime": "2025-11-26T02:23:05.287Z",
>     "taskStatus": 0,
>     "taskStatusName": "string",
>     "takerId": 0,
>     "takerName": "string",
>     "takerAvatar": "string",
>     "takeTime": "2025-11-26T02:23:05.287Z",
>     "completeTime": "2025-11-26T02:23:05.287Z",
>     "contactPhone": "string",
>     "contactAddress": "string",
>     "remark": "string",
>     "taskImages": [
>       "string"
>     ],
>     "hasApplied": true,
>     "canTake": true,
>     "remainingHours": 0
>   }
