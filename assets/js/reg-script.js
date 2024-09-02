document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registration-form");
  const personalInfo = document.getElementById("personal-info");
  const additionalInfo = document.getElementById("additional-info");
  const nextBtn = document.getElementById("next-btn");
  const backBtn = document.getElementById("back-btn");

  const emailInput = document.getElementById("email");
  const verifyEmailButton = document.getElementById("verify-email");
  const otpSection = document.querySelector(".otp-verification");
  const otpInput = document.getElementById("otp");
  const verifyOtpButton = document.getElementById("verify-otp");
  const verificationMessage = document.getElementById("verification-message");

  // Initialize intl-tel-input
  const phoneInput = document.getElementById("phone");
  let iti;

  // Check if intlTelInput is available
  if (window.intlTelInput) {
      iti = window.intlTelInput(phoneInput, {
          utilsScript:
              "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
          separateDialCode: true,
          preferredCountries: ["in"],
      });
  } else {
      console.warn(
          "intl-tel-input library is not loaded. Phone number validation will not be available."
      );
  }

  const graduationYearSelect = document.getElementById("graduation-year");
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1960; year--) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      graduationYearSelect.appendChild(option);
  }

  verifyEmailButton.addEventListener("click", function () {
      const email = emailInput.value.trim();
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          verificationMessage.textContent =
              "OTP sent to your email. Please check and enter below.";
          verificationMessage.classList.remove("alert-danger");
          verificationMessage.classList.add("alert-success");
          verificationMessage.style.display = "block";
          otpSection.style.display = "flex";
          emailInput.disabled = true;
          verifyEmailButton.disabled = true;
      } else {
          emailInput.classList.add("is-invalid");
      }
  });

  verifyOtpButton.addEventListener("click", function () {
      const otp = otpInput.value.trim();
      if (otp && otp.length === 6) {
          verificationMessage.textContent = "Email verified successfully!";
          verificationMessage.classList.remove("alert-danger");
          verificationMessage.classList.add("alert-success");
          verificationMessage.style.display = "block";
          personalInfo.style.display = "block";
          otpInput.disabled = true;
          verifyOtpButton.disabled = true;
      } else {
          otpInput.classList.add("is-invalid");
      }
  });

  nextBtn.addEventListener("click", function () {
      if (form.checkValidity()) {
          personalInfo.style.display = "none";
          additionalInfo.style.display = "block";
      } else {
          form.classList.add("was-validated");
      }
  });

  backBtn.addEventListener("click", function () {
      additionalInfo.style.display = "none";
      personalInfo.style.display = "block";
  });

  const guestCounters = document.querySelectorAll(".guest-counter");
  guestCounters.forEach((counter) => {
      const decreaseBtn = counter.querySelector('[data-action="decrease"]');
      const increaseBtn = counter.querySelector('[data-action="increase"]');
      const countSpan = counter.querySelector("span");

      decreaseBtn.addEventListener("click", () =>
          updateGuestCount(countSpan, -1)
      );
      increaseBtn.addEventListener("click", () => updateGuestCount(countSpan, 1));
  });

  const contributionInput = document.getElementById("contribution");
  const registrationFee = document.getElementById("registration-fee");
  const guestFees = document.getElementById("guest-fees");
  const contributionAmount = document.getElementById("contribution-amount");
  const totalAmount = document.getElementById("total-amount");

  contributionInput.addEventListener("input", updateTotalAmount);

  function updateGuestCount(span, delta) {
      const currentCount = parseInt(span.textContent);
      const newCount = Math.max(0, currentCount + delta);
      span.textContent = newCount;
      updateTotalAmount();
  }

  function updateTotalAmount() {
      const guestCount = Array.from(
          document.querySelectorAll(".guest-counter span")
      ).reduce((sum, span) => sum + parseInt(span.textContent), 0);
      guestFees.textContent = guestCount * 500;
      contributionAmount.textContent = contributionInput.value;
      totalAmount.textContent =
          parseInt(registrationFee.textContent) +
          parseInt(guestFees.textContent) +
          parseInt(contributionAmount.textContent);
  }

  form.addEventListener("submit", function (event) {
      if (!form.checkValidity() || (iti && !iti.isValidNumber())) {
          event.preventDefault();
          event.stopPropagation();
          form.classList.add("was-validated");
          if (iti && !iti.isValidNumber()) {
              phoneInput.classList.add("is-invalid");
          } else {
              phoneInput.classList.remove("is-invalid");
          }
      }
  });
});
