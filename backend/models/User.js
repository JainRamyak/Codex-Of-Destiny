// In-memory mock for mongoose User model
const crypto = require('crypto');

const users = [];

class User {
  constructor(data) {
    this._id = crypto.randomBytes(16).toString('hex');
    this.id = this._id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.inventory = data.inventory || [];
  }

  static async findOne(query) {
    return users.find(u => u.email === query.email) || null;
  }

  static async findById(id) {
    return users.find(u => u.id === id) || null;
  }

  async save() {
    const existing = users.findIndex(u => u.id === this.id);
    if (existing > -1) {
      users[existing] = this;
    } else {
      users.push(this);
    }
    return this;
  }
}

module.exports = User;
