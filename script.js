const apiKey = "DEMO_KEY"; 
const form = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const currentContainer = document.getElementById("current-image-container");
const searchHistoryList = document.getElementById("search-history");

document.addEventListener("DOMContentLoaded", () => {
    // Set max attribute of date input to today's date
    searchInput.max = new Date().toISOString().split("T")[0];
    getCurrentImageOfTheDay();
    addSearchToHistory();
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const selectedDate = searchInput.value;
    getImageOfTheDay(selectedDate);
});

// 1. Fetch current image of the day
function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    fetchImage(currentDate);
}

// 2. Fetch image for selected date
function getImageOfTheDay(date) {
    fetchImage(date);
    saveSearch(date);
    addSearchToHistory();
}

// 3. Save search to localStorage
function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}

// 4. Display search history
function addSearchToHistory() {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    searchHistoryList.innerHTML = "";

    searches.forEach(date => {
        const li = document.createElement("li");
        li.textContent = date;
        li.addEventListener("click", () => fetchImage(date));
        searchHistoryList.appendChild(li);
    });
}

// Helper function to fetch and display image
async function fetchImage(date){
    try{
        const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`);
        const data = await response.json();
        if(data.media_type === "image"){
            currentContainer.innerHTML = `
            <h2>${data.title}</h2>
            <img src="${data.url}" alt="{data.title}">
            <p>${data.explanation}</p>
            `;
        }else{
            currentContainer.innerHTML = `<p>No image available for this date.</p>`;
        }
    }catch(err){
        currentContainer.innerHTML = `<p>Error fetching image. Please try again later.</p>`;
        console.error("Fetch error:", err);
    }
}
