const config = require('./config');

const request = (options = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}${options.url}`,
      method: options.method || 'POST',
      data: options.data || {},
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
      fail: reject
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
