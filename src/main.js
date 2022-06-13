import Vue from "vue";
import Time from "./Time.vue";
import Todo from "./Todo.vue";

if (localStorage.getItem("storedAppContainer")) {
  let tempsave = localStorage.getItem("storedAppContainer");
  $(".app-container").replaceWith(tempsave);
}

fetchUpdatedAppInfo();

let currentBackground = localStorage.getItem("background");

if (currentBackground) {
  document.documentElement.style.setProperty(
    "background-image",
    `url(${currentBackground})`
  );
}

var remember;
var firstUrl;

var oldList;
var rememberList = [];
var stop;

var count = -1;

new Vue({
  el: "#time",
  render: (h) => h(Time),
});

new Vue({
  el: "#todo",
  render: (h) => h(Todo),
});

$(window).on("load", function() {
  $("#cover").fadeOut(200);
});

var d = new Date();

var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
var n = weekday[d.getDay()];

var month = new Array(12);
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
var monthMain = month[d.getMonth()];
var day = d.getDate();
document.getElementById("date").innerHTML = `${n} ${day} ${monthMain}`;

var lastDay = localStorage.getItem("lastLogged");

localStorage.setItem("lastLogged", day);

//Settings Button

var metric = Number(localStorage.getItem("metric"));
var focusMode = Number(localStorage.getItem("focusmode"));
var settingsPopup = 0;
if (metric == null) {
  metric = 1;
} else if (metric == 0) {
  document.getElementById("metric-toggle").click();
}
if (focusMode == null) {
  focusMode = 1;
} else if (focusMode == 0) {
  document.getElementById("todo-spot").style.display = "none";
  document.getElementById("focusmode-toggle").click();
}
$("#settings").on("click", function() {
  if (settingsPopup == 1) {
    document.querySelector(".settings-popup").style.display = "none";
    settingsPopup = 0;
  } else {
    document.querySelector(".settings-popup").style.display = "block";
    settingsPopup = 1;
    $(".switch").on("change", function() {
      let id = $(this)[0].childNodes[3].id;
      if (id == "metric-toggle") {
        if (metric == 1) {
          metric = 0;
          fetchWeather();
          localStorage.setItem("metric", metric);
        } else {
          metric = 1;
          fetchWeather();
          localStorage.setItem("metric", metric);
        }
      } else {
        if (focusMode == 1) {
          document.getElementById("todo-spot").style.display = "none";
          focusMode = 0;
          localStorage.setItem("focusmode", focusMode);
        } else {
          document.getElementById("todo-spot").style.display = "";
          focusMode = 1;
          localStorage.setItem("focusmode", focusMode);
        }
      }
    });
  }
});

