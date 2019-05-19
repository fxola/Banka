// base url for all requests on the platform
const api = "https://bank-a.herokuapp.com/api/v1/";

// lets make our lives easier while trying to query the DOM
let load = element => document.getElementById(`${element}`);
let grab = element => document.querySelectorAll(`${element}`);

/**
 * Handles logic for making Fetch API requests to server
 *
 * @class Api
 *
 */
class Api {
  /**
   *
   *
   * @static
   * @param {string} api base url for api
   * @param {string} endpoint api route
   * @param {object} options fetch API options
   * @returns {object} promise object
   * @memberof Api
   */
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

/********************************************************
 * Handles Logic for signing a user up on the platform
 *
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
    try {
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

      // save user info
      localStorage.setItem("userDetails", JSON.stringify(response.data));

      // redirect to transactions page
      setTimeout(() => {
        window.location.href = "transactions.html";
      }, 3000);
    } catch (e) {
      signUpButton.innerText = `Register`;
      toast({
        success: false,
        message: `Something went wrong, please check your connection and try again`
      });
    }
  });
}

/**********************************************************************
 * Handles Logic for logging a user(staff/client) into the platform
 *
 */
const signInButton = load("login-button");
if (signInButton) {
  signInButton.addEventListener("click", async e => {
    e.preventDefault(); //prevents page from refreshing on click of the submit button
    signInButton.innerText = `Loading...`;

    // get form values
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
    try {
      const response = await Api.makeRequest(api, "auth/signin", options);

      if (response.success === false) {
        signInButton.innerText = `Log in`;
        toast(response);
        return;
      }
      signInButton.innerText = `Log in`;
      toast(response);

      // save token for usage on subsequent requests
      localStorage.setItem("token", response.data.token);

      // redirect successfully logged in user to appropriate pages based on roles
      switch (response.data.type) {
        case "client":
          localStorage.setItem("userDetails", JSON.stringify(response.data));
          setTimeout(() => {
            window.location.href = "transactions.html";
          }, 3000);
          break;
        case "staff":
          localStorage.setItem("isAdmin", response.data.isAdmin);
          setTimeout(() => {
            window.location.href = "admin_dashboard.html";
          }, 3000);
          break;
      }
    } catch (e) {
      signInButton.innerText = `Log in`;
      toast({
        success: false,
        message: `Something went wrong, please check your connection and try again`
      });
    }
  });
}

/****
 * Handles logic for hiding create staff functionality for non-admin staffs
 */
const checkAdminRights = () => {
  const createStaffLink = load("create_staff");
  const hasRights = localStorage.getItem("isAdmin");
  if (hasRights == "false") {
    createStaffLink.style.display = "none";
  }
};

/******************************************************************************
 * Handles Logic for displaying all accounts on the platform for a staff user
 *
 */
const AccountsSection = load("admin-dashboard-section");
if (AccountsSection) {
  checkAdminRights();
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

      // redirect to homepage if token expires
      if (response.status === 401) window.location.href = "index.html";

      // on event that there are accounts on the platform
      if (response.data) {
        // map all accounts on the platform to adhere to the template provided
        const template = response.data
          .map(account => {
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
                            <button  id="delete-trigger" class="cancel">Delete Account</button>
                          </article>
                        </article>`;
            return mapped;
          })
          .join("");

        const deleteModalTemplate = `<article id="delete-modal">
                                      <article id="delete-confirmation">
                                        <p>Are you sure you want to delete this account?</p>
                                        <article>
                                          <button id="delete-account" class="cancel">Yes</button>
                                          <button id="close">No</button>
                                        </article>
                                      </article>
                                    </article>            <article id="delete-modal">
                                    <article id="delete-confirmation">
                                      <p>Are you sure you want to delete this account?</p>
                                      <article>
                                        <button id="delete-account" class="cancel">Yes</button>
                                        <button id="close">No</button>
                                      </article>
                                    </article>
                                  </article>`;

        //attach mapped template to page
        AccountsSection.innerHTML = template + deleteModalTemplate;

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

        /*******************************************************
         * Logic for deleting a specific account record
         *
         */
        const deleteAccountModal = load("delete-modal");
        const deleteAccountButton = load("delete-account");
        const deleteTriggerButtons = grab("#delete-trigger");
        const closebutton = load("close");
        if (deleteTriggerButtons) {
          let accountNumber;
          let accountCard;
          for (button of deleteTriggerButtons) {
            // open  confirmation modal
            button.addEventListener("click", e => {
              deleteAccountModal.style.display = "block";

              // retrieve account number value
              accountNumber =
                e.target.parentElement.parentElement.childNodes[5]
                  .lastElementChild.innerText;

              // retrieve account card for removal on successful deletion
              accountCard = e.target.parentElement.parentElement;
            });
          }

          deleteAccountButton.addEventListener("click", async e => {
            deleteAccountModal.style.display = "none";
            try {
              const deleteOptions = {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                }
              };

              const response = await Api.makeRequest(
                api,
                `accounts/${accountNumber}`,
                deleteOptions
              );
              toast(response);
              if (response.status === 200) {
                setTimeout(() => {
                  accountCard.remove();
                }, 1500);
              }
            } catch (e) {
              toast({
                success: false,
                message: `Something went wrong, please check your connection and try again`
              });
            }
          });

          // close confirmation modal if user clicks outside modal
          window.addEventListener("click", e => {
            if (e.target == deleteAccountModal) {
              deleteAccountModal.style.display = "none";
            }
          });

          // close confirmation modal if user clicks close button
          closebutton.addEventListener("click", () => {
            deleteAccountModal.style.display = "none";
          });

          return;
        }
      }
      // on event that there are no accounts on the platform
      AccountsSection.innerHTML = `<h1 class="loader">${response.message}</h1>`;
      return;
    } catch (e) {
      // Handle unexpected error e.g slow network/server error
      AccountsSection.innerHTML = `<h1 class="loader">Something Went Wrong. Please Try Again</h1>`;
    }
  })();
}

/*********************************************************************************
 * Handles logic for displaying account information for a single bank account
 *
 */
const singleAccount = load("accounts-section");
if (singleAccount) {
  checkAdminRights();
  // set html content while waiting for response from  the server
  singleAccount.innerHTML = `<h1 class="loader">Fetching Account Details...<h1>`;

  // get request parameters
  const acctNumber = localStorage.getItem("accountnumber");
  const token = localStorage.getItem("token");

  // redirect to homepage if token isn't available
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

      // redirect to homepage if token expires
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
                          <p>Account Status</p> <p id="status">${
                            userAccountDetails.status
                          }</p>
                        </article>
                        <article>
                          <p>Account Balance</p> <p id="balance">&#8358; ${
                            userAccountDetails.balance
                          }</p>
                        </article>
                      </article>
                      <article class="actions">
                        <h1>Actions</h1>
                        <article class="action-buttons">
                          <a href="#transaction-modal"><button>Make Transaction</button></a>
                          <button id="activate" class="activate">Activate</button>
                          <button id="deactivate" class="cancel">Deactivate</button>
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
                                              <input type="number"  id ="amount"placeholder="Transaction Amount" >
                                      </article>
                                          <a href="#"><button class="confirm" id="confirm">Make Transaction</button><a/>
                                          <a href="#"><button class="cancel" >Cancel</button><a/>
                                      </form>
                              </article>
                    </article>`;

      // set template on getting succesful response from server
      singleAccount.innerHTML = template;

      /*********************************************************
       * Handles Logic for performing credit/debit transactions
       *
       */
      const transactionForm = load("transaction-form");

      if (transactionForm) {
        const transactionButton = load("confirm");
        const balanceState = load("balance");
        if (transactionButton) {
          transactionButton.addEventListener("click", async e => {
            e.preventDefault(); //prevents page from refreshing on click of the submit button

            transactionButton.innerText = `Processing..`;

            // get form values
            const transactionType = load("transaction-type").value;
            const amount = load("amount").value;

            //get request parameters
            const token = localStorage.getItem("token");
            const acctNumber = localStorage.getItem("accountnumber");

            const data = { amount };

            // set fetch API options
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

              transactionButton.innerText = `Make Transaction`;
              window.location.href = "#";
              toast(response);

              // update account balance after transaction
              if (response.success) {
                balanceState.innerHTML = `<p id="balance">&#8358; ${
                  response.data.accountBalance
                }</p>`;
              }
            } catch (e) {
              transactionButton.innerText = `Make Transaction`;
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

      /***************************************************
       * Logic For Activating and Deactivating an account
       *
       */
      const activateAccountButton = load("activate");
      const deactivateAccountButton = load("deactivate");
      const statusState = load("status");
      // perform account activation operation
      activateAccountButton.addEventListener("click", async () => {
        try {
          await updateAccountStatus("activate");
        } catch (e) {
          toast({
            success: false,
            message: `Something Went Wrong. Please Try Again`
          });
        }
      });

      // perform account deactivation operation
      deactivateAccountButton.addEventListener("click", async () => {
        try {
          await updateAccountStatus("deactivate");
        } catch (e) {
          toast({
            success: false,
            message: `Something Went Wrong. Please Try Again`
          });
        }
      });

      /**
       *  Handles Fetch API request to update account status and manipulate status buttons
       * @param {string} status (activate or deactivate)
       */
      const updateAccountStatus = async status => {
        switch (status) {
          case "activate":
            activateAccountButton.innerText = `Processing...`;
            break;
          case "deactivate":
            deactivateAccountButton.innerText = `Processing...`;
            break;
        }

        const options = {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        };
        // make Api call
        const response = await Api.makeRequest(
          api,
          `accounts/${acctNumber}`,
          options
        );

        if (response.success === true) {
          switch (status) {
            case "activate":
              activatedButtonState(statusState, false, response);
              break;
            case "deactivate":
              deactivatedButtonState(statusState, false, response);
              break;
          }
          toast(response);
        }
      };

      /**
       *
       * @param {DOMElement} status - paragraph containing the status of the account on the DOM
       * @param {Boolean} stateExists - if the account has been previously activated or deactivated
       * @param {Object} response - new state of the activated or deactivated account
       */
      const deactivatedButtonState = (status, stateExists, response) => {
        deactivateAccountButton.innerText = `Deactivated`;
        deactivateAccountButton.style.cursor = "n-resize";
        deactivateAccountButton.disabled = true;
        activateAccountButton.disabled = false;
        activateAccountButton.style.cursor = "pointer";
        activateAccountButton.innerText = `Activate`;

        if (stateExists) {
          status.innerText = response.status;
          return;
        }
        status.innerText = `${response.data.status}`;
      };

      /**
       *
       * @param {DOMElement} status - paragraph containing the status of the account on the DOM
       * @param {Boolean} stateExists - if the account has been previously activated or deactivated
       * @param {Object} response - new state of the activated or deactivated account
       */
      const activatedButtonState = (status, stateExists, response) => {
        activateAccountButton.innerText = `Activated`;
        activateAccountButton.disabled = true;
        activateAccountButton.style.cursor = "n-resize";
        deactivateAccountButton.style.cursor = "pointer";
        deactivateAccountButton.disabled = false;
        deactivateAccountButton.innerText = `Deactivate`;
        if (stateExists) {
          status.innerText = response.status;
          return;
        }
        status.innerText = `${response.data.status}`;
      };

      /**
       *  Checks if the account has been previously activated or deactivated then applies appropriate button state
       */
      switch (userAccountDetails.status) {
        case "dormant":
          deactivatedButtonState(statusState, true, userAccountDetails);
          break;
        case "active":
          activatedButtonState(statusState, true, userAccountDetails);
          break;
      }
    } catch (e) {
      // Handle unexpected error e.g slow network/server error, while geeting account information
      singleAccount.innerHTML = `<h1 class="loader">Something Went Wrong. Please Try Again</h1>`;
    }
  })();
}

/**********************************
 * Logic For creating a staff user
 *
 */
const createStaffSection = load("create-user-section");
if (createStaffSection) {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "index.html";

  const createStaffButton = load("create_staff_user");
  createStaffButton.addEventListener("click", async e => {
    e.preventDefault();

    // set button text to demonstrate initaiation of request
    createStaffButton.innerText = `Loading...`;

    // get form values
    const firstName = load("firstname").value;
    const lastName = load("lastname").value;
    const email = load("email").value;
    const password = load("password").value;
    const confirmPassword = load("confirmPassword").value;
    const type = load("user-type").value;

    const data = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      type
    };

    // set fetch API options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    };

    const response = await Api.makeRequest(api, "auth/makestaff", options);

    if (response.status === 401) window.location.href = "index.html";

    if (response.success === false) {
      // set button text to demonstrate conclusion of request
      createStaffButton.innerText = `Create User Account`;
      toast(response);
      return;
    }

    createStaffButton.innerText = `Create User Account`;
    toast(response);
  });
}

/***************************************************************************
 * Handles Logic for displaying all transactions for a user's bank account
 *
 */
const transactionSection = load("transaction-section");
if (transactionSection) {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "index.html";

  const client = JSON.parse(localStorage.getItem("userDetails"));
  const welcomeMessage = load("welcome");
  welcomeMessage.innerText = `Welcome, ${client.firstName}`;

  // set fetch API options
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${client.token}`
    }
  };

  /*****
   * Handles Logic for fetching client's account number
   *  @param {string} email client email address
   * @returns {number|boolean} client's account number or false if unsuccessful
   */
  const getClientAccountNumber = async email => {
    const response = await Api.makeRequest(
      api,
      `user/${email}/accounts`,
      options
    );

    // redirect to homepage if token expires
    if (response.status === 401) window.location.href = "index.html";

    // save client account details for subsequent usage
    if (response.status === 200) {
      localStorage.setItem(
        "clientAccountDetails",
        JSON.stringify(response.data[0])
      );
    }
    if (response.data) return response.data[0].accountNumber;
    return false;
  };

  /*****
   * Handles Logic for fetching a client's account transactions
   * @param {number} accountnumber client's account number
   * @returns {array|boolean} client's account transactions or false if unsuccessful
   */
  const getClientTransactions = async accountnumber => {
    const response = await Api.makeRequest(
      api,
      `accounts/${accountnumber}/transactions`,
      options
    );

    // redirect to homepage if token expires
    if (response.status === 401) window.location.href = "index.html";

    if (response.data) return response.data;
    return false;
  };

  (async () => {
    const transactionTable = load("transaction-table");
    try {
      transactionTable.innerHTML = "<h1><mark>Loading...</mark></h1>";
      const acctNumber = await getClientAccountNumber(client.email);
      if (acctNumber) {
        const transactions = await getClientTransactions(acctNumber);
        if (transactions) {
          const tableHeaderTemplate = `<table class="transaction-table" cellspacing="0">
                                    <thead>
                                      <tr>
                                        <th>View Transaction</th>
                                        <th>Transaction Time</th>
                                        <th>Transaction Type</th>
                                        <th>&#8358; Amount</th>
                                        <th>&#8358; Old Balance</th>
                                        <th>&#8358; New Balance</th>
                                      </tr>
                                    </thead>
                                  <tbody>`;

          const tableFooterTemplate = `</tbody> </table>`;

          const transactionTemplate = transactions
            .map(transaction => {
              const mapped = `<tr class=${transaction.transactionType}>
                            <td><button id="view">View</button></td>
                            <td>${transaction.createdOn}</td>
                            <td>${transaction.transactionType}</td>
                            <td>&#8358;${transaction.amount}</td>
                            <td>&#8358;${transaction.oldBalance}</td>
                            <td>&#8358;${transaction.newBalance}</td>
                         </tr>`;
              return mapped;
            })
            .join("");

          const singleTxTemplate = `<article id="tx-modal">
                                      <article id="tx-content">
                                        <span id="close-tx">x</span>
                                        <h1>Transaction details &#x1F4B0; &#x1F4B0;</h1>
                                        <table>
                                          <tr>
                                            <td id="tag">Transaction Time</td>
                                            <td id="tx-time">26-03-2019 15:55:01</td>
                                          </tr>
                                          <tr>
                                            <td id="tag">Transaction type</td>
                                            <td id="tx-type">Credit</td>
                                          </tr>
                                          <tr>
                                            <td id="tag">Amount</td>
                                            <td id ="tx-amount">&#8358;25,000</td>
                                          </tr>
                                          <tr>
                                            <td id="tag">Old Balance</td>
                                            <td id="tx-old">&#8358;25,000</td>
                                          </tr>
                                          <tr>
                                            <td id="tag">New Balance</td>
                                            <td id="tx-new">&#8358;25,000</td>
                                          </tr>
                                        </table>
                                      </article>`;

          transactionTable.innerHTML =
            tableHeaderTemplate +
            transactionTemplate +
            tableFooterTemplate +
            singleTxTemplate;
          let txDetails;

          const txModal = load("tx-modal");

          // get all view transaction buttons form DOM
          const viewButtons = grab("#view");
          if (viewButtons) {
            for (button of viewButtons) {
              button.addEventListener("click", e => {
                //open modal
                txModal.style.display = "block";

                //get row details of clicked transaction
                txDetails = e.target.parentElement.parentElement.children;

                // query DOM for transaction template
                const txTime = load("tx-time");
                const txType = load("tx-type");
                const txAmount = load("tx-amount");
                const txOld = load("tx-old");
                const txNew = load("tx-new");

                // assign transaction values to template
                txTime.innerText = txDetails[1].innerText;
                txType.innerText = txDetails[2].innerText;
                txAmount.innerText = txDetails[3].innerText;
                txOld.innerText = txDetails[4].innerText;
                txNew.innerText = txDetails[5].innerText;
              });
            }
            const closeButton = document.getElementById("close-tx");
            if (closeButton) {
              // close modal when user clicks the x button/logo
              closeButton.addEventListener("click", () => {
                txModal.style.display = "none";
              });
            }

            //close modal when user clicks outside the modal
            window.addEventListener("click", e => {
              if (e.target == txModal) {
                txModal.style.display = "none";
              }
            });
            return;
          }
        }
        transactionTable.innerHTML = `<h1><mark>There are no transactions for your bank account yet</mark></h1>`;
        return;
      }

      transactionTable.innerHTML = `<h1><mark>You have no transactions yet, Try creating a bank account from your profile first</mark></h1>`;
    } catch (e) {
      console.log(e);
      transactionTable.innerHTML = `<h1><mark>Something went wrong, Please Check your connection and try again</mark></h1>`;
    }
  })();
}

const userProfile = load("dashboard-section");
if (userProfile) {
  const profileSection = load("profile");
  const client = JSON.parse(localStorage.getItem("userDetails"));
  if (!client) window.location.href = "index.html";
  const accountDetails = JSON.parse(
    localStorage.getItem("clientAccountDetails")
  );
  const createAccountButton = load("account");
  let defaultTemplate;
  defaultTemplate = `
          <article id="photo">
            <article class="card-img">
              <img id="img" src="img/avatar.png" alt="profile photo" />
            </article>
            <article class="container">
              <p id="name">${client.firstName} ${client.lastName}</p>
            </article>
          </article>
          <article class="details">
            <article>
              <p>
                Account Number
              </p>
              <p id="acct-num"class="account-number"> - </p>
            </article>
            <article>
              <p>Account Balance</p>
              <p id="profile-balance" class="account-balance">&#8358; 0.00</p>
            </article>
            <article>
              <p>Account Status</p>
              <p id="profile-status" class="account-status"> - </p>
            </article>
            <article>
                <p>
                  Email Address
                </p>
                <p id="profile-email" class="account-number">${client.email}</p>
              </article>
          </article>
                      `;

  if (accountDetails) {
    defaultTemplate = `
      <article id="photo">
        <article class="card-img">
          <img src="img/avatar.png" alt="profile photo" />
        </article>
        <article class="container">
          <p id="name">${accountDetails.fullName}</p>
        </article>
      </article>
      <article class="details">
        <article>
          <p>
            Account Number
          </p>
          <p id="acct-num"class="account-number">${
            accountDetails.accountNumber
          }</p>
        </article>
        <article>
          <p>Account Balance</p>
          <p id="profile-balance" class="account-balance">&#8358; ${
            accountDetails.balance
          }</p>
        </article>
        <article>
          <p>Account Status</p>
          <p id="profile-status" class="account-status">${
            accountDetails.status
          }</p>
        </article>
        <article>
            <p>
              Email Address
            </p>
            <p id="profile-email" class="account-number">${
              accountDetails.ownerEmail
            }</p>
          </article>
      </article>
      
    `;

    createAccountButton.style.display = "none";
  }

  profileSection.innerHTML = defaultTemplate;

  const accountButton = load("confirm");
  accountButton.addEventListener("click", async e => {
    e.preventDefault();
    accountButton.innerText = "Processing...";

    const type = load("type").value;
    const avatar = load("avatar").value;
    const data = { type, avatar };

    console.log(avatar);
    // set fetch API options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${client.token}`
      },
      body: JSON.stringify(data)
    };

    const response = await Api.makeRequest(api, `accounts`, options);

    // redirect to homepage if token expires
    if (response.status === 401) window.location.href = "index.html";

    if (response.success === true) {
      const accountStatus = load("profile-status");
      const accountNumber = load("acct-num");
      const fullName = load("name");
      const email = load("profile-email");

      accountStatus.innerText = response.data.status;
      accountNumber.innerText = response.data.accountNumber;
      fullName.innerText = `${response.data.firstName} ${
        response.data.lastName
      }`;
      email.innerText = response.data.email;

      window.location.href = "#";
      accountButton.innerText = "Confirm";
      createAccountButton.style.display = "none";
      toast(response);

      return;
    }
    window.location.href = "#";
    toast(response);
    accountButton.innerText = "Confirm";
  });
}

/****
 * Logic for clearing localstorage on logging out of the platform
 */
const logOutButtton = load("logout");
if (logOutButtton) {
  logOutButtton.addEventListener("click", () => {
    localStorage.clear();
  });
}
