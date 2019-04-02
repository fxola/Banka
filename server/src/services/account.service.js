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
}

export default AccountService;