function getplaceholder(txt) {
  document.getElementById("search-bar").placeholder = "";
  var i = 0;
  var speed = 40;
  function typeWriter() {
    if (i < txt.length) {
      document.getElementById("search-bar").placeholder += txt.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }
  typeWriter();
}

function backgroundImgTasks(data) {
  document.documentElement.style.setProperty(
    "background-image",
    `url('${data}')`
  );
  localStorage.setItem("background", data);
}

let backArrays = [
  "https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2858&q=80",
  "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2858&q=80",
  "https://i.imgur.com/kHMNkAQ.png",
  "https://i.imgur.com/SoOyvky.png",
  "https://i.imgur.com/VsZwShA.png",
  "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2858&q=80",
  "https://i.imgur.com/DH5sJq4.png",
];
//if offline run this function
function backIfOffline(err) {
  console.log(err);
  document.documentElement.style.setProperty(
    "background-image",
    `url('./backgrounds/5.png')`
  );
}

if (day - lastDay >= 1 || day - lastDay <= -30) {
  setTimeout(function() {
    getplaceholder(`What can I help you with today?`);
  }, 300);
  //Changes Background
  if (!navigator.onLine) {
    backIfOffline();
  } else {
    let i = 0;
    if (localStorage.getItem("backArrayId")) {
      i = Number(localStorage.getItem("backArrayId"));
    } else {
      i = -1;
    }
    if (i <= backArrays.length - 2) {
      localStorage.setItem("backArrayId", i + 1);
      fetch(backArrays[i + 1])
        .then((response) => response.url)
        .then((data) => backgroundImgTasks(data))
        .catch((err) => backIfOffline(err));
    } else {
      i = -1;
      localStorage.setItem("backArrayId", i + 1);
      fetch(backArrays[i + 1])
        .then((response) => response.url)
        .then((data) => backgroundImgTasks(data))
        .catch((err) => backIfOffline(err));
    }
  }
} else if (!navigator.onLine) {
  backIfOffline();
  document.getElementById(
    "search-bar"
  ).placeholder = `Your device is offline, please check your connection`;
} else {
  document.getElementById("search-bar").placeholder =
    "What can I help you with today?";
}

var connection = function() {
  if (navigator.onLine) {
    document.getElementById("search-bar").placeholder =
      "What can I help you with today?";
  }
  if (!navigator.onLine) {
    document.getElementById(
      "search-bar"
    ).placeholder = `Your device is offline, please check your connection`;
  }
};

window.addEventListener("online", connection);
window.addEventListener("offline", connection);

var arrayone = [];
var arraytwo = {
  title: [],
  url: [],
  index: [],
};
function getUrl(items) {
  for (let i = 0; i < 8000; i++) {
    arrayone.push(items[i].title + " - " + items[i].url);
    //arrayone.push(items[i].visitCount);
    arraytwo.title.push(items[i].title + " - " + items[i].url);
    arraytwo.url.push(items[i].url);
  }
}

chrome.history.search({ text: "", startTime: 0, maxResults: 0 }, (items) =>
  getUrl(items.sort((a, b) => b.visitCount - a.visitCount))
);
var firs = 0;

var exit = 0;
const searchWrapper = document.querySelector(".search-container");
const suggBox = searchWrapper.querySelector(".autocom-box");
const input = document.getElementById("search-bar");
input.select();
input.onkeyup = (e) => {
  let icon = document.getElementById("search-engine");
  icon.src = "./google.png";
  let userData = e.target.value;
  if (userData == firstUrl) {
    userData = remember;
  }
  if (userData == "") {
    suggBox.innerHTML = "";
  } //iF user data empty dont have any lists so app drawer works.

  //if input box coins a ,com or ,co,uk ... and no spaces, convert it to a link upon entry - IF Userdata includes a '.' first
  if (
    (userData.indexOf(".") >= 1 || userData.includes("://")) == true &&
    userData.includes(" ") == false
  ) {
    let domainList = require("./domains.json");
    let domain = userData
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0]
      .substring(
        userData.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0]
      );
    if (
      domainList.includes("." + domain.split(".").pop()) ||
      userData.includes("://")
    ) {
      input.style.color = "#528FF5";
      input.style.fontWeight = "450";
      icon.src = "./search-icon.png";
      if (e.key === "Enter") {
        exit = 1;
        if (!userData.includes("://")) {
          location.href = `https://${userData}`;
        } else {
          location.href = userData;
        }
      }
    } else {
      input.style.color = "";
      input.style.fontWeight = "";
      icon.src = "./google.png";
    }
  } else {
    input.style.color = "";
    input.style.fontWeight = "";
    icon.src = "./google.png";
  }
  let emptyArray = [];
  if (userData) {
    emptyArray = arrayone.filter((data) => {
      return data.toLocaleLowerCase().includes(userData.toLocaleLowerCase());
    });
    /*let searchItem = userData.toLocaleLowerCase();
    for (let i = 0; i < arrayone.length; i++) {
      let found;
      let tempArray = arrayone[i].split(" ");
      for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i].toLocaleLowerCase().startsWith(searchItem) == true) {
          found = true;
        }
      }
      if (found == true) {
        emptyArray.push(arrayone[i]);
      }
    } <==better search algo testing */
    emptyArray.unshift();
    emptyArray = emptyArray.slice(0, 7); //Limits Data SHOWN TO JUST 7 URLS
    searchWrapper.classList.add("active");
    var lastEmptyArray = [];
    emptyArray = emptyArray.map((data) => {
      // add if(data includes things after .com remove them, to get favicon)
      var url = arraytwo.url[arraytwo.title.indexOf(data)];
      if (
        url.startsWith("https://" + userData.toLocaleLowerCase()) ||
        url.startsWith("https://www." + userData.toLocaleLowerCase())
      ) {
        if (data.length > 92) {
          data = data.substring(0, 100) + "...";
        } //TRIMS LIST ITEMS
        return (data = `<li><img src="chrome://favicon/size/64@1x/${url}" width="16"
        height="16">   ${data}<a href="${url}"></a></li>`);
      } else {
        if (data.length > 92) {
          data = data.substring(0, 100) + "...";
        } //TRIMS LIST ITEMS
        lastEmptyArray.push(
          `<li><img src="chrome://favicon/size/64@1x/${url}" width="16"
          height="16">   ${data}<a href="${url}"></a></li>`
        );
      }
      //still need to check if it contains subdomain
    });
    for (let i = 0; i < lastEmptyArray.length; i++) {
      emptyArray.push(lastEmptyArray[i]);
    }
    function isValid(value) {
      return value != undefined;
    } //counts all values in emptyarray without undefined

    var filtered = emptyArray.filter(isValid);

    let requiredPushes = 7 - filtered.length;

    if (requiredPushes > 0 && stop != 1) {
      $.ajax({
        url: `https://www.google.com/complete/search?sclient=psy-ab&q=${userData}`,
        type: "GET",
        dataType: "jsonp",
        success: function(data) {
          var data = data[1].map(function(row) {
            return row[0]
              .split("<b>")
              .join("")
              .split("</b>")
              .join("");
          });
          for (let i = 0; i < requiredPushes; i++) {
            if (data[i] != undefined) {
              emptyArray.push(`<li><img src="chrome://favicon/size/64@1x/https://www.google.com" width="16"
              height="16">   ${
                data[i]
              }<a id="google" href="https://www.google.com/search?q=${data[
                i
              ].replace(" ", "%20")}"></a></li>`);
            }
          }
          showSuggestions(emptyArray);
          clickItems();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          showSuggestions(emptyArray);
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    } else {
      showSuggestions(emptyArray, stop);
    }

    //Check to see if new input loaded
    if (rememberList.includes(input.value)) {
      //user still scrolling list
    } else {
      count = -1;
      stop = 0;
    }

    input.onkeydown = (event) => {
      if (event.keyCode == 40 || event.keyCode == 9 || event.keyCode == 38) {
        stop = 1;
      }
      //setting down/up hover
      if (event.keyCode == 40 || event.keyCode == 9) {
        event.preventDefault();
        stop = 1;
        if (count >= 6) {
          count = -1;
          suggBox.querySelectorAll("li")[6].classList.remove("manualhover");
        } else {
          count += 1;
          suggBox.querySelectorAll("li")[count].classList.add("manualhover");
          if (count != 0) {
            suggBox
              .querySelectorAll("li")
              [count - 1].classList.remove("manualhover");
          }
        }
        //extracting URLs & google autocom
        if (
          document
            .querySelector(`#suggest > li:nth-child(${count + 1}) > a`)
            .getAttribute("id") == null
        ) {
          input.value = document.querySelector(
            `#suggest > li:nth-child(${count + 1}) > a`
          ).href;
          rememberList.push(
            document.querySelector(`#suggest > li:nth-child(${count + 1}) > a`)
              .href
          );
        } else {
          input.value = document
            .querySelector(`#suggest > li:nth-child(${count + 1})`)
            .textContent.substring(3);
          rememberList.push(
            document
              .querySelector(`#suggest > li:nth-child(${count + 1})`)
              .textContent.substring(3)
          );
        }
      } else if (event.keyCode == 38) {
        stop = 1;
        event.preventDefault();
        count -= 1;
        if (count <= -1) {
          count = 6;
          suggBox.querySelectorAll("li")[0].classList.remove("manualhover");
          suggBox.querySelectorAll("li")[count].classList.add("manualhover");
        } else {
          suggBox.querySelectorAll("li")[count].classList.add("manualhover");
          suggBox
            .querySelectorAll("li")
            [count + 1].classList.remove("manualhover");
        }
        if (
          document
            .querySelector(`#suggest > li:nth-child(${count + 1}) > a`)
            .getAttribute("id") == null
        ) {
          input.value = document.querySelector(
            `#suggest > li:nth-child(${count + 1}) > a`
          ).href;
          rememberList.push(
            document.querySelector(`#suggest > li:nth-child(${count + 1}) > a`)
              .href
          );
        } else {
          input.value = document
            .querySelector(`#suggest > li:nth-child(${count + 1})`)
            .textContent.substring(3);
          rememberList.push(
            document
              .querySelector(`#suggest > li:nth-child(${count + 1})`)
              .textContent.substring(3)
          );
        }
      }
    };

    oldList = suggBox.querySelectorAll("li")[6];

    clickItems();

    var autoUrl = false;
    let allList = suggBox.querySelectorAll("li");

    if (allList[0] != undefined) {
      var urlArray = allList[0].firstChild.src.replace(
        "chrome://favicon/size/64@1x/",
        ""
      );
      firstUrl = urlArray
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
        .split("/")[0]; //also removes everything after /
    }

    if (stop != 1 && allList[0] != undefined) {
      if (firstUrl.startsWith(userData.toLocaleLowerCase())) {
        autoUrl = true;
        let remainder = firstUrl.replace(userData.toLocaleLowerCase(), "");
        if (allList[0] != undefined) {
          icon.src = allList[0].firstChild.src;
        }
        input.addEventListener("keyup", function(event) {
          // Number 13 is the "Enter" key on the keyboard
          if (event.keyCode === 13 && exit == 0) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            (function searchit() {
              //window.location.assign(`${urlArray[0]}`);
              document
                .querySelector(`#suggest > li:nth-child(${1}) > a`)
                .click();
            })();
          }
        });
        if (remainder.length > 0) {
          if (input.selectionStart == 0) {
            input.setSelectionRange(0, firstUrl.length);
          } else {
            input.value = userData + remainder;
            remember = userData;
            input.focus();
            input.setSelectionRange(userData.length, firstUrl.length);
          }
          var key = event.keyCode || event.charCode;
          if (key == 8) {
            //backspace
            input.value = userData;
          }
          if (key == 39) {
            input.setSelectionRange(firstUrl.length, firstUrl.length);
          } //right arrow
          if (key == 37) {
            //if left arrow key in input do somethign
          }
        }
      } else {
        autoUrl = false;
      }
    }

    if (autoUrl == false) {
      input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13 && exit == 0) {
          event.preventDefault();
          (function searchit() {
            var query = input.value;
            //window.location.assign(`${urlArray[0]}`);
            location.href = `https://www.google.com/search?q=${query}`;
          })();
        }
      });
    }
  } else {
    searchWrapper.classList.remove("active");
    icon.src = "./search-icon.png";
  }
};

