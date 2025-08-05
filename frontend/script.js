const API_BASE_URL = "https://plannerai-2.onrender.com";


document.addEventListener("DOMContentLoaded", () => {
  const modeToggleBtn = document.getElementById("mode-toggle");
  modeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
    const icon = modeToggleBtn.querySelector("i");
    icon.classList.toggle("fa-sun");
    icon.classList.toggle("fa-moon");
  });

  const tabs = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // --- Location Finder ---
  const locationSubmit = document.getElementById("location-submit");
  const imageUpload = document.getElementById("image-upload");
  const locationResponse = document.getElementById("location-response");
  const imagePreview = document.getElementById("image-preview");

  imageUpload.addEventListener("change", () => {
    locationResponse.innerHTML = "";
    imagePreview.innerHTML = "";
    const file = imageUpload.files[0];
    if (file) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      imagePreview.appendChild(img);
    }
  });

  locationSubmit.addEventListener("click", async () => {
    if (!imageUpload.files.length) {
      alert("Please upload an image.");
      return;
    }
    locationSubmit.disabled = true;
    locationSubmit.textContent = "Processing...";
    locationResponse.innerHTML = "";

    try {
      const formData = new FormData();
      formData.append("file", imageUpload.files[0]);

      const res = await fetch(`${API_BASE_URL}/api/location-finder`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      locationResponse.innerHTML = marked.parse(data.response);
    } catch (err) {
      locationResponse.innerHTML = `<p class="error">Error: ${err.message}</p>`;
    } finally {
      locationSubmit.disabled = false;
      locationSubmit.textContent = "Get Location!";
    }
  });

  // --- Trip Planner ---
  const tripSubmit = document.getElementById("trip-submit");
  const tripInput = document.getElementById("trip-input");
  const tripResponse = document.getElementById("trip-response");

  tripSubmit.addEventListener("click", async () => {
    if (!tripInput.value.trim()) {
      alert("Please enter location and number of days");
      return;
    }
    tripSubmit.disabled = true;
    tripSubmit.textContent = "Planning...";

    try {
      const response = await fetch(`${API_BASE_URL}/api/trip-planner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: tripInput.value }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      tripResponse.innerHTML = marked.parse(data.response);
    } catch (error) {
      tripResponse.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
      tripSubmit.disabled = false;
      tripSubmit.textContent = "Plan my Trip!";
    }
  });

  // --- Weather Forecast ---
  const weatherSubmit = document.getElementById("weather-submit");
  const weatherInput = document.getElementById("weather-input");
  const weatherResponse = document.getElementById("weather-response");

  weatherSubmit.addEventListener("click", async () => {
    if (!weatherInput.value.trim()) {
      alert("Please enter a location");
      return;
    }
    weatherSubmit.disabled = true;
    weatherSubmit.textContent = "Forecasting...";

    try {
      const response = await fetch(`${API_BASE_URL}/api/weather-forecast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: weatherInput.value }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      weatherResponse.innerHTML = marked.parse(data.response);
    } catch (error) {
      weatherResponse.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
      weatherSubmit.disabled = false;
      weatherSubmit.textContent = "Forecast Weather!";
    }
  });

  // --- Accommodation Planner ---
  const accommodationSubmit = document.getElementById("accommodation-submit");
  const accommodationInput = document.getElementById("accommodation-input");
  const accommodationResponse = document.getElementById("accommodation-response");

  accommodationSubmit.addEventListener("click", async () => {
    if (!accommodationInput.value.trim()) {
      alert("Please enter a location");
      return;
    }
    accommodationSubmit.disabled = true;
    accommodationSubmit.textContent = "Searching...";

    try {
      const response = await fetch(`${API_BASE_URL}/api/accommodation-planner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: accommodationInput.value }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      accommodationResponse.innerHTML = marked.parse(data.response);
    } catch (error) {
      accommodationResponse.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
      accommodationSubmit.disabled = false;
      accommodationSubmit.textContent = "Find Restaurant & Hotel!";
    }
  });
});
