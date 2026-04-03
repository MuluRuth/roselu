// roselu — M-Pesa Payment Handler
// Include this in checkout.html

async function initiateMpesa() {
  const phoneInput = document.getElementById("phone-input");
  const payBtn = document.getElementById("pay-btn");
  const overlay = document.getElementById("mpesa-overlay");

  let phone = phoneInput.value.replace(/\s/g, "");

  // Validate
  if (phone.length < 9) {
    alert("Please enter a valid Safaricom number");
    return;
  }

  // Show loading on button
  payBtn.innerHTML = `<div style="width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite;margin:auto;"></div>`;
  payBtn.disabled = true;

  try {
    const response = await fetch("https://roselu.vercel.app/pay", { {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone,
        amount: 14850,
        orderRef: "RS-" + Math.floor(Math.random() * 9000 + 1000),
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Show waiting overlay
      document.getElementById("overlay-phone").textContent = "+254 " + phone;
      overlay.classList.add("show");

      // Poll for payment status every 3 seconds
      const checkoutId = data.data?.CheckoutRequestID;
      if (checkoutId) {
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          try {
           const statusRes = await fetch("https://roselu.vercel.app/status", { {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ checkoutRequestId: checkoutId }),
            });
            const statusData = await statusRes.json();
            if (statusData.ResultCode === 0) {
              clearInterval(poll);
              window.location.href = "confirmation.html";
            } else if (statusData.ResultCode !== undefined && statusData.ResultCode !== 1032) {
              clearInterval(poll);
              overlay.classList.remove("show");
              alert("Payment failed: " + statusData.ResultDesc);
              resetPayBtn();
            }
          } catch (e) { /* keep polling */ }
          if (attempts >= 10) {
            clearInterval(poll);
            // Timeout — redirect anyway for sandbox testing
            window.location.href = "confirmation.html";
          }
        }, 3000);
      } else {
        // Sandbox fallback
        setTimeout(() => { window.location.href = "confirmation.html"; }, 4000);
      }
    } else {
      alert("Payment error: " + (data.error?.errorMessage || "Please try again"));
      resetPayBtn();
    }
  } catch (error) {
    console.error("Payment error:", error);
    alert("Could not connect to payment server. Make sure your server is running.");
    resetPayBtn();
  }
}

function resetPayBtn() {
  const payBtn = document.getElementById("pay-btn");
  payBtn.innerHTML = `<span class="material-symbols-outlined">payments</span> Pay KSh 14,850 with M-PESA`;
  payBtn.disabled = false;
}

function cancelPayment() {
  document.getElementById("mpesa-overlay").classList.remove("show");
  resetPayBtn();
}