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
  static makeTransaction(accountNumber, amount, cashier, transactionType) {
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
          success: false,
          error: `Request Forbidden`,
          message: `Insufficient Funds. You have ${oldBalance} Naira left`
        };
      }

      if (foundAccount.status !== 'active') {
        return {
          status: 403,
          success: false,
          error: `Request forbidden`,
          message: `Account status:${
            foundAccount.status
          }. You can only perform transactions on an active account.`
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
        success: true,
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
    return { status: 404, success: false, error: `Not found`, message: `Account does not exist` };
  }
}

export default TransactionService;
