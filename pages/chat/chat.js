const { sendChatMessage } = require('../../utils/api');
const config = require('../../utils/config');

Page({
  data: {
    inputValue: '',
    loading: false,
    conversationId: '',
    messages: [],
    showDebug: config.showDebug
  },

  onLoad() {
    this.appendMessage({
      role: 'assistant',
      content: '你好！我是 Dify Agent 助手，有什么可以帮你？',
      references: []
    });
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  async sendMessage() {
    const content = this.data.inputValue.trim();
    if (!content || this.data.loading) {
      return;
    }

    this.appendMessage({ role: 'user', content, references: [] });
    this.setData({ inputValue: '', loading: true });

    try {
      const response = await sendChatMessage(content, this.data.conversationId);
      const reply = response.answer || response.message || '未收到回复。';
      const conversationId = response.conversation_id || this.data.conversationId;
      const references = this.extractReferences(response);

      this.setData({ conversationId });
      this.appendMessage({
        role: 'assistant',
        content: reply,
        references,
        rawPayload: this.data.showDebug ? response : null
      });
    } catch (error) {
      const errorText = error && error.data && error.data.message
        ? error.data.message
        : '请求失败，请检查网络或 API 配置。';

      this.appendMessage({
        role: 'assistant',
        content: errorText,
        references: [],
        rawPayload: this.data.showDebug ? error : null
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  appendMessage(message) {
    const updated = this.data.messages.concat({
      ...message,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      hasReferences: Array.isArray(message.references) && message.references.length > 0,
      debugText: message.rawPayload
        ? JSON.stringify(message.rawPayload, null, 2)
        : ''
    });
    this.setData({ messages: updated }, () => {
      this.scrollToBottom();
    });
  },

  scrollToBottom() {
    this.setData({
      scrollAnchor: `message-${this.data.messages.length - 1}`
    });
  },

  extractReferences(payload) {
    const metadata = payload.metadata || {};
    const candidates = [
      payload.references,
      metadata.references,
      metadata.sources,
      metadata.refs,
      metadata['retriever resources'],
      metadata.retriever_resources,
      metadata.retrieverResources
    ];

    const references = candidates.find((item) => Array.isArray(item) && item.length > 0);
    if (!references) {
      return [];
    }

    return references.map((item) => ({
      title: item.title
        || item.document_name
        || item.documentName
        || item.file_name
        || item.fileName
        || '未命名文件',
      url: item.url || item.source_url || item.sourceUrl || '',
      page: item.page || item.page_number || item.pageNumber || item.segment_position || ''
    }));
  }
});
