const axios = require('axios');

class WxPusher {

  constructor(appToken) {
    this.appToken = appToken; // 应用的appToken
    this.baseUrl = `https://wxpusher.zjiecode.com`; // 接口域名
    this.sendMessageUrl = `${this.baseUrl}/api/send/message`; // 发送/删除消息
    this.sendQueryMessageUrl = `${this.baseUrl}/api/send/query/status`; //查询状态
    this.funCreateQrcodeUrl = `${this.baseUrl}/api/fun/create/qrcode`; // 创建参数二维码
    this.funScanQrcodeUidUrl = `${this.baseUrl}/api/fun/scan-qrcode-uid`; // 查询扫码用户UID
    this.funWxuserUrl = `${this.baseUrl}/api/fun/wxuser/v2`; // 查询用户列表V2
    this.funRemoveUrl = `${this.baseUrl}/api/fun/remove`; // 删除用户
    this.funRejectUrl = `${this.baseUrl}/api/fun/reject`; // 拉黑用户
  }

  /*
    接口文档：https://wxpusher.zjiecode.com/docs
  */

  // 发送消息(POST)
  async sendMessage(...args) {
    // 默认值
    let content = "Hello WxPusher";
    let summary = null;
    let contentType = 1;
    let topicIds = [];
    let uids = [];
    let url = null;
    let verifyPayType = 0;

    // 处理参数
    const strings = args.filter(arg => typeof arg === 'string');
    const arrays = args.filter(arg => Array.isArray(arg));
    const numbers = args.filter(arg => typeof arg === 'number');

    // 辅助函数：检查是否为有效的 URL
    function isUrl(str) {
      try {
        new URL(str);
        return true;
      } catch {
        return false;
      }
    }

    // 处理字符串参数
    if (strings.length === 3) {
      [content, summary, url] = strings;
    } else if (strings.length === 2) {
      content = strings[0];
      url = isUrl(strings[1]) ? strings[1] : summary;
    } else if (strings.length === 1) {
      content = strings[0];
    }

    // 处理数组参数
    if (arrays.length === 1) {
      const arr = arrays[0];
      uids = arr.filter(item => typeof item === 'string' && item.startsWith('UID_'));
      topicIds = arr.filter(item => typeof item === 'number');
    } else if (arrays.length === 2) {
      const [firstArray, secondArray] = arrays;
      uids = firstArray.filter(item => typeof item === 'string' && item.startsWith('UID_'));
      topicIds = secondArray.filter(item => typeof item === 'number');
    }

    // 处理数字参数
    if (numbers.length === 1) {
      contentType = numbers[0];
    } else if (numbers.length === 2) {
      [contentType, verifyPayType] = numbers;
    }

    const params = {
      appToken: this.appToken,
      content, // 内容
      summary, // 消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度20(微信只能显示20)，可以不传，不传默认截取content前面的内容。
      contentType, // 内容类型 1表示文字 2表示html(只发送body标签内部的数据即可，不包括body标签，推荐使用这种) 3表示markdown
      topicIds, // 发送目标的topicId，是一个数组！！！也就是群发，使用uids单发的时候，可以不传。
      uids, // 发送目标的UID，是一个数组。注意uids和topicIds可以同时填写，也可以只填写一个。
      url, // 原文链接，可选参数
      verifyPayType // 是否验证订阅时间 0：不验证 1：只发送给付费的用户 2：只发送给未订阅或者订阅过期的用户
    };

    try {
      const response = await axios.post(this.sendMessageUrl, params, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data || null;
    } catch (error) {
      return { success: false, error: error.message };
    }

  }

  // 发送消息(GET)
  async quickSend(...args) {
    // 默认值
    let content = "Hello WxPusher";
    let uid = null;
    let topicId = null;
    let url = null;
    let verifyPayType = 0;

    // 处理参数
    const strings = args.filter(arg => typeof arg === 'string');
    const numbers = args.filter(arg => typeof arg === 'number');

    // 辅助函数：检查是否为有效的 URL
    function isUrl(str) {
      try {
        new URL(str);
        return true;
      } catch {
        return false;
      }
    }

    // 处理字符串参数
    if (strings.length === 1) {
      content = strings[0];
    } else if (strings.length === 2) {
      content = strings[0];
      const secondStr = strings[1];
      if (isUrl(secondStr)) {
        url = secondStr;
      } else if (secondStr.startsWith('UID_')) {
        uid = secondStr;
      } else {
        topicId = secondStr;
      }
    } else if (strings.length === 3) {
      content = strings[0];
      const secondStr = strings[1];
      url = strings[2];
      if (secondStr.startsWith('UID_')) {
        uid = secondStr;
      } else {
        topicId = secondStr;
      }
    }

    // 处理数字参数
    if (numbers.length === 1) {
      verifyPayType = numbers[0];
    }

    const params = {
      appToken: this.appToken,
      content, // 内容
      topicId, // 发送目标的topicId，是一个字符串。
      uid, // 发送目标的UID，是一个字符串。注意uid和topicId只填写一个。
      url, // 原文链接，可选参数
      verifyPayType // 是否验证订阅时间 0：不验证 1：只发送给付费的用户 2：只发送给未订阅或者订阅过期的用户
    };

    try {
      const response = await axios.get(this.sendMessageUrl, { params });
      return response.data || null;
    } catch (error) {
      return { success: false, error: error.message };
    }

  }

  // 查询状态
  async queryMessage(sendRecordId) {
    const params = {
      sendRecordId // 发送消息接口返回的发送id，对应给一个uid或者topic的发送id
    };
    try {
      const response = await axios.get(this.sendQueryMessageUrl, { params });
      return response.data || null;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 删除消息
  async deleteMessage(messageContentId) {
    const params = {
      appToken: this.appToken,
      messageContentId // 发送接口返回的消息内容id，调用一次接口生成一个，如果是发送给多个用户，多个用户共享一个messageContentId，通过messageContentId可以删除内容，删除后本次发送的所有用户都无法再查看本条消息
    };
    try {
      const response = await axios.delete(this.sendMessageUrl, { params });
      return response.data || null;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 创建参数二维码
  async createQrcode(extra, validTime) {
    const params = {
      appToken: this.appToken,
      extra, //必填，二维码携带的参数，最长64位
      validTime //可选，二维码的有效期，默认30分钟，最长30天，单位是秒
    };
    try {
      const response = await axios.post(this.funCreateQrcodeUrl, params, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data || null;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 查询扫码用户UID
  async queryUid(code) {
    const params = {
      code // 创建参数二维码接口返回的code参数。
    };
    try {
      const response = await axios.get(this.funScanQrcodeUidUrl, { params });
      return response.data || null;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 查询用户列表V2
  async queryUser(page, pageSize, uid = null, isBlock = null, type = null) {
    const params = {
      appToken: this.appToken,
      page, // 请求数据的页码
      pageSize, // 分页大小，不能超过100，默认10
      uid, // 用户的uid，可选，如果不传就是查询所有用户，传uid就是查某个用户的信息
      isBlock, // 查询拉黑用户，可选，不传查询所有用户，true查询拉黑用户，false查询没有拉黑的用户
      type // 关注的类型，可选，不传查询所有用户，0是应用，1是主题
    };
    try {
      const response = await axios.get(this.funWxuserUrl, { params });
      return response.data || null;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  //删除用户
  async removeUser(id) {
    const params = {
      appToken: this.appToken,
      id: id, //用户id，通过用户查询接口可以获取
    };

    try {
      const response = await axios.delete(this.funRemoveUrl, { params });
      return response.data || null;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  //拉黑用户
  async rejectUser(id) {
    const params = {
      appToken: this.appToken,
      id: id, // 用户id，通过用户查询接口可以获取
      reject: true
    };

    try {
      const response = await axios.put(this.funRejectUrl, null, { params });
      return response.data || null;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  //取消拉黑用户
  async acceptUser(id) {
    const params = {
      appToken: this.appToken,
      id: id, // 用户id，通过用户查询接口可以获取
      reject: false
    };

    try {
      const response = await axios.put(this.funRejectUrl, null, { params });
      return response.data || null;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

}

module.exports = WxPusher;
