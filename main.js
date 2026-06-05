const express = require("express");
const fs = require("fs");
const userController = require("./controller/user.controller");
const todoContoller = require("./controller/todo.controller");
const adminController = require("./controller/admin.controller");
const adminService = require("./model/admin.service");

const { router: authRoute } = require("./controller/auth.route");
const { DB } = require("./model/database");
const { authMiddleware } = require("./middlewares/auth.middleware");
const { adminMiddleware } = require("./middlewares/admin-jwt.middleware");
const { permissionMiddleware } = require("./middlewares/permission.middleware");

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

app.post("/super-admin-login", adminController.superAdminLogin);
app.post("/invite-admin", adminController.inviteAdmin);
app.put("/change-password", adminController.changePassword);
app.delete("/delete-user/:userId", permissionMiddleware, adminController.deleteUser);

app.post("/create-todo", authMiddleware, todoContoller.createTodo);
app.get("/get-todo", authMiddleware, todoContoller.getTodo);
app.put("/update-todo/:id", authMiddleware, todoContoller.updateTodo);
app.delete("/delete-todo/:id", authMiddleware, todoContoller.deleteTodo);

app.post("/send-otp", authMiddleware, userController.sendOtp);
app.post("/verify-email", userController.verifyEmail);
app.post("/change-email", authMiddleware, userController.updateEmail);
app.use("/auth", authRoute);

async function start() {
  await adminService.seedSuperAdmin();
}
start();

app.listen(PORT, () => {
  console.log(`✅ TODO server running at http://localhost:${PORT}`);
});
