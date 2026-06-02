class UserModel {
  constructor(id, name, email, password, createdAt,status) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.status = status;
  }
}

module.exports = UserModel;
