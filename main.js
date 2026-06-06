const express = require("express");
const fs = require("fs");
const adminService = require("./model/admin.service");
const { router: authRoute } = require("./controller/auth.route");
const { router: todoRoute } = require("./controller/todo.route");
const { router: adminRoute } = require("./controller/admin.route");

const { DB } = require("./model/database");

process.loadEnvFile("./.env");
console.log("secret:", process.env.JWT_SECRET);
console.log("gmail user:", process.env.GMAIL_USER);
console.log(process.env.DB_PASSWORD);

const PORT = process.env.PORT;
if (PORT === undefined) {
  throw new Error("PORT is not provided");
}
const app = express();
const db = DB.create();

// db.connect({
//   host: "localhost",
//   user: "postgres",
//   password: "",
//   database: "todo_db",
//   port: 5432,
// });


db.connect({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

// middleware
app.use(express.json());


app.use("/auth", authRoute);
app.use("/todos", todoRoute);
app.use("/admins", adminRoute);

async function start() {
  await adminService.seedSuperAdmin();
}
start();

app.listen(PORT, () => {
  console.log(`✅ TODO server running at http://localhost:${PORT}`);
});
