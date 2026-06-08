// Background Service Worker
// Handles Discord API communication and storage

class DiscordIntegration {
  constructor() {
    this.discordToken = null;
    this.isPremium = false;
    this.initListeners();
    this.loadSettings();
  }

  initListeners() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep channel open for async response
    });
  }

  async loadSettings() {
    const settings = await chrome.storage.sync.get(['discordToken', 'isPremium']);
    this.discordToken = settings.discordToken || null;
    this.isPremium = settings.isPremium || false;
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.type) {
        case 'setToken':
          await this.setDiscordToken(request.token);
          sendResponse({ success: true });
          break;

        case 'getToken':
          sendResponse({ token: this.discordToken });
          break;

        case 'getPremiumStatus':
          sendResponse({ isPremium: this.isPremium });
          break;

        case 'setPremiumStatus':
          await this.setPremiumStatus(request.status);
          sendResponse({ success: true });
          break;

        case 'getUserInfo':
          const userInfo = await this.fetchDiscordAPI('/users/@me');
          sendResponse(userInfo);
          break;

        case 'getServers':
          const servers = await this.fetchDiscordAPI('/users/@me/guilds');
          sendResponse(servers);
          break;

        case 'getChannels':
          const channels = await this.fetchDiscordAPI(`/guilds/${request.guildId}/channels`);
          sendResponse(channels);
          break;

        case 'getMessages':
          const messages = await this.fetchDiscordAPI(`/channels/${request.channelId}/messages?limit=50`);
          sendResponse(messages);
          break;

        case 'sendMessage':
          if (!this.isPremium) {
            sendResponse({ error: 'Premium feature required' });
            break;
          }
          const result = await this.sendDiscordMessage(request.channelId, request.content);
          sendResponse(result);
          break;

        case 'getNotifications':
          const notifications = await this.getUnreadMessages();
          sendResponse(notifications);
          break;

        default:
          sendResponse({ error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ error: error.message });
    }
  }

  async setDiscordToken(token) {
    this.discordToken = token;
    await chrome.storage.sync.set({ discordToken: token });
  }

  async setPremiumStatus(status) {
    this.isPremium = status;
    await chrome.storage.sync.set({ isPremium: status });
  }

  async fetchDiscordAPI(endpoint, options = {}) {
    if (!this.discordToken) {
      throw new Error('Discord token not set');
    }

    const defaultOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.discordToken}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch(`https://discord.com/api/v10${endpoint}`, {
      ...defaultOptions,
      ...options
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.statusText}`);
    }

    return await response.json();
  }

  async sendDiscordMessage(channelId, content) {
    return this.fetchDiscordAPI(`/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }

  async getUnreadMessages() {
    try {
      const userInfo = await this.fetchDiscordAPI('/users/@me');
      const servers = await this.fetchDiscordAPI('/users/@me/guilds');
      
      const unreadMessages = [];
      
      for (const server of servers.slice(0, 5)) {
        const channels = await this.fetchDiscordAPI(`/guilds/${server.id}/channels`);
        
        for (const channel of channels) {
          if (channel.type === 0) { // Text channel
            try {
              const messages = await this.fetchDiscordAPI(`/channels/${channel.id}/messages?limit=1`);
              if (messages.length > 0) {
                unreadMessages.push({
                  server: server.name,
                  channel: channel.name,
                  message: messages[0].content,
                  author: messages[0].author.username,
                  timestamp: messages[0].timestamp
                });
              }
            } catch (e) {
              console.log(`Cannot access channel ${channel.name}`);
            }
          }
        }
      }
      
      return unreadMessages;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }
}

// Initialize
const discordIntegration = new DiscordIntegration();
