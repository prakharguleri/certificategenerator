const bcrypt = require("bcryptjs");

const plainPassword = "password123";
const hashedPassword = "$2a$10$7YYmZjsdsr.8W10JrLbRKuqt27z3eND8NPt7gZAHswbG3oJf8or7S";

bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
  console.log("✅ Match:", result); // Should print true
});
