const crypto = require("crypto");

const token = ""; // Get from /api/v1/auth/token
const timestamp = Date.now();
const JWT_SECRET = "jwt-secret-from-env";

const data = `${token}:${timestamp}`;
const signature = crypto
  .createHmac("sha256", JWT_SECRET)
  .update(data)
  .digest("hex");

console.log(
  JSON.stringify(
    {
      t: "auth",
      evt: "login",
      data: {
        token,
        timestamp,
        signature,
      },
    },
    null,
    2
  )
);
