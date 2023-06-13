/*
  Get Elements
*/
// Get landing page div
const landingPage = document.querySelector(".landing-page");
// Get Header
const header = document.querySelector("header");
// Get all sections
const sections = document.querySelectorAll("section");
// Get option box & option icons
const optionBox = document.getElementById("option-box");
const iconHolder = document.querySelector(".option-box .option-ico-holder");
const iconRigth = document.querySelector(".option-box .option-ico-rigth");
const iconLeft = document.querySelector(".option-box .option-ico-left");
// Get all colors
const colorsOpt = document.querySelectorAll(".option-content .color-list li");
// Get Yes & No optoins for background
const backgroundOpt = document.querySelectorAll(
  ".option-content .random-opt span"
);
// Get Yes & No optoins for bullets
const bulletsOpt = document.querySelectorAll(
  ".option-content .bullets-opt span"
);
// Get skills section
const skillSec = document.querySelector(".about-container .skills");
// Get gallery imgs
const galleryImgs = document.querySelectorAll(".gallery .imgs-box img");

/*
  For performance
*/
const fragment = document.createDocumentFragment();

/*
  Dealing with header
  Build nav links dynamically
  Adding class active to the link when reach to his section
*/
// Get menu elements
const menuBtn = document.getElementById("menu-btn");
const menuList = document.getElementById("list");

// Start build nav links
function createNavLinks() {
  for (const section of sections) {
    const sectionId = section.getAttribute("id");
    const sectionName = section.dataset.nav;

    // Build nav childs => (li & a)
    const navList = document.createElement("li");

    const navLinks = document.createElement("a");
    navLinks.href = `#${sectionId}`;
    navLinks.dataset.section = `${sectionId}`;
    navLinks.innerHTML = `${sectionName}`;

    // Start adding childs to menu links
    navList.appendChild(navLinks);
    fragment.appendChild(navList);
    menuList.appendChild(fragment);
  }
};
createNavLinks();

// Start adding class to change menu look
const landingOption = {
  rootMargin: "-200px",
};

const landingObserver = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      header.classList.add("scrolled");
      header.classList.add("shadow");
    } else {
      header.classList.remove("scrolled");
      header.classList.remove("shadow");
    }
  });
}, landingOption);

landingObserver.observe(document.querySelector(".landing-content"));

// Start adding class active
const sectionOption = {
  rootMargin: "-195px",
};

const sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    // Get the with section id
    let linkActive = document.querySelector(
      `header .links li a[href = "#${entry.target.getAttribute("id")}"]`
    );

    if (!entry.isIntersecting) {
      linkActive.classList.remove("active");
    } else {
      // Remove active class from all links first
      document.querySelectorAll("header .links li a").forEach((link) => {
        link.classList.remove("active");
      });
      linkActive.classList.add("active");
    }
  });
}, sectionOption);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/*
  Dealing with menu btn to show our list
  close menu on scrolling
*/
document.onclick = function (e) {
  // To close menu when click on the body
  if (e.target.id !== "menu-btn" && e.target.id !== "list") {
    menuBtn.classList.remove("close");
    menuList.classList.remove("open");
  }

  // To close menu when click on the icon
  let mySpan = document.querySelector("#menu-btn span"); // To solve click on span action
  if (e.target === mySpan || e.target === menuBtn) {
    menuBtn.classList.toggle("close");
    menuList.classList.toggle("open");
  }
};

/*
  Start options box
*/
// To click on gear icon
function showOptions() {
  // Start change the icon
  iconRigth.classList.toggle("close");
  iconLeft.classList.toggle("close");
  iconLeft.classList.toggle("open");

  // Add Overlay & white background
  document.getElementById("option-overlay").classList.toggle("option-overlay");

  // Remove toggle icons
  document.querySelector(".toggle-icons").classList.toggle("hide");
  document.querySelector(".option-content").classList.toggle("width");

  // Add open class to show options
  optionBox.classList.toggle("open");

  // To close options box when click on the body
  window.onclick = function (e) {
    if (e.target.id === "option-overlay") {
      iconRigth.classList.remove("close");
      iconLeft.classList.add("close");
      iconLeft.classList.remove("open");

      // Remove Overlay & white background
      document
        .getElementById("option-overlay")
        .classList.remove("option-overlay");

      // Remove toggle icons
      document.querySelector(".toggle-icons").classList.remove("hide");
      document.querySelector(".option-content").classList.remove("width");

      optionBox.classList.remove("open");
    }
  };
}

// when click on gear icon
iconHolder.addEventListener("click", showOptions);

