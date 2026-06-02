class TodoModel {
  constructor(id, title, description, createdAt, userId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = createdAt;
    this.userId = userId;
  }
}

module.exports = TodoModel;