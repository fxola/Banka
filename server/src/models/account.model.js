/**
 * @exports Account
 *
 * @class Account
 */
class Account {
  /**
   *Creates an instance of Account.
   * @param {integer} id
   * @param {string} createdOn
   * @param {integer} owner
   * @param {string} type
   * @param {string} [status='draft']
   * @param {float} [balance=0.0]
   * @memberof Account
   */
  constructor(id, createdOn, owner, type, status = 'draft', balance = 0.0) {
    this.id = id;
    this.createdOn = createdOn;
    this.owner = owner;
    this.type = type;
    this.status = status;
    this.balance = parseFloat(balance).toFixed(2);
    this.accountNumber = Account.generateAccountNumber();
  }

  /**
   *
   * Generates a new account number
   * @static
   * @returns {number} Account number
   * @memberof Account
   */
  static generateAccountNumber() {
    let acctNumber = `102${Math.floor(Math.random() * 10000000)}`;
    if (acctNumber.length === 9) acctNumber += '0';
    return Number(acctNumber);
  }
}

export default Account;
