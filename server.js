const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const DEMO_USER = { email: "demo@example.com", password: "secret123" };

function requireAuth(req, res, next) {
  if (req.cookies.auth === "true") return next();
  return res.redirect("/?error=Please+log+in");
}

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    res.cookie("auth", "true", { httpOnly: true, sameSite: "Lax" });
    return res.redirect("/dashboard.html");
  }
  return res.redirect("/?error=Invalid+credentials");
});

app.post("/logout", (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

app.get("/dashboard.html", requireAuth, (req, res, next) => next());

app.listen(PORT, () => {
  console.log(`✅ One-pager running at http://localhost:${PORT}`);
});