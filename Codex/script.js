const bookingForm = document.getElementById("bookingForm");
const formStatus = document.getElementById("formStatus");
const revealTargets = document.querySelectorAll(
  ".hero, .panel, .feature-card, .fleet-card, .booking-copy, .booking-form, .experience-strip"
);

revealTargets.forEach((element) => element.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealTargets.forEach((element) => observer.observe(element));

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(bookingForm);
  const customer = data.get("name");
  const vehicle = data.get("vehicle");
  const trip = data.get("drop");
  const date = data.get("date");
  const passengers = data.get("passengers");

  formStatus.textContent =
    `Thanks ${customer}. Your ${vehicle} booking request for ${passengers} passenger(s) to ${trip} on ${date} has been received. ` +
    "Our Khajuraho travel team will contact you shortly.";

  bookingForm.reset();
  bookingForm.elements.pickup.value = "Khajuraho, Madhya Pradesh";
});
