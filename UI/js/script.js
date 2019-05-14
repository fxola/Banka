let hamburger = document.getElementsByClassName("menu-icon")[0];
let list = document.getElementsByTagName("ul")[0];

hamburger.addEventListener("click", function() {
  list.classList.toggle("showing");
});