function showSuggestions(list, stop) {
  let listData;
  if (stop != 1) {
    if (!list.length) {
      listData = "";
      searchWrapper.classList.remove("active");
      searchWrapper.classList.add("hidden");
    } else {
      searchWrapper.classList.add("active");
      searchWrapper.classList.remove("hidden");
      listData = list.join("");
    }
    suggBox.innerHTML = listData;
  }
}

function clickItems() {
  let allList = suggBox.querySelectorAll("li");
  for (let i = 0; i < allList.length; i++) {
    (function(index) {
      allList[i].addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          allList[i].click();
        }
      });
      allList[i].onclick = function() {
        let test12 = document.getElementById("suggest");
        function select(index) {
          test12.onclick = () => {
            document
              .querySelector(`#suggest > li:nth-child(${index + 1}) > a`)
              .click();
          };
        }
        select(index);
      };
    })(i);
  }
}

//setting jquery media queries: for app distance

function app() {
  if ($(window).width() <= 1577 && $(window).height() <= 907) {
    var rowSize = 82;
  } else if ($(window).width() < 940 && $(window).width() >= 833) {
    var rowSize = 83;
  } else if ($(window).width() < 833 && $(window).width() >= 700) {
    var rowSize = 77;
  } else if ($(window).width() < 700 && $(window).width() >= 632) {
    var rowSize = 70;
  } else if ($(window).width() < 632 && $(window).width() >= 558) {
    var rowSize = 60;
  } else if ($(window).width() < 558) {
    var rowSize = 52;
  } else if ($(window).width() >= 940 && $(window).width() <= 1243) {
    var rowSize = 90;
  } else {
    var rowSize = 100; // => container height / number of items
  }
  var container = document.querySelector(".app-container");
  var listItems = Array.from(document.querySelectorAll(".list-item")); // Array of elements
  var sortables = listItems.map(Sortable); // Array of sortables
  var total = sortables.length;

  TweenLite.to(container, 0.5, { autoAlpha: 1 });

  function changeIndex(item, to) {
    // Change position in array
    arrayMove(sortables, item.index, to);

    // Change element's position in DOM. Not always necessary. Just showing how.
    if (to === total - 1) {
      container.appendChild(item.element);
    } else {
      var i = item.index > to ? to : to + 1;
      container.insertBefore(item.element, container.children[i]);
    }

    // Set index for each sortable
    sortables.forEach((sortable, index) => sortable.setIndex(index));
  }

  function Sortable(element, index) {
    var content = element.querySelector(".item-content");
    var order = element.querySelector(".order");

    var animation = TweenLite.to(content, 0.3, {
      force3D: true,
      scale: 1.0,
      paused: true,
    });

    var dragger = new Draggable(element, {
      onDragStart: downAction,
      onRelease: upAction,
      onDrag: dragAction,
      cursor: "inherit",
      type: "x",
    });

    // Public properties and methods
    var sortable = {
      dragger: dragger,
      element: element,
      index: index,
      setIndex: setIndex,
    };

    TweenLite.set(element, { x: index * rowSize });

    function setIndex(index) {
      sortable.index = index;
      order.textContent = index + 1;

      // Don't layout if you're dragging
      if (!dragger.isDragging) layout();
    }

    function downAction() {
      animation.play();
      this.update();
    }

    function dragAction() {
      // Calculate the current index based on element's position
      var index = clamp(Math.round(this.x / rowSize), 0, total - 1);

      if (index !== sortable.index) {
        changeIndex(sortable, index);
      }
      localStorage.setItem("storedAppContainer", container.outerHTML);
    }

    function upAction() {
      animation.reverse();
      layout();
    }

    function layout() {
      TweenLite.to(element, 0.3, { x: sortable.index * rowSize });
    }

    return sortable;
  }

  // Changes an elements's position in array
  function arrayMove(array, from, to) {
    array.splice(to, 0, array.splice(from, 1)[0]);
  }

  // Clamps a value to a min/max
  function clamp(value, a, b) {
    return value < a ? a : value > b ? b : value;
  }
}

