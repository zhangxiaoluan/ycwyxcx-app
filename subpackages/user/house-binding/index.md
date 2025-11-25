### 房屋绑定

> 房屋绑定记录：/app/property/binding/my-bindings get请求
>
> 接口返回字段：@ApiModelProperty(value = "用户ID")
>     @JsonSerialize(using = ToStringSerializer.class)
>     private Long userId;
>
>     @ApiModelProperty(value = "房间ID")
>     private Long roomId;
>     
>     @ApiModelProperty(value = "小区ID")
>     private Long communityId;
>     
>     @ApiModelProperty(value = "楼栋ID")
>     private Long buildingId;
>     
>     @ApiModelProperty(value = "关系类型：1-业主,2-家人,3-租客,4-其他")
>     private Integer relationType;
>     
>     @ApiModelProperty(value = "真实姓名")
>     private String realName;
>     
>     @ApiModelProperty(value = "身份证号")
>     private String idCard;
>     
>     @ApiModelProperty(value = "联系电话")
>     private String phone;
>     
>     @ApiModelProperty(value = "联系地址")
>     private String contactAddress;
>     
>     @ApiModelProperty(value = "绑定证明材料（JSON格式）")
>     private String bindingProof;
>     
>     @ApiModelProperty(value = "备注说明")
>     private String remark;
>     
>     @ApiModelProperty(value = "审核状态：1-待审核,2-审核通过,3-审核拒绝")
>     private Integer status;
>     
>     @ApiModelProperty(value = "审核人ID")
>     private Long auditUserId;
>     
>     @ApiModelProperty(value = "审核时间")
>     private LocalDateTime auditTime;
>     
>     @ApiModelProperty(value = "审核备注")
>     private String auditRemark;
>     
>     @ApiModelProperty(value = "绑定时间")
>     private LocalDateTime bindingTime;
>
> 展示在列表页面

