const api = "https://bank-a.herokuapp.com/api/v1/";

let load = element => document.getElementById(`${element}`);

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
    signUpButton.innerText = `loading...`;

    const firstName = load("firstname").value;
    const lastName = load("lastname").value;
    const email = load("email").value;
    const password = load("password").value;
    const confirmPassword = load("confirmpassword").value;
    const data = { firstName, lastName, email, password, confirmPassword };

    const response = await Api.makeRequest(api, data, "auth/signup");

    if (response.success === false) {
      signUpButton.innerText = `Register`;
      toast(response);
    } else {
      signUpButton.innerText = `Register`;
      toast(response);
      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        window.location.href = "transactions.html";
      }, 3000);
    }
  });
}

const signInButton = load("login-button");
if (signInButton) {
  signInButton.addEventListener("click", async e => {
    e.preventDefault();
    signInButton.innerText = `loading...`;

    const email = load("email").value;
    const password = load("password").value;
    const data = { email, password };
    const response = await Api.makeRequest(api, data, "auth/signin");

    if (response.success === false) {
      signInButton.innerText = `Log in`;
      toast(response);
    } else {
      signInButton.innerText = `Log in`;
      toast(response);
      localStorage.setItem("token", response.data.token);

      switch (response.data.type) {
        case "client":
          setTimeout(() => {
            window.location.href = "transactions.html";
          }, 3000);
          break;
        case "staff":
          setTimeout(() => {
            window.location.href = "admin_dashboard.html";
          }, 3000);
          break;
      }
    }
  });
}

const toast = response => {
  console.log(response);
  let alertBox = load("alert");
  alertBox.style.display = "block";
  alertBox.style.backgroundColor = "red";
  if (response.success === true) alertBox.style.backgroundColor = "green";
  alertBox.innerHTML = `<p>${response.message}</p>`;
  if (!response.message) alertBox.innerHTML = `<p>${response.error}</p>`;

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 2000);
};
