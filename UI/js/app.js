// base url for all requests on the platform
const api = "https://bank-a.herokuapp.com/api/v1/";

// lets make our lives easier while trying to query the DOM
let load = element => document.getElementById(`${element}`);
let grab = element => document.querySelectorAll(`${element}`);

/**
 * Handles logic for making Fetch API requests to server
 *
 * @class Api
 * @returns {promise object}
 */
class Api {
  static async makeRequest(api, endpoint, options) {
    const response = await fetch(`${api}${endpoint}`, options);
    return await response.json();
  }
}

/**
 *  Displays pop-up Notification
 * @param {object} response
 */
const toast = response => {
  let alertBox = load("alert");
  alertBox.style.display = "block";
  alertBox.style.backgroundColor = "red";
  if (response.success === true) alertBox.style.backgroundColor = "green";
  alertBox.innerHTML = `<p>${response.message}</p>`;
  if (!response.message) alertBox.innerHTML = `<p>${response.error}</p>`;
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 3000);
};

/**
 * Hnadles Logic for signing a user up on the platform
 */
const signUpButton = load("register-button");
if (signUpButton) {
  signUpButton.addEventListener("click", async e => {
    e.preventDefault();

    // set buuton text to demonstrate initaiation of request
    signUpButton.innerText = `Loading...`;

    // get form values
    const firstName = load("firstname").value;
    const lastName = load("lastname").value;
    const email = load("email").value;
    const password = load("password").value;
    const confirmPassword = load("confirmpassword").value;

    const data = { firstName, lastName, email, password, confirmPassword };

    // set fetch API options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await Api.makeRequest(api, "auth/signup", options);

    if (response.success === false) {
      // set button text to demonstrate conclusion of request
      signUpButton.innerText = `Register`;
      toast(response);
      return;
    }

    // set button text to demonstrate conclusion of request
    signUpButton.innerText = `Register`;
    toast(response);

    // save token for usage on subsequent requests
    localStorage.setItem("token", response.data.token);

    // redirect to transactions page
    setTimeout(() => {
      window.location.href = "transactions.html";
    }, 3000);
  });
}

/**
 * Handles Logic for logging a user(staff/client) into the platform
 */
const signInButton = load("login-button");
if (signInButton) {
  signInButton.addEventListener("click", async e => {
    e.preventDefault(); //prevents page from refreshing on click of the submit button
    signInButton.innerText = `Loading...`;

    // get from values
    const email = load("email").value;
    const password = load("password").value;
    const data = { email, password };

    // set fetch API options
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

    // save token for usage on sun=bsequent requests
    localStorage.setItem("token", response.data.token);

    // redirect successfully logged in user to appropraite pages based on roles
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

/**
 * Handles Logic for displaying all accounts on the platform for a staff user
 */
const AccountsSection = load("admin-dashboard-section");
if (AccountsSection) {
  AccountsSection.innerHTML = `<h1 class="loader">Getting Accounts...</h1>`;
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "index.html";

  // set fetch API options
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

      // redirect to hompage if token expires
      if (response.status === 401) window.location.href = "index.html";

      // on event that there are accounts on the platform
      if (response.data.length > 0) {
        // map all accounts on the platform to adhere to the template provided
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

        //attach template to page
        AccountsSection.innerHTML = template;

        // get all 'view accounts' button on page
        const viewAccountButtons = grab("#view-account");
        if (viewAccountButtons) {
          // attach an event listener to all the view buttons on the page
          for (button of viewAccountButtons) {
            button.addEventListener("click", async e => {
              e.preventDefault();
              // traverse the DOM  to get the account number of the clicked "view-accounts" button
              const acctNumber =
                e.target.parentElement.parentElement.parentElement.childNodes[5]
                  .lastElementChild.innerText;

              // save the account number of the clicked account for subsequent usage(making transactions)
              localStorage.setItem("accountnumber", acctNumber);

              // redirect to the template for viewing single account details
              window.location.href = "accounts.html";
            });
          }
        }
        return;
      }
      // on event that there are no accounts on the platform
      AccountsSection.innerHTML = `<h1 class="loader">${response.message}</h1>`;
    } catch (e) {
      // Handle unexpected error e.g slow network/server error
      AccountsSection.innerHTML = `<h1 class="loader">Something Went Wrong. Please Try Again</h1>`;
    }
  })();
}
/**
 * Handles logic for displaying account information for a single bank account
 */
const singleAccount = load("accounts-section");
if (singleAccount) {
  // set html content while waiting for response from  the server
  singleAccount.innerHTML = `<h1 class="loader">Fetching Account Details...<h1>`;

  // get request parameters
  const acctNumber = localStorage.getItem("accountnumber");
  const token = localStorage.getItem("token");

  // redirect to hompage if token isn't available
  if (!token) window.location.href = "index.html";

  // set fetch API options
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

      // redirect to hompage if token expires
      if (response.status === 401) window.location.href = "index.html";

      const userAccountDetails = response.data;
      const template = `<article class="account-record">
                      <article id="alert"></article>
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
                                              <select required id="transaction-type"  placeholder="Select Transaction Type (credit or debit)">
                                                      <option value = "credit">credit</option>
                                                      <option value = "debit">debit</option>
                                              </select>
                                              <input type="number"  id ="amount"placeholder="Transaction Amount" required>
                                      </article>
                                          <a href="#"><button class="confirm" id="confirm">Make Transaction</button><a/>
                                          <a href="#"><button class="cancel" >Cancel</button><a/>
                                      </form>
                              </article>
                    </article>`;

      // set template on getting succesful response from server
      singleAccount.innerHTML = template;

      /**
       * Handles Logic for performing credit/debit transactions
       */
      const transactionForm = load("transaction-form");
      if (transactionForm) {
        const transactionButton = load("confirm");
        if (transactionButton) {
          transactionButton.addEventListener("click", async e => {
            e.preventDefault(); //prevents page from refreshing on click of the submit button

            // get form values
            const transactionType = load("transaction-type").value;
            const amount = load("amount").value;

            //get request parameters
            const token = localStorage.getItem("token");
            const acctNumber = localStorage.getItem("accountnumber");

            const data = { amount };
            const options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(data)
            };

            // make Api call
            try {
              const response = await Api.makeRequest(
                api,
                `transactions/${acctNumber}/${transactionType}`,
                options
              );
              window.location.href = "#";
              toast(response);
            } catch (e) {
              // Handle unexpected error e.g slow network/server error, while making transaction
              window.location.href = "#";
              toast({
                success: false,
                message: `Something Went Wrong. Please Try Again`
              });
            }
          });
        }
      }
    } catch (e) {
      // Handle unexpected error e.g slow network/server error, while geeting account information
      singleAccount.innerHTML = `<h1 class="loader">Something Went Wrong. Please Try Again</h1>`;
    }
  })();
}
