const api = "https://bank-a.herokuapp.com/api/v1/";

let load = element => document.getElementById(`${element}`);
let alertBox = load("alert");

class Api {
  static async makeRequest(api, data, endpoint) {
    const response = await fetch(`${api}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    console.log(response);
    return await response.json();
  }
}

const signUpButton = load("register-button");
if (signUpButton) {
  signUpButton.addEventListener("click", async e => {
    e.preventDefault();

    const firstName = load("firstname").value;
    const lastName = load("lastname").value;
    const email = load("email").value;
    const password = load("password").value;
    const confirmPassword = load("confirmpassword").value;
    const data = { firstName, lastName, email, password, confirmPassword };

    const response = await Api.makeRequest(api, data, "auth/signup");

    if (response.success === false) {
      toast(response);
    } else {
      toast(response);
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        window.location.href = "transactions.html";
      }, 3000);
    }
  });
}

const toast = response => {
  alertBox.style.display = "block";
  alertBox.style.backgroundColor = "red";
  if (response.success === true) alertBox.style.backgroundColor = "green";
  alertBox.innerHTML = `<p>${response.message}</p>`;
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 2000);
};
