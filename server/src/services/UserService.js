/* eslint-disable default-case */
import Helper from '../helpers/helper';
import User from '../models/UserModel';
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
  static async createUser(newUser, userType) {
    const { password } = newUser;
    const hashedpassword = Helper.hashPassword(password);
    const userObj = {
      ...newUser,
      hashedpassword
    };

    const user = await User.create(userObj, userType);

    const { id, firstname, lastname, email, isAdmin, type } = user;
    const payLoad = { id, email, isAdmin, type };
    const token = Helper.getToken(payLoad);
    return {
      status: 201,
      success: true,
      data: { id, firstName: firstname, lastName: lastname, email, type, token },
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
  static async logUserIn(userCredentials) {
    const { email, password } = userCredentials;
    const foundUser = await User.findByEmail(email);
    if (!foundUser)
      return {
        status: 401,
        success: false,
        error: 'Authentication Failed. Invalid Login credentials provided'
      };

    const hash = foundUser.password;
    if (Helper.comparePassword(password, hash) === true) {
      const { id, firstname, lastname, isadmin, type } = foundUser;
      const payLoad = {
        id,
        firstName: firstname,
        lastName: lastname,
        email,
        isAdmin: isadmin,
        type
      };
      const token = Helper.getToken(payLoad);
      return {
        status: 200,
        success: true,
        data: {
          id,
          firstName: firstname,
          lastName: lastname,
          email,
          type,
          token,
          isAdmin: isadmin
        },
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
   * Creates a new staff user
   * @static
   * @param {string} staffEmail
   * @returns
   * @memberof UserService
   */
  static async makeStaff(staffDetails) {
    if (staffDetails.type !== 'admin' && staffDetails.type !== 'staff') {
      return {
        status: 403,
        success: false,
        error: `Invalid staff type provided`,
        message: `Staff type must be 'staff' or 'admin'`
      };
    }
    const newStaff = await UserService.createUser(staffDetails, staffDetails.type);
    return newStaff;
  }
}

export default UserService;
