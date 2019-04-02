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
      data: {
        accountNumber,
        firstName,
        lastName,
        email,
        type,
        balance,
        status
      },
      success: true
    };
  }

  /**
   *
   * Handles the logic for activating or deactivating an account
   * @static
   * @param {string} acctStatus incoming status request
   * @param {*} accountNumber account number of account to be updated
   * @returns {object} API Response Object
   * @memberof AccountService
   */
  static updateAccountStatus(acctStatus, accountNumber) {
    const filtered = acctStatus.replace(/\s/g, '');
    if (!filtered) return { status: 403, error: `Status cannot be empty`, success: false };

    const pattern = /^[a-zA-Z]+$/;
    if (!pattern.test(filtered))
      return { status: 403, error: `Status must be alphabetical`, success: false };

    const validStatus = filtered.toLowerCase();

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

    if (!Number(accountNumber)) {
      return {
        status: 403,
        error: `Request Forbidden`,
        success: false,
        message: `Account Number must be an Integer`
      };
    }

    if (!accountNumber.startsWith(102) || accountNumber.length !== 10) {
      return {
        status: 403,
        error: `Request Forbidden`,
        success: false,
        message: `Account Number must be 10 digits and begin with the digits 102.`
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
        data: {
          accountNumber,
          status
        },
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
}

export default AccountService;
