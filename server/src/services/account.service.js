import Account from '../models/account.model';

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

    const foundAccount = await Account.find(accountNumber);

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
    const foundAccount = await Account.find(accountNumber);

    if (foundAccount) {
      const deleted = await Account.delete(accountNumber);
      if (deleted) return { status: 200, success: true, message: `Account sucessfully deleted` };
    }
    return { status: 404, success: false, error: `Not found`, message: `Account does not exist` };
  }
}

export default AccountService;
