const whatsappNumber = "919734075801"

function trackSection(section) {
  trackEvent(`Clicked Section: ${section}`);
}

// Order card tabs: "tomorrow" | "occasion"
function showOrderTab(tab) {
  document.querySelectorAll(".tab").forEach(btn => {
    const active = btn.dataset.tab === tab;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active);
  });
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.hidden = panel.dataset.panel !== tab;
  });
}

// Pre-booking only makes sense from tomorrow onwards
const occDate = document.getElementById("occDate");
if (occDate) {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  occDate.min = tomorrow.toLocaleDateString("en-CA"); // YYYY-MM-DD, local time
}


document.getElementById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const shop = document.getElementById("shop")?.value.trim() || ""; // optional field
  const pieces = document.getElementById("pieces").value.trim();
  const kg = document.getElementById("kg").value.trim();
  const product = document.getElementById("product")?.value.trim() || ""; // optional

  const qtyError = document.getElementById("qtyError");
  qtyError.hidden = Boolean(kg || pieces);
  if (!kg && !pieces) return;

  // Build quantity text dynamically
  let qtyText = "";
  if (pieces) qtyText = `${pieces} pieces`;
  if (kg) qtyText = `${kg} kg`;
  if (pieces && kg) qtyText = `${pieces} pieces and ${kg} kg`;

  const message =
    `Hello, I am ${name}. ` +
    `I want to order ${qtyText}${product ? " of " + product : ""}.`;
    trackEvent(`Clicked Order Online: ${message}`)

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
});

function shareOnWhatsAppEnglish() {
  trackEvent("Click: Refer English Whatsapp");
const text = `Hi! If you're looking for a reliable fresh-chicken supplier for your shop, Mondal Brothers is a name you can trust.
You get good quality, fair prices, and on-time delivery - every day!
Computerised accounting, transaction messages, and statements - everything is at your fingertips.
Definitely try them out!

Mondal Brothers
Contact: 9734075801
Website: https://tinyurl.com/mondalbros`;

  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function shareViaNativeEnglish() {
  trackEvent("Click: Refer English Native");
  const shareData = {
    title: "Mondal Brothers",
    text: `Hi! If you're looking for a reliable fresh-chicken supplier for your shop, Mondal Brothers is a name you can trust.
You get good quality, fair prices, and on-time delivery - every day!
Computerised accounting, transaction messages, and statements - everything is at your fingertips.
Definitely try them out!

Mondal Brothers
Contact: 9734075801
Website: https://tinyurl.com/mondalbros`
  };

  if (navigator.share) {
    navigator.share(shareData);
  } else {
    alert("Sharing not supported on this device. Try using WhatsApp Share button.");
  }
}

function shareOnWhatsAppBengali() {
  trackEvent("Click: Refer Bengali Whatsapp");
const text = `দোকানের জন্য নির্ভরযোগ্য ফ্রেশ চিকেন সাপ্লায়ার চাইলে মন্ডল ব্রাদার্স ভরসাযোগ্য।
ভালো কোয়ালিটি, ঠিক দাম, সময়মতো ডেলিভারি।
কম্পিউটারাইজড হিসাব, লেনদেনের মেসেজ, আর স্টেটমেন্ট—সবকিছুই আপনার হাতে।

মন্ডল ব্রাদার্স
Contact: 9734075801
Website: https://tinyurl.com/mondalbros`;

  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function shareViaNativeBengali() {
  trackEvent("Click: Refer Bengali Native");
  const shareData = {
    title: "Mondal Brothers",
    text: `দোকানের জন্য নির্ভরযোগ্য ফ্রেশ চিকেন সাপ্লায়ার চাইলে মন্ডল ব্রাদার্স ভরসাযোগ্য।
ভালো কোয়ালিটি, ঠিক দাম, সময়মতো ডেলিভারি।
কম্পিউটারাইজড হিসাব, লেনদেনের মেসেজ, আর স্টেটমেন্ট—সবকিছুই আপনার হাতে।

মন্ডল ব্রাদার্স
Contact: 9734075801
Website: https://tinyurl.com/mondalbros`
  };

  if (navigator.share) {
    navigator.share(shareData);
  } else {
    alert("Sharing not supported on this device. Try using WhatsApp Share button.");
  }
}

function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).innerText;
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied: ${text}`);
        });
}

function showToast(message) {
  const toast = document.getElementById("copyToast");
  toast.innerText = message;  // Use innerText to avoid issues
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}


document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".copyable").forEach(item => {
    item.addEventListener("click", () => {
      const text = item.textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: ${text}`);
      });
    });
  });
});


// Auto-generate UPI deep link from entered amount
function openUPILink() {
    payViaUpiSmart()

//  const amountField = document.getElementById("amt");
//  const amount = amountField.value.trim();
//  const upiId = "prsnmondal@ybl";
//  const name = encodeURIComponent("Prasun Mondal");
//  const note = encodeURIComponent("Paying Mondal Brothers");
//
//  trackEvent(`Clicked: Pay via UPI: ${amount}`)
//
//  // If no amount, create URL without am parameter
//  let url = `upi://pay?pa=${upiId}&pn=${name}&cu=INR&tn=${note}`;
//
// const upiUrl =
//        `upi://pay` +
//        `?pa=${encodeURIComponent(upiId)}` +
//        `&pn=${encodeURIComponent(payeeName)}` +
//        `&am=${amount}` +
//        `&cu=INR` +
//        `&tn=${encodeURIComponent(note)}`;
//  // If valid amount added, include am parameter
//  if (amount && !isNaN(amount) && Number(amount) > 0) {
//    url += `&am=${amount}`;
//  }
//
//  window.location.href = url;
}

function payViaUpiSmart() {
    const upiId = "prsnmondal@ybl";
    const payeeName = "Prasun Mondal";
    const note = "Payment to Mondal Brothers";

    const amountVal = Number(document.getElementById("amt")?.value);

    let upiUrl =
        `upi://pay` +
        `?pa=${encodeURIComponent(upiId)}` +
        `&pn=${encodeURIComponent(payeeName)}` +
        `&cu=INR` +
        `&tn=${encodeURIComponent(note)}`;

    // Amount OPTIONAL
    if (amountVal && amountVal > 0) {
        if (amountVal > 100000) {
            alert("UPI limit is ₹1,00,000. Please split payment.");
            return;
        }
        upiUrl += `&am=${amountVal.toFixed(2)}`;
    }

    // Try opening UPI
    window.location.href = upiUrl;

    // Fallback message (for desktop / no UPI apps)
    setTimeout(() => {
        alert("If UPI app did not open, please pay manually using your UPI app.");
    }, 1200);
}

// Pre-Order
function sendOccasionBooking() {
    const name  = document.getElementById("occName").value.trim();
    const title = document.getElementById("occTitle").value.trim();
    const date  = document.getElementById("occDate").value.trim();
    const qty   = document.getElementById("occQty").value.trim();

    let lines = [];
    lines.push("🎉 Occasion Pre-Booking Request\n");

    if (name)  lines.push(`Name: ${name}`);
    if (title) lines.push(`Occasion: ${title}`);
    if (date)  lines.push(`Date: ${date}`);
    if (qty)   lines.push(`Quantity: ${qty} Kg`);

    lines.push("\nPlease confirm availability 😊");

    const text = lines.join("\n");

    trackEvent(`Prebooking: ${text}`)

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
}