app();

$(window).on("resize", function() {
  app();
});

//weather

const weatherInput = document.querySelector(".inputweather");

var weatherInputValue;
if (localStorage.getItem("location")) {
  weatherInputValue = localStorage.getItem("location");
} else {
  weatherInputValue = "london";
}

var city;
if (localStorage.getItem("city")) {
  city = localStorage.getItem("city");
  document.getElementById("weather-location").innerHTML = city;
} else {
  city = "London, GB";
  document.getElementById("weather-location").innerHTML = city;
}
fetchWeather();

function fetchWeather() {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${weatherInputValue}&APPID=7f1011f04bf22742001f43b507d27d35&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      const { main, sys, weather } = data;
      let temp = Math.round(main.temp);
      let icon = document.getElementById("icon-weather");
      icon.src = `./weather-icons/${weather[0].icon}@2x.png`;
      if (metric == 1) {
        document.getElementById("weather-temp").innerHTML = temp + "°C  ";
      } else {
        temp = Math.round(temp * (9 / 5) + 32);
        document.getElementById("weather-temp").innerHTML = temp + "°F  ";
      }
      document.getElementById(
        "weather-desc"
      ).textContent = capitalizeFirstLetter(weather[0]["description"]);
      let city =
        capitalizeFirstLetter(weatherInputValue) + ", " + sys.country + "";
      document.getElementById("weather-location").innerHTML = city;
      localStorage.setItem("city", city);
      // JSON data parsed by `data.json()` call
    })
    .catch(() => {
      weatherInput.classList.add("error");
    });
}

