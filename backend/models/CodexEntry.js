// In-memory mock for mongoose CodexEntry model
const crypto = require('crypto');

const entries = [
  { _id: '1', id: '1', title: 'The Fall of Arcania', summary: 'The beginning of the end for the crystal mages.', content: 'Full lore goes here.', tags: ['Lore', 'History'], image: '../assets/images/knights.jpg', createdAt: new Date() },
  { _id: '2', id: '2', title: 'Beasts of the Void', summary: 'A comprehensive bestiary of the voidborn creatures.', content: 'Full lore goes here.', tags: ['Bestiary', 'Danger'], image: '../assets/images/beast.jpg', createdAt: new Date() },
  { _id: '3', id: '3', title: 'Secrets of the Alchemist', summary: 'Forbidden potions and their disastrous effects.', content: 'Full lore goes here.', tags: ['Magic', 'Crafting'], image: '../assets/images/alchemist.jpg', createdAt: new Date() },
  { _id: '4', id: '4', title: 'The Lost Elven City', summary: 'Ruins that hold the key to the ancient prophecies.', content: 'Full lore goes here.', tags: ['Lore', 'Exploration'], image: '../assets/images/elf.jpg', createdAt: new Date() }
];

class CodexEntry {
  constructor(data) {
    this._id = crypto.randomBytes(16).toString('hex');
    this.id = this._id;
    this.title = data.title;
    this.summary = data.summary;
    this.content = data.content;
    this.tags = data.tags || [];
    this.image = data.image;
    this.author = data.author;
    this.createdAt = new Date();
  }

  static find() {
    return {
      sort: () => Promise.resolve([...entries].sort((a,b) => b.createdAt - a.createdAt))
    };
  }

  static async findById(id) {
    return entries.find(e => e.id === id) || null;
  }

  static async findByIdAndDelete(id) {
    const idx = entries.findIndex(e => e.id === id);
    if (idx > -1) entries.splice(idx, 1);
  }

  async save() {
    entries.push(this);
    return this;
  }
}

module.exports = CodexEntry;
