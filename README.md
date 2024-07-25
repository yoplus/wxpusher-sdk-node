# wxpusher for Node
## 简介

* 基于Node对 [Wxpusher](https://wxpusher.zjiecode.com) 微信推送服务的接口封装。

## 注意事项

* 需安装axios依赖

## 基本使用方法

引入本类库文件，实例化时需传入网站获取的appToken值。

```js
const WxPusher = require('./wxpusher');
async function main() {
  const wxPusher = new WxPusher('AT_xxx');
  const response = await wxPusher.queryUser();
  console.log(response);
}
main();
```

### 1、标准信息发送消息(POST请求发送)
sendMessage(内容, 摘要, 消息类型, 用户UID数组, 主题ID数组, 原文链接, 是否验证订阅时间);

#### 参数说明

* 字符串：内容、摘要、原文链接
  * 传递两个字符串为内容 + 摘要/原文链接(自动识别)
  * 传递三个字符串为内容 + 摘要 + 原文链接

* 数组：用户UID数组、主题ID数组、用户UID和主题ID混合数组
* 数字：消息类型、是否验证订阅时间
  * 传递一个数字为消息类型
  * 传递两个数字为消息类型 + 是否验证订阅时间

* 不同参数类型可随意调整传递顺序，相同参数类型不可随意调整传递顺序

#### 实例代码

```js
// 内容 + 单/双数组(字符串为用户UID 数字为主题ID 自动识别)
// 单数组可以是 1: 用户UID数组 2: 主题ID数组 3: 用户UID和主题ID混合数组(推荐)
wxPusher.sendMessage("Hello WxPusher", [10000, 10001]);
wxPusher.sendMessage("Hello WxPusher", ["UID_XXX", 10001]);
// 双数组 用户UID数组在前 主题ID数组在后
wxPusher.sendMessage("Hello WxPusher", ["UID_XXX"], [10000]);
wxPusher.sendMessage("Hello WxPusher", ["UID_XXX", "UID_YYY"], [10000]);

// 内容 + 消息类型 + 数组
wxPusher.sendMessage("Hello WxPusher", 1, ["UID_XXX", 10001]);
// 内容 + 数字 + 消息类型
wxPusher.sendMessage("Hello WxPusher", [10000, "UID_YYY"], 2);
// 内容 + 摘要 + 数组
wxPusher.sendMessage("Hello WxPusher", "你好", ["UID_XXX", 10001]);

// 内容 + 摘要 + 数组 + 原文链接
wxPusher.sendMessage("Hello WxPusher", "你好", ["UID_XXX", 10001], "https://wxpusher.zjiecode.com");
// 内容 + 摘要 + 消息类型 + 数组 + 是否验证订阅时间
wxPusher.sendMessage("Hello WxPusher", "你好", 1, ["UID_XXX", 10001], 1);

// 内容 + 摘要 + 消息类型 + 数组 + 原文链接 + 是否验证订阅时间
wxPusher.sendMessage("Hello WxPusher", "你好", 1, ["UID_XXX", "UID_YYY"], "https://wxpusher.zjiecode.com", 0);
// 内容 + 摘要 + 原文链接 + 数组 + 消息类型 + 是否验证订阅时间
wxPusher.sendMessage("Hello WxPusher", "你好", "https://wxpusher.zjiecode.com", ["UID_XXX", "UID_YYY"], 1, 0);
```

### 2、快速发送消息(GET请求发送)
quickSend(内容, 用户UID/主题ID, 原文链接, 是否验证订阅时间);

#### 参数说明

* 字符串：内容、用户UID/主题ID、原文链接
  * 传递两个字符串为内容 + 用户UID/主题ID(自动识别)
  * 传递三个字符串为内容 + 用户UID/主题ID(自动识别) + 原文链接

* 数字：是否验证订阅时间
* 不同参数类型可随意调整传递顺序，相同参数类型不可随意调整传递顺序

#### 实例代码

```js
// 内容 + 用户UID/主题ID
wxPusher.quickSend("Hello WxPusher", "UID_XXX");
wxPusher.quickSend("Hello WxPusher", "10001");

// 内容 + 用户UID/主题ID + 原文链接
wxPusher.quickSend("Hello WxPusher", "UID_XXX", "https://wxpusher.zjiecode.com");
```

### 3、查询状态
queryMessage(发送ID);

#### 参数说明

* 发送ID：发送消息接口返回的 sendRecordId

#### 实例代码

```js
wxPusher.queryMessage(1234567);
```

### 4、删除消息
deleteMessage(消息内容ID);

#### 参数说明

* 消息内容ID：发送消息接口返回的 messageContentId

#### 实例代码

```js
wxPusher.deleteMessage(1234567);
```

### 5、创建参数二维码
createQrcode(参数, 过期时间);

#### 参数说明

* 参数：二维码携带的参数，最长64位
* 过期时间：可选，二维码的有效期，默认30分钟，最长30天，单位是秒

#### 实例代码

```js
wxPusher.createQrcode("wxpusher");
wxPusher.createQrcode("wxpusher", 60);
```

### 6、查询扫码用户UID
queryUid(CODE参数);

#### 参数说明

* CODE参数：创建参数二维码接口返回的code参数

#### 实例代码

```js
wxPusher.queryUid("pYdrftbbT2zvrt4hJr2WGxaPon0mwyGoqsJ35KxHXKZJDzxBuT60ssGkkyl1wemG");
```

### 7、查询用户列表V2
queryUser(页码, 分页大小, 用户UID, 查询拉黑用户, 关注的类型)

#### 参数说明

* 查询用户、查询拉黑用户、指定关注类型都需要带上页码和分页大小
* 按顺序传参 可选参数传 null 即可

#### 实例代码

```js
// 查询所有用户 默认页码 1 默认分页大小 10
wxPusher.queryUser();
// 查询用户 UID_XXX 的信息
wxPusher.queryUser(1, 20, "UID_XXX");
// 查询拉黑用户 UID_YYY 的信息
wxPusher.queryUser(1, 20, "UID_YYY", true);
// 查询关注类型为 主题 的所有用户
wxPusher.queryUser(1, 10, null, false, 1);
```

### 8、删除用户
removeUser(用户ID)

#### 参数说明

* 用户ID：通过用户查询接口可以获取

#### 实例代码

```js
wxPusher.removeUser(12345);
```

### 9、拉黑/取消拉黑用户
rejectUser(用户ID)

acceptUser(用户ID)

#### 参数说明

* 用户ID：通过用户查询接口可以获取

#### 实例代码

```js
// 拉黑用户
wxPusher.rejectUser(12345);
// 取消拉黑用户
wxPusher.acceptUser(12345);
```

## 限制说明

- 消息发送，必须合法合规，发送违规违法欺诈等等非正常消息，可能被封号；
- WxPusher推送的是实时消息，时效性比较强，过期以后消息也就没有价值了，目前WxPusher会为你保留7天的数据 ，7天以后不再提供可靠性保证，会不定时清理历史消息；
- 单条消息的数据长度(字符数)限制是：content < 40000；summary < 20(微信的限制，大于20显示不完)；url<400；
- 单条消息最大发送UID的数量 < 2000，单条消息最大发送topicIds的数量 < 5；
- 单个微信用户，也就是单个UID，每天最多接收2000条消息，请合理安排发送频率；
- 发送消息，最大QPS不能超过1，比如最多连续10秒调用10次发送接口，超过这个限制会被系统拦截。



Author [@YoPlus][https://github.com/yoplus/wxpusher-sdk-node]

最后更新时间：2024.07.25