/* 
  Start dealing with color options
  Check if their is a color saved in local storage and set into the page
*/
let colorStored = localStorage.getItem("selected_color");
function getStoredColor() {
  if (colorStored != null) {
    // Change root color
    document.documentElement.style.setProperty("--main-color", colorStored);

    // Remove active class from old selected color and add to new one
    document
      .querySelectorAll(".option-content .color-list li")
      .forEach((li) => {
        li.classList.remove("active");

        // Check to add active class to selected color
        if (colorStored === li.dataset.color) {
          li.classList.add("active");
        }
      });
  }
}
getStoredColor();

// Loop in the colors and add click listener
colorsOpt.forEach((color) => {
  color.addEventListener("click", (e) => {
    // Change root color
    document.documentElement.style.setProperty(
      "--main-color",
      e.target.dataset.color
    );

    // Add to local storage
    localStorage.setItem("selected_color", e.target.dataset.color);

    handleActive(e);
  });
});

/* 
  Start dealing with random background option
  Check If There's Local Storage Random Background Item
*/
// Random background option
let backgroundOption = true;

// To control the background interval
let backgroundInterval;

// Get from local
let backgroundLocalItem = localStorage.getItem("background_option");

if (backgroundLocalItem !== null) {
  // Remove Active Class From All Spans
  backgroundOpt.forEach((element) => {
    element.classList.remove("active");
  });

  if (backgroundLocalItem === "true") {
    backgroundOption = true;

    document
      .querySelector(".option-content .random-opt .random-back .yes")
      .classList.add("active");
  } else {
    backgroundOption = false;

    document
      .querySelector(".option-content .random-opt .random-back .no")
      .classList.add("active");
  }
}

// Add click listener
backgroundOpt.forEach((el) => {
  // For every btn
  el.addEventListener("click", (e) => {
    // If no choice don't change background randomly
    if (e.target.dataset.back === "no") {
      backgroundOption = false;

      clearInterval(backgroundInterval);

      localStorage.setItem("background_option", false);
    } else {
      backgroundOption = true;

      changeBackground();

      localStorage.setItem("background_option", true);
    }

    handleActive(e);
  });
});

/*
  Start change background fun.
*/

function changeBackground() {
  // Check for local storage
  if (backgroundOption === true) {
    // Make our imgs into array
    let imgsArr = [
      "land_1.webp",
      "land_2.webp",
      "land_3.webp",
      "land_4.webp",
      "land_5.webp",
      "land_6.webp",
    ];

    // Start Change
    backgroundInterval = setInterval(() => {
      // Get random img
      let ranImg = imgsArr[Math.floor(Math.random() * imgsArr.length)];
      landingPage.style.backgroundImage = `url(imgs/${ranImg})`;
    }, 15000);
  }
}
changeBackground();

/*
  Handle Active State
*/
function handleActive(e) {
  e.target.parentElement.querySelectorAll(".active").forEach((element) => {
    element.classList.remove("active");
  });

  e.target.classList.add("active");
}

/*
  Start skills progress
  Using intersection observer to fill skills
*/
const skillsOption = {
  rootMargin: "-170px",
};

const observer = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Fill skills
      document
        .querySelectorAll(".about-container .prog span")
        .forEach((skill) => {
          skill.style.width = skill.dataset.progress;

          // To do observe one time
          observer.unobserve(entry.target);
        });
    }
  });
}, skillsOption);

observer.observe(skillSec);

/*
  Start popup imgs
*/
// Open popup
galleryImgs.forEach((img) => {
  img.addEventListener("click", () => {
    // Create overlay div
    let popupOverlay = document.createElement("div");
    popupOverlay.classList = "popup-overlay";

    // Create popup box
    let popupBox = document.createElement("div");
    popupBox.classList = "popup-box";

    // Create heaing title
    if (img.alt != null) {
      let popupTitle = document.createElement("h3");
      let popupTitleText = document.createTextNode(img.alt);
      popupTitle.appendChild(popupTitleText);
      popupTitle.classList.add("text-center", "mb-3");
      popupBox.appendChild(popupTitle);
    }

    // Add image to popup box
    let popupImg = document.createElement("img");
    popupImg.src = img.src;
    popupImg.classList.add("mw-100");
    popupBox.appendChild(popupImg);

    // Make close icon
    let closePopupDiv = document.createElement("div");
    closePopupDiv.classList.add("close-popup");

    let closePopupIcon = document.createTextNode("x");

    closePopupDiv.appendChild(closePopupIcon);
    popupBox.appendChild(closePopupDiv);

    // Add to fragment first for performance
    fragment.appendChild(popupOverlay);
    fragment.appendChild(popupBox);
    document.body.appendChild(fragment);
  });
});

// Close popup
document.addEventListener("click", (e) => {
  if (e.target.className === "close-popup") {
    // Remove popup & overlay
    document.querySelector(".popup-box").remove();
    document.querySelector(".popup-overlay").remove();
  }
});

/*
  Change gallery imgs
*/
// Get gallery btns & imgs boxes
const galleryBtns = document.querySelectorAll(".gallery ul li");

