// In-memory mock for mongoose LootItem model
const crypto = require('crypto');

const items = [];

class LootItem {
  constructor(data) {
    this._id = crypto.randomBytes(16).toString('hex');
    this.id = this._id;
    this.name = data.name;
    this.rarity = data.rarity;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.stats = data.stats;
    this.createdAt = new Date();
  }

  async save() {
    items.push(this);
    return this;
  }
}

module.exports = LootItem;
