const hijriDay = document.querySelector(".hijri_date .day");
const hijriMonth = document.querySelector(".hijri_date .month");
const hijriYear = document.querySelector(".hijri_date .year");
const weekDay = document.querySelector(".week_day");
const countryName = document.querySelector(".country_name");
const prayersCards = document.querySelector(".prayers_cards");
const message = document.querySelector(".message");
const messageContent = document.querySelector(".message p");

const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

const showErrorMessage = (msg) => {
  message.style.display = "flex";
  messageContent.textContent = msg;
};

async function fetchData() {
  try {
    const response = await fetch(
      `http://api.geoapify.com/v1/ipinfo?&apiKey=bad03c4951e34a888fb649f396caeaa6`
    );

    const result = await response.json();
    const { location } = result;
    let { latitude } = location;
    let { longitude } = location;

    await setCoord(latitude, longitude);

    const currentCountry = result.country.name_native ?? result.country.name;
    countryName.textContent = currentCountry;
  } catch (error) {
    showErrorMessage(error);
  }
}

async function setCoord(lat, lng) {
  try {
    const response = await fetch(
      `http://api.aladhan.com/v1/timings/${currentDay}-${currentMonth}-${currentYear}?latitude=${lat}&longitude=${lng}&method=5&adjustment=1`
    );
    const json = await response.json();

    if (json.status == "OK") {
      const { hijri } = json.data.date;
      hijriDay.textContent = hijri.day;
      hijriMonth.textContent = hijri.month.ar;
      hijriYear.textContent = hijri.year;
      weekDay.textContent = hijri.weekday.ar;

      const { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha } = json.data.timings;
      const prayers = [
        { prayerName: "الفجر", prayerTime: Fajr },
        { prayerName: "الشروق", prayerTime: Sunrise },
        { prayerName: "الظهر", prayerTime: Dhuhr },
        { prayerName: "العصر", prayerTime: Asr },
        { prayerName: "المغرب", prayerTime: Maghrib },
        { prayerName: "العشاء", prayerTime: Isha },
      ];

      prayers
        .map(({ prayerName, prayerTime }) => {
          return `<div class="card">
            <div class="prayer_name">${prayerName}</div>
            <div class="prayer_time">${prayerTime}</div>
        </div>`;
        })
        .forEach((card) => {
          prayersCards.innerHTML += card;
        });
    }
  } catch (error) {
    showErrorMessage(error);
  }
}

fetchData();
