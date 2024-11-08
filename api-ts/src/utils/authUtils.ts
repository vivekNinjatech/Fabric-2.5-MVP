import jwt from 'jsonwebtoken';

export const getErrorMessage = (field: string) => ({
  success: false,
  message: `${field} field is missing or Invalid in the request`,
});

export const generateToken = (username: string, orgName: string): string => {
  return jwt.sign(
    {
      exp:
        Math.floor(Date.now() / 1000) +
        parseInt(process.env.JWT_EXPIRY! || '86400'),
      username,
      orgName,
    },
    process.env.JWT_SECRET!
  );
};
