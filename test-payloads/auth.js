const crypto = require("crypto");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzM1bFJXbG5wQzhyN3JaMEdNTEx2VWUxNHloeiIsInVzZXJJZCI6IjY5MWZjZTRmYzk5YTFmYzQ5YTEwNDJiYyIsImVtYWlsIjoiZXRoYW5sZWU3NzMxNkBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImpvaG5wZWVuIiwiZGlzcGxheU5hbWUiOiJFdGhhbiBCdXJrZXR0Iiwicm9sZSI6InBsYXllciIsInR5cGUiOiJvYXV0aCIsInNjb3BlIjoidXNlcjpyZWFkOmVtYWlsIHVzZXI6c3RhdHMiLCJpYXQiOjE3NjM2OTUxNTksImV4cCI6MTc2NjI4NzE1OSwiYXVkIjoiaHlsYW5kaWEtY2xpZW50IiwiaXNzIjoiaHlsYW5kaWEtYmFja2VuZCJ9.KjgrbJgcGHr0scmv2zwb3FXawdT-gw_2pN1IaXXOlCc"; // Get from /api/v1/auth/token
const timestamp = Date.now();
const JWT_SECRET =
  "xUGakqSUgoA/9tRjo4MGpeQRjsMoHGSJOf9tFdO1+pd0shcrGsLK2sbFHSQHZXfUp7fBkyklWg6lhgrrKJCEoQ=="; // Same as in your .env

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