// Add event listener to all btns
galleryBtns.forEach((btn) => {
  btn.addEventListener("click", filterImg);
});

// Filter imgs
function filterImg(e) {
  // Run active function
  setActiveBtn(e);

  // Loop to deal with each img
  galleryImgs.forEach((img) => {
    // Expand all images
    img.classList.remove("img-shrink");
    img.classList.add("img-expand");

    // Get btns & imgs data from data attr
    const btnData = parseInt(e.target.dataset.img);
    const imgData = parseInt(img.dataset.img);

    /* 
      If btn data and imgs data arn't the same
      then hide thid imgs
    */
    if (btnData !== imgData) {
      img.classList.remove("img-expand");
      img.classList.add("img-shrink");
    }
  });
}

// Set active btn on click
function setActiveBtn(e) {
  // First remove active class from all btns
  galleryBtns.forEach((btn) => {
    btn.classList.remove("active");
  });

  // Add active class to clicked btn
  e.target.classList.add("active");
}

// Set click listener to the "All" btn
document.querySelector(".gallery ul > li").addEventListener("click", (e) => {
  // Run active function
  setActiveBtn(e);

  galleryImgs.forEach((img) => {
    img.classList.remove("img-shrink");
    img.classList.add("img-expand");
  });
});

/*
  Build bullets dynamically
  Start dealing with links of sections
*/
const bulletsDiv = document.querySelector(".bullets");

// Start build nav links
const createbullets = function () {
  for (const section of sections) {
    const sectionId = section.getAttribute("id");
    const sectionName = section.dataset.nav;

    const bullet = document.createElement("div");
    bullet.classList = "bullet";
    bullet.dataset.section = `${sectionId}`;

    const bulletTooltip = document.createElement("div");
    bulletTooltip.classList = "bullet-tooltip";
    bulletTooltip.innerHTML = `${sectionName}`;

    // Start adding childs to bullets div
    bullet.appendChild(bulletTooltip);
    fragment.appendChild(bullet);
    bulletsDiv.appendChild(fragment);
  }
};
createbullets();

// Start links to go to sections
function scrollToSections(elements) {
  elements.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();

      document.getElementById(e.target.dataset.section).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
}

// Get btns which go to sections
const menuLinks = document.querySelectorAll("#list a");
const sectionsBullets = document.querySelectorAll(".bullets .bullet");

scrollToSections(menuLinks);
scrollToSections(sectionsBullets);

/*
  Start dealing with show bullet option
  Check if their is a color saved in local storage and set into the page
*/
let bulletOptStored = localStorage.getItem("bullets_option");

if (bulletOptStored != null) {
  // Remove class active from Yes & No spans
  bulletsOpt.forEach((opt) => {
    opt.classList.remove("active");
  });

  if (bulletOptStored === "show") {
    document.querySelector(".bullets-opt .yes").classList.add("active");
    bulletsDiv.style.right = "0";
  } else {
    document.querySelector(".bullets-opt .no").classList.add("active");
    bulletsDiv.style.right = "-40px";
  }
}

bulletsOpt.forEach((opt) => {
  opt.addEventListener("click", (e) => {
    if (opt.dataset.display === "yes") {
      bulletsDiv.style.right = "0";
      localStorage.setItem("bullets_option", "show");
    } else {
      bulletsDiv.style.right = "-40px";
      localStorage.setItem("bullets_option", "hide");
    }

    // Handle active function
    handleActive(e);
  });
});

// Reset btn
document.querySelector(".reset-btn").onclick = () => {
  localStorage.removeItem("background_option");
  localStorage.removeItem("selected_color");
  localStorage.removeItem("bullets_option");

  // Relod the window
  window.location.reload();
};

/*
  Start counter increasement for stats section
*/
const statsSection = document.querySelector(".stats");
const statsNumbers = document.querySelectorAll(".stats .number");

const statsOption = {
  rootMargin: "-170px",
};

const statsObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    } else {
      statsNumbers.forEach((num) => {
        StatsCount(num);
      });

      // To make this function run one time only
      observer.unobserve(statsSection);
    }
  });
}, statsOption);

statsObserver.observe(statsSection);

function StatsCount(e) {
  let goal = e.dataset.goal;

  let statsCounter = setInterval(() => {
    e.textContent++;

    if (e.textContent === goal) {
      clearInterval(statsCounter);
    }
  }, 2000 / goal);
}

/*
  Up Bottun
*/
let upSpan = document.querySelector(".up");

window.onscroll = function () {
  // Up Bottun
  if (this.scrollY >= 200) {
    upSpan.classList.add("show");
  } else {
    upSpan.classList.remove("show");
  }
};

upSpan.onclick = function () {
  window.scrollTo({
    top: 0,
  });
};