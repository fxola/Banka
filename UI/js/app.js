const api = "https://bank-a.herokuapp.com/api/v1/";

let load = element => document.getElementById(`${element}`);

class Api {
  static async makeRequest(api, endpoint, options) {
    const response = await fetch(`${api}${endpoint}`, options);
    console.log(response);
    return await response.json();
  }
}

const signUpButton = load("register-button");
if (signUpButton) {
  signUpButton.addEventListener("click", async e => {
    e.preventDefault();
    signUpButton.innerText = `Loading...`;

    const firstName = load("firstname").value;
    const lastName = load("lastname").value;
    const email = load("email").value;
    const password = load("password").value;
    const confirmPassword = load("confirmpassword").value;
    const data = { firstName, lastName, email, password, confirmPassword };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await Api.makeRequest(api, "auth/signup", options);

    if (response.success === false) {
      signUpButton.innerText = `Register`;
      toast(response);
      return;
    }
    signUpButton.innerText = `Register`;
    toast(response);
    localStorage.setItem("token", response.data.token);
    setTimeout(() => {
      window.location.href = "transactions.html";
    }, 3000);
  });
}

const signInButton = load("login-button");
if (signInButton) {
  signInButton.addEventListener("click", async e => {
    e.preventDefault();
    signInButton.innerText = `Loading...`;

    const email = load("email").value;
    const password = load("password").value;
    const data = { email, password };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    const response = await Api.makeRequest(api, "auth/signin", options);

    if (response.success === false) {
      signInButton.innerText = `Log in`;
      toast(response);
      return;
    }
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
  });
}

const AccountsSection = load("admin-dashboard-section");
if (AccountsSection) {
  AccountsSection.innerHTML = `<h1>Getting Accounts...</h1>`;
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "index.html";
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };

  (async () => {
    try {
      const response = await Api.makeRequest(api, "accounts", options);
      if (response.status === 401) window.location.href = "index.html";

      if (response.data.length > 0) {
        const template = response.data.map(account => {
          const mapped = `
                    <article class="account-details">
                          <article>
                            <p>Fullname</p>
                            <p>${account.fullName}</p>
                          </article>
                          <article>
                          <p>Email</p>
                          <p>${account.ownerEmail}</p>
                        </article>
                          <article>
                            <p>Account Number</p>
                            <p>${account.accountNumber}</p>
                          </article>
                          <article>
                            <p>Account Status</p>
                            <p>${account.status}</p>
                          </article>
                          <article>
                            <p>Account Balance</p>
                            <p>&#8358; ${account.balance}</p>
                          </article>
                          <article class="buttons">
                            <a href="accounts.html">
                              <button>View Account</button>
                            </a>
                            <button class="cancel">Delete Account</button>
                          </article>
                        </article>`;
          return mapped;
        });

        AccountsSection.innerHTML = template;
        return;
      }
      AccountsSection.innerHTML = `<h1>${response.message}</h1>`;
    } catch (e) {
      AccountsSection.innerHTML = `<h1>Something Went Wrong. Please Try Again</h1>`;
    }
  })();
}

const toast = response => {
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
