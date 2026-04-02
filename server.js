const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // serve your HTML files

const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  SHORTCODE,
  PASSKEY,
  CALLBACK_URL,
  PORT = 3000,
} = process.env;

// ── 1. GET ACCESS TOKEN ──────────────────────────────────
async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return response.data.access_token;
}

// ── 2. STK PUSH ──────────────────────────────────────────
app.post("/pay", async (req, res) => {
  const { phone, amount, orderRef } = req.body;

  // Validate phone number
  if (!phone || !amount) {
    return res.status(400).json({ error: "Phone and amount are required" });
  }

  // Format phone: remove leading 0 or + and add 254
  let formattedPhone = phone.replace(/\s/g, "").replace(/\D/g, "");
if (formattedPhone.startsWith("0")) formattedPhone = "254" + formattedPhone.slice(1);
if (formattedPhone.startsWith("7") || formattedPhone.startsWith("1")) formattedPhone = "254" + formattedPhone;
if (formattedPhone.startsWith("+")) formattedPhone = formattedPhone.slice(1);

  try {
    const token = await getAccessToken();

    // Generate timestamp
    const now = new Date();
    const timestamp =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    // Generate password
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: CALLBACK_URL,
        AccountReference: orderRef || "RoseluOrder",
        TransactionDesc: "roselu Eyewear Payment",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("STK Push sent:", stkResponse.data);
    res.json({
      success: true,
      message: "STK Push sent! Check your phone.",
      data: stkResponse.data,
    });
  } catch (error) {
    console.error("STK Push error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || "Payment failed. Please try again.",
    });
  }
});

// ── 3. CALLBACK (Safaricom sends result here) ────────────
app.post("/callback", (req, res) => {
  const callbackData = req.body;
  console.log("M-Pesa Callback received:", JSON.stringify(callbackData, null, 2));

  const stkCallback = callbackData?.Body?.stkCallback;
  const resultCode = stkCallback?.ResultCode;
  const resultDesc = stkCallback?.ResultDesc;

  if (resultCode === 0) {
    // Payment successful
    const metadata = stkCallback.CallbackMetadata.Item;
    const amount = metadata.find((i) => i.Name === "Amount")?.Value;
    const mpesaCode = metadata.find((i) => i.Name === "MpesaReceiptNumber")?.Value;
    const phone = metadata.find((i) => i.Name === "PhoneNumber")?.Value;
    console.log(`✅ Payment SUCCESS — KSh ${amount} from ${phone} — Receipt: ${mpesaCode}`);
  } else {
    console.log(`❌ Payment FAILED — ${resultDesc}`);
  }

  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});

// ── 4. CHECK TRANSACTION STATUS ──────────────────────────
app.post("/status", async (req, res) => {
  const { checkoutRequestId } = req.body;
  try {
    const token = await getAccessToken();
    const now = new Date();
    const timestamp =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || "Status check failed" });
  }
});

// ── 5. TEST ROUTE ────────────────────────────────────────
app.get("/test", async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ success: true, message: "M-Pesa connection working!", token: token.slice(0, 20) + "..." });
  } catch (error) {
    res.status(500).json({ success: false, error: "Connection failed. Check your credentials." });
  }
});

// ── START SERVER ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ✅ roselu server running!
  🌍 Local:    http://localhost:${PORT}
  🏪 Store:    http://localhost:${PORT}/index.html
  🔧 Test:     http://localhost:${PORT}/test
  💳 Pay:      POST http://localhost:${PORT}/pay
  `);
});