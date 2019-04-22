/* eslint-disable default-case */
import Account from '../models/AccountModel';
import Transaction from '../models/TransactionModel';
import Helper from '../helpers/helper';

/**
 * @exports AccountService
 *
 * @class AccountService
 */
class AccountService {
  /**
   *
   * Handles the logic for creating a new account
   * @static
   * @param {Object} accountDetails incoming request account details
   * @param {string} userEmail current user's email
   * @param {string} userId current user's ID
   * @returns {Object} API response
   * @memberof AccountService
   */
  static async createBankAccount(accountDetails, userEmail, userId) {
    const { firstName, lastName, email, type } = accountDetails;
    if (email !== userEmail)
      return {
        status: 403,
        success: false,
        error: 'Request Forbidden',
        message: 'You can only create a bank account with your registered e-mail'
      };

    const newAccount = await Account.create(accountDetails, userId);
    const { accountnumber, balance, status } = newAccount;

    return {
      status: 201,
      success: true,
      data: { accountNumber: accountnumber, firstName, lastName, email, type, balance, status },
      message: `New ${type} account created successfully`
    };
  }

  /**
   *
   * Handles the logic for activating or deactivating an account
   * @static
   * @param {string} acctStatus incoming status request
   * @param {integer} accountNumber account number of account to be updated
   * @returns {object} API Response Object
   * @memberof AccountService
   */
  static async updateAccountStatus(validStatus, accountNumber) {
    let status;
    switch (validStatus) {
      case 'activate':
        status = 'active';
        break;
      case 'deactivate':
        status = 'dormant';
        break;
      default:
        status = 'invalid';
    }

    if (status === 'invalid') {
      return {
        status: 403,
        success: false,
        error: `Status can only be 'activate' or 'deactivate'`
      };
    }

    const foundAccount = await Account.findAccount(accountNumber, 'accountnumber');

    if (foundAccount) {
      await Account.update(accountNumber, status, 'status');

      return {
        status: 202,
        success: true,
        data: { accountNumber, status },
        message: `Account ${validStatus}d succesfully`
      };
    }
    return {
      status: 404,
      success: false,
      error: `Not Found`,
      message: `Account does not exist`
    };
  }

  /**
   *
   * Handles the logic for deleting a specific bank account
   * @static
   * @param {integer} accountNumber account number of account to be deleted
   * @returns {object} API Response Object
   * @memberof AccountService
   */
  static async deleteBankAccount(accountNumber) {
    const foundAccount = await Account.findAccount(accountNumber, 'accountnumber');

    if (foundAccount) {
      const deleted = await Account.delete(accountNumber);
      if (deleted) return { status: 200, success: true, message: `Account sucessfully deleted` };
    }
    return { status: 404, success: false, error: `Not found`, message: `Account does not exist` };
  }

  /**
   *
   * Handles the logic for fetching all transactions related to an account
   * @static
   * @param {number} accountNumber
   * @param {number} user
   * @param {string} userType
   * @returns {object} API Response Object
   * @memberof AccountService
   */
  static async fetchAllTransactions(accountNumber, user, userType) {
    const notAllowed = await Helper.checkPermission(accountNumber, user, userType, 'transactions');
    if (notAllowed) return notAllowed;

    const transactions = await Transaction.findAllTransactions(accountNumber);
    if (transactions) {
      const data = transactions.map(transaction => {
        const mappedresult = {
          transactionId: transaction.id,
          accountNumber: parseInt(transaction.accountnumber, 10),
          amount: parseFloat(transaction.amount).toFixed(2),
          cashier: transaction.cashier,
          transactionType: transaction.type,
          oldBalance: transaction.oldbalance,
          newBalance: transaction.newbalance,
          createdOn: transaction.createdon
        };
        return mappedresult;
      });

      return { status: 200, success: true, data };
    }
    return {
      status: 404,
      success: false,
      error: `Not found`,
      message: `There are no transactions for this account currently`
    };
  }

  /**
   *
   * Handles the logic for fetching all accounts on the platform
   * @static
   * @returns {object} API Response Object
   * @memberof AccountService
   */
  static async fetchAccounts(status, route, email) {
    if (status && status !== 'active' && status !== 'dormant') {
      return {
        status: 403,
        success: false,
        error: `Invalid status provided`,
        message: `status can only be 'active' or 'dormant'`
      };
    }

    const foundAccounts = await Account.findAccounts(route, email);
    if (foundAccounts) {
      const data = foundAccounts.map(foundAccount => {
        const mappedresult = {
          createdOn: foundAccount.createdon,
          ownerEmail: foundAccount.email,
          accountNumber: parseInt(foundAccount.accountnumber, 10),
          status: foundAccount.status,
          type: foundAccount.type,
          balance: foundAccount.balance
        };
        return mappedresult;
      });

      return { status: 200, success: true, data };
    }
    let message;
    switch (route) {
      case 'all':
        message = `There are no accounts on the platform currently`;
        break;
      case 'active':
      case 'dormant':
        message = `There are no ${route} accounts on the platform currently`;
        break;
    }
    return {
      status: 404,
      success: false,
      error: `Not found`,
      message
    };
  }

  /**
   *
   * Handles the logic for fetching the details of a single account
   * @static
   * @param {number} accountNumber
   * @returns {object} API Response Object
   * @memberof AccountService
   */
  static async fetchOneAccount(accountNumber, user, userType) {
    const notAllowed = await Helper.checkPermission(accountNumber, user, userType, 'account');
    if (notAllowed) return notAllowed;

    const foundAccount = await Account.findAccount(accountNumber, 'accountnumber');
    const { email, status, type, balance, createdon } = foundAccount;
    return {
      status: 200,
      success: true,
      data: {
        createdOn: createdon,
        ownerEmail: email,
        accountNumber,
        status,
        type,
        balance
      }
    };
  }
}

export default AccountService;
