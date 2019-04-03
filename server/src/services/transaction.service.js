/* eslint-disable default-case */
import Transaction from '../models/transaction.model';
import mockData from '../models/mockData';

/**
 * @exports TransactionService
 *
 * @class TransactionService
 */
class TransactionService {
  /**
   * Handles the logic for making a debit or credit transaction
   *
   * @static
   * @param {number} accountNumber
   * @param {number} amount
   * @param {number} cashier
   * @param {string} type
   * @param {string} urltype
   * @returns {object} API response object
   * @memberof TransactionService
   */
  static makeTransaction(accountNumber, amount, cashier, type, urltype) {
    const filtered = type.replace(/\s/g, '');
    if (!filtered) {
      return {
        status: 403,
        error: `Request Forbidden`,
        message: `Transaction type cannot be empty`,
        success: false
      };
    }

    const pattern = /^[a-zA-Z]+$/;
    if (!pattern.test(filtered))
      return {
        status: 403,
        error: `Request forbidden`,
        message: `Status must be alphabetical`,
        success: false
      };

    const validtype = filtered.toLowerCase();

    let transactionType;
    switch (validtype) {
      case 'credit':
        transactionType = validtype;
        break;
      case 'debit':
        transactionType = validtype;
        break;
      default:
        transactionType = 'invalid';
    }

    if (urltype !== transactionType) {
      return {
        status: 403,
        error: `Request forbidden`,
        mesasage: `Please confirm that the url matches the transaction type`,
        success: false
      };
    }
    if (transactionType === 'invalid') {
      return {
        status: 403,
        error: `request forbidden`,
        mesasage: `Transaction type can only be 'debit' or 'credit'`,
        success: false
      };
    }

    if (!Number(accountNumber) || !Number(amount)) {
      return {
        status: 403,
        error: `Request Forbidden`,
        success: false,
        message: `Account Number and transaction amount must be a number`
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

    if (Number(amount) < 500) {
      return {
        status: 403,
        error: `Request Forbidden`,
        success: false,
        message: `You can only make ${transactionType} transactions above 500 Naira.`
      };
    }

    const foundAccount = mockData.accounts.find(
      account => account.accountNumber === parseInt(accountNumber, 10)
    );

    if (foundAccount) {
      const oldBalance = parseFloat(foundAccount.balance);

      if (
        (transactionType === 'debit' && oldBalance <= 0) ||
        (transactionType === 'debit' && oldBalance < Number(amount))
      ) {
        return {
          status: 403,
          error: `Request Forbidden`,
          success: false,
          message: `Insufficient Funds. You have ${oldBalance} Naira left`
        };
      }

      if (foundAccount.status !== 'active') {
        return {
          status: 403,
          error: `Request forbidden`,
          success: false,
          message: `Account status:${
            foundAccount.status
          }.You can only perform transactions on an active account.`
        };
      }

      let newBalance;
      switch (transactionType) {
        case 'credit':
          newBalance = (oldBalance + parseFloat(amount)).toFixed(2);
          break;
        case 'debit':
          newBalance = (oldBalance - parseFloat(amount)).toFixed(2);
          break;
      }
      const id = mockData.transactions.length + 1;
      const createdOn = new Date();

      const transactionInstance = new Transaction(
        id,
        createdOn,
        transactionType,
        accountNumber,
        cashier,
        amount,
        oldBalance,
        newBalance
      );
      // save new transaction
      mockData.transactions.push(transactionInstance);

      // update account with new balance
      const accountIndex = mockData.accounts.indexOf(foundAccount);
      foundAccount.balance = parseFloat(newBalance);
      mockData.accounts.splice(accountIndex, 1, foundAccount);

      return {
        status: 201,
        data: {
          transactionId: id,
          accountNumber: parseInt(accountNumber, 10),
          amount: parseFloat(amount).toFixed(2),
          cashier,
          transactionType,
          accountBalance: newBalance
        },
        message: `Account ${transactionType}ed successfully`
      };
    }
    return { status: 404, error: `Not found`, message: `Account does not exist`, success: false };
  }
}

export default TransactionService;
