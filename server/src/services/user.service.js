import mockData from '../models/mockData';
import Helper from '../helpers/helper';
import User from '../models/user.model';
/**
 *
 * @exports
 * @class UserService
 */
class UserService {
  /**
   *
   * Handles the logic for creating a new user account
   * @static
   * @param {Object} newUser user details present in the incoming request body
   * @returns {Object} API Response Object
   * @memberof UserService
   */
  static createUser(newUser) {
    const { email, firstName, lastName, password } = newUser;
    const hashedpassword = Helper.hashPassword(password);

    const id = mockData.users.length + 1;
    const userInstance = new User(id, email, firstName, lastName, hashedpassword);
    mockData.users.push(userInstance);

    const { isAdmin, type } = userInstance;
    const payLoad = { id, email, isAdmin, type };
    const token = Helper.getToken(payLoad);
    return {
      status: 201,
      success: true,
      data: { id, firstName, lastName, email, token },
      message: `New Account created successfully`
    };
  }

  /**
   *
   * Handles the logic for logging a user into the system
   * @static
   * @param {Object} userCredentials present in th incoming request body
   * @returns {Object} API Response Object
   * @memberof UserService
   */
  static logUserIn(userCredentials) {
    const { email, password } = userCredentials;
    const foundUser = mockData.users.find(user => user.email === email);
    if (!foundUser)
      return {
        status: 401,
        success: false,
        error: 'Authentication Failed. Invalid Login credentials provided'
      };

    const hash = foundUser.password;
    if (Helper.comparePassword(password, hash) === true) {
      const { id, firstName, lastName, isAdmin, type } = foundUser;
      const payLoad = { id, firstName, lastName, email, isAdmin, type };
      const token = Helper.getToken(payLoad);
      return {
        status: 200,
        success: true,
        data: { id, firstName, lastName, email, token },
        message: `User Log In Successful`
      };
    }

    return {
      status: 401,
      success: false,
      error: 'Authentication Failed. Invalid Login credentials provided'
    };
  }

  /**
   *
   * Updates the role of a current user to a staff role
   * @static
   * @param {string} staffEmail
   * @returns
   * @memberof UserService
   */
  static makeStaff(staffEmail) {
    const foundUser = mockData.users.find(user => user.email === staffEmail);
    if (foundUser) {
      const userIndex = mockData.accounts.indexOf(foundUser);
      foundUser.type = 'staff';
      mockData.accounts.splice(userIndex, 1, foundUser);
      return {
        status: 202,
        success: true,
        data: foundUser,
        message: `User type updated succesfully`
      };
    }
    return { status: 404, success: false, error: `Not found`, message: `User does not exist` };
  }
}

export default UserService;
