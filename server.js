const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// USERS
let users = [
  { id_no: "admin", password: "", role: "admin", status: "approved", branch: "CSE" }
];

// RESOURCES
let resources = {
  CSE: [],
  ECE: [],
  EEE: [],
  AIDS: [],
  CSIT: []
};

// SET ADMIN PASSWORD
(async () => {
  users[0].password = await bcrypt.hash("admin123", 10);
})();

// SIGNUP
app.post("/signup", async (req, res) => {
  const { id_no, password, branch } = req.body;

  const hash = await bcrypt.hash(password, 10);

  users.push({
    id_no,
    password: hash,
    branch,
    status: "pending",
    role: "user"
  });

  res.send("Signup done. Wait for approval.");
});

// LOGIN
app.post("/login", async (req, res) => {
  const { id_no, password } = req.body;

  const user = users.find(u => u.id_no === id_no);
  if (!user) return res.send("User not found");

  if (user.status !== "approved") {
    return res.send("Not approved yet");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Wrong password");

  res.json(user);
});

// APPROVE USER
app.post("/approve", (req, res) => {
  const { id_no } = req.body;

  const user = users.find(u => u.id_no === id_no);
  if (!user) return res.send("User not found");

  user.status = "approved";
  res.send("Approved");
});

// ADD RESOURCE
app.post("/add-resource", (req, res) => {
  const { branch, title, link } = req.body;

  resources[branch].push({ title, link });
  res.send("Added");
});

// GET RESOURCES
app.get("/resources/:branch", (req, res) => {
  res.json(resources[req.params.branch]);
});

app.listen(PORT, () => console.log("Server running"));
