/* eslint-disable default-case */
import Transaction from '../models/transaction.model';
import Account from '../models/account.model';

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
  static async makeTransaction(accountNumber, amount, cashier, transactionType) {
    const foundAccount = await Account.findAccount(accountNumber);

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

      const txObj = { transactionType, accountNumber, cashier, amount, oldBalance, newBalance };

      // save new transaction
      const newTransaction = await Transaction.create(txObj);
      const { id } = newTransaction;

      // update account with new balance
      await Account.update(accountNumber, newBalance, 'balance');

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

  /**
   *
   * Handles the logic for fetching a single transaction
   * @static
   * @param {number} id transaction ID
   * @param {number} user ID if the currently logged in user
   * @param {string} userType staff or client user
   * @returns
   * @memberof TransactionService
   */
  static async fetchSingleTransaction(id, user, userType) {
    const transaction = await Transaction.findOneTransaction(id);
    if (transaction) {
      const owner = await Account.getAccountOwner(transaction.accountnumber);
      let allowed = false;
      if (owner === user || userType === 'staff') {
        allowed = true;
      }

      if (!allowed) {
        return {
          status: 403,
          success: false,
          error: `Request forbidden`,
          message: `You don't have permission to view this transaction`
        };
      }
      return {
        status: 200,
        success: true,
        data: {
          transactionId: transaction.id,
          accountNumber: parseInt(transaction.accountnumber, 10),
          amount: transaction.amount,
          cashier: transaction.cashier,
          transactionType: transaction.type,
          oldBalance: transaction.oldbalance,
          newBalance: transaction.newbalance,
          createdOn: transaction.createdon
        }
      };
    }

    return {
      status: 404,
      error: `Not found`,
      message: `Transaction does not exist`,
      success: false
    };
  }
}

export default TransactionService;
