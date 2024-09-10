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

    // Initialize intl-tel-input for phone number formatting
    const phoneInput = document.getElementById("phone");
    let iti;

    if (window.intlTelInput) {
        iti = window.intlTelInput(phoneInput, {
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
            separateDialCode: true,
            preferredCountries: ["in"],
        });
    } else {
        console.warn("intl-tel-input library is not loaded. Phone number validation will not be available.");
    }

    // Populate the graduation year dropdown with values from the current year down to 1960
    const graduationYearSelect = document.getElementById("graduation-year");
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1960; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        graduationYearSelect.appendChild(option);
    }

    // Handle email verification
    verifyEmailButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            verificationMessage.textContent = "OTP sent to your email. Please check and enter below.";
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

    // Handle OTP verification
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

    // Proceed to additional information section
    nextBtn.addEventListener("click", function () {
        if (form.checkValidity()) {
            personalInfo.style.display = "none";
            additionalInfo.style.display = "block";
        } else {
            form.classList.add("was-validated");
        }
    });

    // Go back to the personal information section
    backBtn.addEventListener("click", function () {
        additionalInfo.style.display = "none";
        personalInfo.style.display = "block";
    });

    // Guest counter functionality for spouse/companion, children above 12, and children below 12
    const guestCounters = document.querySelectorAll(".guest-counter");
    guestCounters.forEach((counter) => {
        const decreaseBtn = counter.querySelector('[data-action="decrease"]');
        const increaseBtn = counter.querySelector('[data-action="increase"]');
        const countSpan = counter.querySelector("span");

        decreaseBtn.addEventListener("click", () => updateGuestCount(countSpan, -1));
        increaseBtn.addEventListener("click", () => updateGuestCount(countSpan, 1));
    });

    // Update contribution and total amount calculations
    const contributionInput = document.getElementById("contribution");
    const registrationFee = document.getElementById("registration-fee");
    const spouseFees = document.getElementById("spouse-fees");
    const childrenAbove12Fees = document.getElementById("children-above-12-fees");
    const childrenBelow12Fees = document.getElementById("children-below-12-fees");
    const contributionAmount = document.getElementById("contribution-amount");
    const totalAmount = document.getElementById("total-amount");

    contributionInput.addEventListener("input", updateTotalAmount);

    function updateGuestCount(span, delta) {
        const currentCount = parseInt(span.textContent);
        const newCount = Math.max(0, currentCount + delta);
        span.textContent = newCount;
        updateTotalAmount();
    }

    // Calculate and update the total amount dynamically
    function updateTotalAmount() {
        const spouseCount = parseInt(document.getElementById("spouse-count").textContent) || 0;
        const childrenAbove12Count = parseInt(document.getElementById("children-above-12-count").textContent) || 0;
        const childrenBelow12Count = parseInt(document.getElementById("children-below-12-count").textContent) || 0;

        const spouseTotal = spouseCount * 5000;
        const childrenAbove12Total = childrenAbove12Count * 3000;
        const childrenBelow12Total = childrenBelow12Count * 0; // Children below 12 are free

        spouseFees.textContent = spouseTotal;
        childrenAbove12Fees.textContent = childrenAbove12Total;
        childrenBelow12Fees.textContent = childrenBelow12Total;
        contributionAmount.textContent = contributionInput.value || 0;

        totalAmount.textContent = (
            parseInt(registrationFee.textContent) +
            spouseTotal +
            childrenAbove12Total +
            childrenBelow12Total +
            parseInt(contributionAmount.textContent)
        ).toString();
    }

    // Form submission with validation
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
