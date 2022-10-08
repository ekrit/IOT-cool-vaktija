const firebaseConfig = {
  apiKey: "AIzaSyDGIMxkOPPQZh-IoOWonOH_K4KCRgYihBg",

  authDomain: "cool-vaktija-iot.firebaseapp.com",

  databaseURL: "https://cool-vaktija-iot-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "cool-vaktija-iot",

  storageBucket: "cool-vaktija-iot.appspot.com",

  messagingSenderId: "735537127327",

  appId: "1:735537127327:web:f618c4fa0cb509683ea7aa",

  measurementId: "G-QMD20XKMYT"
};

firebase.initializeApp(firebaseConfig);

let namaskaVremena;
var audio = new Audio(
  "Alarm-Fast-High-Pitch-A3-Ring-Tone-www.fesliyanstudios.com.mp3"
);

let alarmOn = document.getElementById("on");
let alarmOff = document.getElementById("off");

let dbAlarm = firebase.database().ref("alarm");
let dbVremena = firebase.database().ref("vremena");

alarmOn.addEventListener("click", () => {
  if (confirm("Da li želite da upalite alarm?")) {
    alert("Alarm je upaljen!");
    dbAlarm.set(true);
    audio.play();
  }
});

alarmOff.addEventListener("click", () => {
  if (confirm("Da li želite da ugasite alarm?")) {
    alert("Alarm je ugašen!");

    dbAlarm.set(false);
    audio.pause();
    testTimeInput.value = "";
  }
});

function fetchData() {
  fetch("https://api.vaktija.ba/")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const arr = data.vakat;

      dbVremena.set(data.vakat);

      namaskaVremena = arr;

      const elements = document.getElementsByClassName("namaz");
      Array.from(elements).forEach((element, index) => {
        element.innerText = `${element.innerText} ${arr[index]}`;
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

fetchData();

setInterval(() => {
  var date = new Date();
  var dateString = date.getHours() + ":" + date.getMinutes();

  namaskaVremena.forEach((element) => {
    if (dateString === element) {
      audio.play();
      console.log("Aktivirano je namasko vrijeme!")
    }
  });

  // testno vrijeme
  if (tempTime === dateString) {
    audio.play();
    console.log("Aktivirano je testno vrijeme!")
  }
}, 1000);

let testTimeInput = document.getElementById("test-time");
let tempTime;

testTimeInput.addEventListener("change", (e) => {
  tempTime = e.target.value;
});
