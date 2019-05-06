const api = "https://bank-a.herokuapp.com/api/v1/";

let load = element => document.getElementById(`${element}`);
let grab = element => document.querySelectorAll(`${element}`);

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
  AccountsSection.innerHTML = `<h1 class="loader">Getting Accounts...</h1>`;
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
                            <p id="account-number">${account.accountNumber}</p>
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
                            <a>
                              <button id="view-account">View Account</button>
                            </a>
                            <button class="cancel">Delete Account</button>
                          </article>
                        </article>`;
          return mapped;
        });

        AccountsSection.innerHTML = template;
        const viewAccountButtons = grab("#view-account");
        if (viewAccountButtons) {
          for (button of viewAccountButtons) {
            button.addEventListener("click", async e => {
              e.preventDefault();
              const acctNumber =
                e.target.parentElement.parentElement.parentElement.childNodes[5]
                  .lastElementChild.innerText;
              localStorage.setItem("accountnumber", acctNumber);
              window.location.href = "accounts.html";
            });
          }
        }
        return;
      }
      AccountsSection.innerHTML = `<h1 class="loader">${response.message}</h1>`;
    } catch (e) {
      AccountsSection.innerHTML = `<h1 class="loader">Something Went Wrong. Please Try Again</h1>`;
    }
  })();
}

const singleAccount = load("accounts-section");
if (singleAccount) {
  singleAccount.innerHTML = `<h1 class="loader">Fetching Account Details...<h1>`;
  const acctNumber = localStorage.getItem("accountnumber");
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
      const response = await Api.makeRequest(
        api,
        `accounts/${acctNumber}`,
        options
      );
      if (response.status === 401) window.location.href = "index.html";
      const userAccountDetails = response.data;

      const template = `<article class="account-record">
                      <article class="record-details">
                        <figure>
                          <img
                            height="100px"
                            width="100px"
                            src= "img/avatar.png"
                            alt="profile photo"
                          />
                        </figure>

                        <article>
                          <p>Fullname</p> <p>${userAccountDetails.fullName}</p>
                        </article>
                        <article>
                          <p>Account Number</p> <p>${
                            userAccountDetails.accountNumber
                          }</p>
                        </article>
                        <article>
                          <p>Account Status</p> <p>${
                            userAccountDetails.status
                          }</p>
                        </article>
                        <article>
                          <p>Account Balance</p> <p>&#8358; ${
                            userAccountDetails.balance
                          }</p>
                        </article>
                      </article>
                      <article class="actions">
                        <h1>Actions</h1>
                        <article class="action-buttons">
                          <a href="#transaction-modal"><button>Make Transaction</button></a>
                          <button class="activate">Activate</button>
                          <button class="cancel">Deactivate</button>
                        </article>
                      </article>
                      <article id="transaction-modal">
                              <article class="transaction-modal-content" id="transaction-modal">
                                  <form action="#" id="transaction-form">
                                      <article class="fields">
                                              <input  id="transaction-type" list="type" placeholder="Select Transaction Type (credit or debit)">
                                              <datalist id="type">
                                                      <option>credit</option>
                                                      <option>debit</option>
                                              </datalist>
                                              <input type="amount"  placeholder="Transaction Amount">
                                      </article>
                                          <a href="#"><button class="confirm" >Make Transaction</button><a/>
                                          <a href="#"><button class="cancel" >Cancel</button><a/>
                                      </form>
                              </article>
                    </article>`;
      singleAccount.innerHTML = template;
    } catch (e) {
      singleAccount.innerHTML = `<h1 class="loader">Something Went Wrong. Please Try Again</h1>`;
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