function capitalizeFirstLetter(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

weatherInput.onkeyup = (e) => {
  weatherInput.classList.remove("error");
  let inputVal = e.target.value;
  weatherInputValue = inputVal;
  localStorage.setItem("location", weatherInputValue);
  if (e.keyCode == 13) {
    fetchWeather();
    e.target.value = "";
  }
};

$(".edit").hide();
$(".order").hide();

var myindex;
$(".list-item").on("mouseover", function(event) {
  myindex = $(this)[0].children[1].getAttribute("id");
});

//ON APP CLICK
$(".item-content").on("click", function(event) {
  let link = String(
    $(this)[0].previousElementSibling.parentNode.children[2].children[0]
      .currentSrc
  );
  let strippedLink = link.split("https://gicon.vercel.app/?url=")[1];
  let mainLink = strippedLink
    .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
    .split("/")[0];
  location.href = "https://" + mainLink;
});

$(".list-item").hover(
  function() {
    $(`#${myindex}`).show();
  },
  function() {
    $(`#${myindex}`).hide();
  }
);

$(".edit").on("click", function(event) {
  let appIndex = $(this)[0].getAttribute("id");
  document.querySelector(".popup-toggle").click();
  let appName = $(this)[0].parentNode.children[2].innerText;
  document.getElementById("app-name").value = appName;
  let url = $(
    this
  )[0].nextElementSibling.childNodes[0].offsetParent.children[1].offsetParent.children[0].currentSrc.split(
    "vercel.app/?url="
  )[1];
  document.getElementById("app-url").value = url;
  document.getElementById("save-popup").onclick = function() {
    let appSelector = document.getElementById(appIndex + "-inner");
    let innertext = `<img
    class="app-img" src="https://gicon.vercel.app/?url=${
      document.getElementById("app-url").value
    }"><span id="text">${document.getElementById("app-name").value}`;
    appSelector.innerHTML = innertext;
    document.querySelector(".popup-toggle").click();
    let localStorageName = "updatedApp" + appIndex;
    localStorage.setItem(`${localStorageName}`, innertext);
  };
});

function fetchUpdatedAppInfo() {
  for (let i = 1; i < 10; i++) {
    let localStorageName = "updatedApp" + i;
    let innertext = localStorage.getItem(localStorageName);
    if (innertext) {
      let appSelector = document.getElementById(i + "-inner");
      appSelector.innerHTML = innertext;
    }
  }
}

$(".popup-toggle").on("click", function(e) {
  e.preventDefault();
  $(".popup").toggleClass("is-visible");
});

var makeUnselectable = function($target) {
  $target
    .attr("unselectable", "on")
    .attr("draggable", "false")
    .on("dragstart", function() {
      return false;
    });
  $target
    .find("*")
    .attr("draggable", "false")
    .attr("unselectable", "on");
};
makeUnselectable(".app-img");
