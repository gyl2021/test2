const config = require('./config');

const request = (options = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}${options.url}`,
      method: options.method || 'POST',
      data: options.data || {},
      timeout: options.timeout || 30000,
      header: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject({
          ...err,
          tip: '请检查小程序 request 合法域名、HTTPS 配置和当前网络状态'
        });
      }
    });
  });
};

const sendChatMessage = (message, conversationId) => {
  return request({
    url: '/chat-messages',
    data: {
      inputs: {},
      query: message,
      response_mode: 'blocking',
      conversation_id: conversationId || undefined,
      user: config.user
    }
  });
};

module.exports = {
  sendChatMessage
};
