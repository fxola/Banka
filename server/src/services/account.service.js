import Account from '../models/account.model';
import mockData from '../models/mockData';

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
  static createBankAccount(accountDetails, userEmail, userId) {
    const { firstName, lastName, email, type } = accountDetails;
    if (email !== userEmail)
      return {
        status: 403,
        error: 'Request Forbidden. You can only create a bank account with your registered e-mail',
        succcess: false
      };

    const id = mockData.accounts.length + 1;
    const createdOn = new Date();

    const accountInstance = new Account(id, createdOn, userId, type);
    mockData.accounts.push(accountInstance);

    const { accountNumber, balance, status } = accountInstance;

    return {
      status: 201,
      data: { accountNumber, firstName, lastName, email, type, balance, status },
      success: true
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
  static updateAccountStatus(validStatus, accountNumber) {
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
        error: `Status can only be 'activate' or 'deactivate'`,
        success: false
      };
    }

    const foundAccount = mockData.accounts.find(
      account => account.accountNumber === parseInt(accountNumber, 10)
    );

    if (foundAccount) {
      const accountIndex = mockData.accounts.indexOf(foundAccount);
      foundAccount.status = status;
      mockData.accounts.splice(accountIndex, 1, foundAccount);
      return {
        status: 202,
        data: { accountNumber, status },
        success: true,
        message: `Account ${validStatus}d succesfully`
      };
    }
    return {
      status: 404,
      error: `Not Found`,
      success: false,
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
  static deleteBankAccount(accountNumber) {
    const foundAccount = mockData.accounts.find(
      account => account.accountNumber === parseInt(accountNumber, 10)
    );

    if (foundAccount) {
      const accountIndex = mockData.accounts.indexOf(foundAccount);
      mockData.accounts.splice(accountIndex, 1);
      return { status: 200, message: `Account sucessfully deleted`, success: true };
    }
    return { status: 404, error: `Not found`, message: `Account does not exist`, success: false };
  }
}

export default AccountService;