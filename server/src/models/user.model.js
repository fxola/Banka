/**
 *
 *@exports
 * @class User
 */
class User {
  /**
   *Creates an instance of User.
   * @param {string} id
   * @param {string} email
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} password
   * @param {string} type
   * @param {boolean} [isAdmin=false]
   * @memberof User
   */
  constructor(id, email, firstName, lastName, password, type = 'client', isAdmin = false) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.type = type;
    this.isAdmin = isAdmin;
  }
}

export default User;
