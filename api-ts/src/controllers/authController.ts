import { Request, Response } from 'express';
import { getErrorMessage, generateToken } from '../utils/authUtils';
import {
  registerAndGerSecret,
  checkIfUserRegistered,
  listAllRegisteredUsers,
} from '../helper/helpers';
import { logError, logWarning, logSuccess, logNotFound } from '../utils/logger';

const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { username, orgName } = req.body;

  if (!username) {
    logWarning('Username is missing in the request body');
    return res.json(getErrorMessage("'username'"));
  }

  if (!orgName) {
    logWarning('Organization name is missing in the request body');
    return res.json(getErrorMessage("'orgName'"));
  }

  const token = generateToken(username, orgName);

  try {
    const response = await registerAndGerSecret(username, orgName);
    if (response && typeof response !== 'string') {
      logSuccess(
        `Successfully registered ${username} for organization ${orgName}`
      );
      response.token = token;
      return res.json(response);
    } else {
      logError(`Failed to register user: ${response}`);
      return res.json({ success: false, message: response });
    }
  } catch (error: any) {
    logError(`Exception during user registration: ${error.message}`);
    return res.json({
      success: false,
      message: 'Failed to register user due to an unexpected error.',
    });
  }
};

const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { username, orgName } = req.body;

  if (!username) {
    logWarning('Username is missing in the request body');
    return res.json(getErrorMessage("'username'"));
  }

  if (!orgName) {
    logWarning('Organization name is missing in the request body');
    return res.json(getErrorMessage("'orgName'"));
  }

  const token = generateToken(username, orgName);

  try {
    const isUserRegistered: any = await checkIfUserRegistered(
      username,
      orgName
    );
    if (isUserRegistered) {
      logSuccess(
        `User ${username} successfully logged in for organization ${orgName}`
      );
      return res.json({ success: true, message: { token } });
    } else {
      logNotFound(
        `User with username ${username} is not registered with ${orgName}`
      );
      return res.json({
        success: false,
        message: `User with username ${username} is not registered with ${orgName}, Please register first.`,
      });
    }
  } catch (error: any) {
    logError(`Exception during user login: ${error.message}`);
    return res.json({
      success: false,
      message: 'Failed to login due to an unexpected error.',
    });
  }
};

const listUsers = async (req: Request, res: Response): Promise<any> => {
  const { orgName } = req.body;

  if (!orgName) {
    logWarning('Organization name is missing in the request body');
    return res.json(getErrorMessage("'orgName'"));
  }

  try {
    const users = await listAllRegisteredUsers(orgName);
    logSuccess(`Fetched registered users for ${orgName}`);
    return res.json({ success: true, users });
  } catch (error: any) {
    logError(`Failed to list users: ${error.message}`);
    return res.json({
      success: false,
      message: 'Failed to retrieve user list due to an unexpected error.',
    });
  }
};

export { registerUser, loginUser, listUsers };
