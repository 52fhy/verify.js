﻿# verify.js使用

标签： JS插件

---

首先引入js，最好拷贝verify整个目录,因为里面有图标。
```
<script src="verify/verify.js"></script>
```

>d:默认提示信息,v:正则,c:正确提示信息,e:错误提示信息

使用：
在需要验证的的输入框里输入下面类似内容：
```
<input type="text" verifys="{d:'请输入账户信息(邮箱或用户名)',v:{r:/^[0-9A-Za-z-\._]+@\w+(\.(\w){1,3}){1,3}$|^[0-9A-Za-z-_]{3,16}$/,c:'账户信息格式正确',e:'账户信息格式不正确'}}" name="email" class=""><span id="emailTip" class="error"></span>
```

>注意：name="email"和id="emailTip"对应关系

在公共CSS里加上一句，注意路径
```
.error{
	height: 25px; 
	line-height: 25px; 
	margin: 0px 0px 0px 3px; 
	padding: 0px 0px 0px 25px; 
	color: rgb(153, 153, 153); 
	background: url(../verify/error.gif) no-repeat scroll 0px 6px transparent;
}
```	
完成。

常见验证规则：

邮箱：
```
<input type="text" class="field" name="user_email" verifys="{d:'请填写Email帐号！',v:{r:/^[0-9A-Za-z-\._]+@\w+(\.(\w){1,3}){1,3}$/,c:'恭喜，您的Email帐号可用！',e:'填写的Email帐号格式不正确！'},a:{u:'do.php?act=user_check_useremail',a:'',c:'恭喜，您的Email帐号可用！',e:'很抱歉，您的Email帐号已被使用！'}}" /><span id="user_emailTip"></span>
```

用户名：
```
<input type="text" class="field" name="user_name"
verifys="{d:'用户名由3-16位字母、数字与下划线组成',
v:{r:/^[0-9A-Za-z-_]{3,16}$/,c:'恭喜，您的用户名可用！',e:'填写的会员用户名格式不正确！'},
a:{u:'do.php?act=user_check_username',a:'',c:'恭喜，您的用户名可用！',e:'很抱歉，您的用户名已被使用！'}}" 
/>
<span id="user_nameTip"></span>
```

密码：
```
<input type="password" class="field" name="user_password" verifys="{d:'请填写6-20位密码！',v:{r:/^.{6,20}$/,c:'密码格式正确！',e:'填写的密码格式不正确！'}}" /><span id="user_passwordTip"></span>
```

确认密码:
```
<input type="password" class="field" name="user_repassword" verifys="{d:'请填写确认密码！',v:{r:/^.{6,20}$/,c:'确认密码格式正确！',e:'确认密码格式不正确！'},c:{m:'=',w:'user_password',c:'确认密码格式正确！',e:'两次填写的密码不一致！'}}" /><span id="user_repasswordTip"></span>
```

验证码:
```
<input type="text" class="field" name="vericode" verifys="{d:'请填写验证码！',v:{r:/^[0-9a-zA-Z]{5}$/,c:'验证码格式正确！',e:'验证码格式错误！'}}" /><span id="vericodeTip"></span>
```

单选框：
```
<input type="checkbox" checked="checked" name="servitems" verifys="{d:'注册协议',s:{r:'1'}}"/>我已阅读并同意注册协议
<span id="servitemsTip" class="error"/>注册协议</span>
```

```
* v:base verify function,c:compare verify function,f:function compare verify function,a:Ajax verify function,s:radio and checkbox input verify function
 
 v:基本验证方法
 c:比较验证方法
 f:比较验证回调
 a:ajax验证方法
 s:单选和多选验证方法
 
 * 
 * d:default notice information
 * d:默认提示信息
 * 
 * c:success notice information,e:failure notice information
 * c:验证成功提示消息
 * e:验证失败提示消息
 * 
 * r:regular expression(can not add quotation marks)
 * r:正则(不能加引号)
 *
 * m:compare model,w:the name which compare with the object
 * m:比较模型
 * w:将要进行比较的对象
 *
 * u:URL,a:arguments,w:processing notice information
 * u:url
 * a:参数
 * w:正在处理提示消息
```



