import path from 'path';
import fs from 'fs';
import FabricCAServices from 'fabric-ca-client';
import { Wallets } from 'fabric-network';

const getWalletPath = async (org: string) => {
  let walletPath = null;
  org == 'Org1' ? (walletPath = path.join(process.cwd(), 'org1-wallet')) : null;
  // if having multiple orgs then uncomment below line
  org == 'Org2' ? walletPath = path.join(process.cwd(), 'org2-wallet') : null
  // org == 'Org3' ? walletPath = path.join(process.cwd(), 'org3-wallet') : null
  return walletPath;
};
const getCCP = async (org: string) => {
  let ccpPath: any = null;
  org == 'Org1'
    ? (ccpPath = path.resolve(
        __dirname,
        '..',
        'config',
        'connection-org1.json'
      ))
    : null;
  // if having multiple orgs then uncomment below line
  org == 'Org2' ? ccpPath = path.resolve(__dirname, '..', 'config', 'connection-org2.json') : null
  // org == 'Org3' ? ccpPath = path.resolve(__dirname, '..', 'config', 'connection-org3.json') : null
  const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
  const ccp = JSON.parse(ccpJSON);
  return ccp;
};

const getOrgMSP = (org: string) => {
  let orgMSP = null;
  org == 'Org1' ? (orgMSP = 'Org1MSP') : null;
  // if having multiple orgs then uncomment below line
  org == 'Org2' ? orgMSP = 'Org2MSP' : null
  // org == 'Org3' ? orgMSP = 'Org3MSP' : null
  return orgMSP;
};
const getAffiliation = async (org: string) => {
  // Default in ca config file we have only two affiliations, if you want ti use org3 ca, you have to update config file with third affiliation
  //  Here already two Affiliation are there, using i am using "org2.department1" even for org3
  return org == 'Org1' ? 'org1.department1' : 'org2.department1';
};

const getCaUrl = async (org: string, ccp: any) => {
  let caURL = null;
  org == 'Org1'
    ? (caURL = ccp.certificateAuthorities['ca.org1.example.com'].url)
    : null;
  // if having multiple orgs then uncomment below line
  org == 'Org2' ? caURL = ccp.certificateAuthorities['ca.org2.example.com'].url : null
  // org == 'Org3' ? caURL = ccp.certificateAuthorities['ca.org3.example.com'].url : null
  return caURL;
};

const getCaInfo = async (org: string, ccp: any) => {
  let caInfo = null;
  org == 'Org1'
    ? (caInfo = ccp.certificateAuthorities['ca.org1.example.com'])
    : null;
  // if having multiple orgs then uncomment below line
  org == 'Org2' ? caInfo = ccp.certificateAuthorities['ca.org2.example.com'] : null
  // org == 'Org3' ? caInfo = ccp.certificateAuthorities['ca.org3.example.com'] : null
  return caInfo;
};

const enrollAdmin = async (org: string, ccp: any) => {
  console.log('calling enroll Admin method');
  try {
    const caInfo = await getCaInfo(org, ccp); //ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    // const couchDBWalletStore = {
    //     url: 'http://admin:password@localhost:5990/', // Replace with your CouchDB URL
    //     walletPath: './couchdb_wallet',   // Replace with your desired wallet path
    //   };

    //   const wallet = await Wallets.newCouchDBWallet(couchDBWalletStore);

    // Create a new file system based wallet for managing identities.
    const walletPath: any = await getWalletPath(org); //path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get('admin');
    if (identity) {
      console.log(
        'An identity for the admin user "admin" already exists in the wallet'
      );
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: 'admin',
      enrollmentSecret: 'adminpw',
    });
    console.log('Enrollment object is : ', enrollment);
    let x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: `${org}MSP`,
      type: 'X.509',
    };

    // const identityLabel = 'admin'; // Specify the identity label
    // const identity1 = X509WalletMixin.createIdentity('Org1MSP', certificate, privateKey);

    // await wallet.put(identityLabel, identity1);u

    await wallet.put('admin', x509Identity);
    console.log(
      'Successfully enrolled admin user "admin" and imported it into the wallet'
    );
    return;
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
  }
};

export const registerAndGerSecret = async (
  username: string,
  userOrg: string
) => {
  let ccp = await getCCP(userOrg);

  const caURL = await getCaUrl(userOrg, ccp);
  const ca = new FabricCAServices(caURL);

  const walletPath: any = await getWalletPath(userOrg);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  const userIdentity = await wallet.get(username);
  if (userIdentity) {
    console.log(
      `An identity for the user ${username} already exists in the wallet`
    );
    let response = {
      success: true,
      message: username + ' enrolled Successfully',
    };
    return response;
  }

  // Check to see if we've already enrolled the admin user.
  let adminIdentity: any = await wallet.get('admin');
  if (!adminIdentity) {
    console.log(
      'An identity for the admin user "admin" does not exist in the wallet'
    );
    await enrollAdmin(userOrg, ccp);
    adminIdentity = await wallet.get('admin');
    console.log('Admin Enrolled Successfully');
  }

  // build a user object for authenticating with the CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, 'admin');
  let secret;
  try {
    // Register the user, enroll the user, and import the new identity into the wallet.
    secret = await ca.register(
      {
        affiliation: await getAffiliation(userOrg),
        enrollmentID: username,
        role: 'client',
      },
      adminUser
    );
    // const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client', attrs: [{ name: 'role', value: 'approver', ecert: true }] }, adminUser);
    const enrollment = await ca.enroll({
      enrollmentID: username,
      enrollmentSecret: secret,
    });
    let orgMSPId = getOrgMSP(userOrg);
    const x509Identity: any = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMSPId,
      type: 'X.509',
    };
    await wallet.put(username, x509Identity);
  } catch (error: any) {
    return error.message;
  }

  let response: any = {
    success: true,
    message: username + ' enrolled Successfully',
    secret: secret,
  };
  return response;
};

export const checkIfUserRegistered = async (
  username: string,
  userOrg: string
) => {
  const walletPath: any = await getWalletPath(userOrg);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  const userIdentity = await wallet.get(username);
  const walletIdentities = await wallet.list();

  const userList = walletIdentities.map((identity: any) => identity.label);
  console.log(`Registered users for ${userOrg}:`, userList);
  console.log('User Identity:', JSON.stringify(userIdentity, null, 2));

  if (userIdentity) {
    console.log(`An identity for the user ${username} exists in the wallet`);
    return true;
  }
  return false;
};

export const listAllRegisteredUsers = async (orgName: string) => {
  const walletPath: any = await getWalletPath(orgName);
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const walletIdentities = await wallet.list();
  const userList = walletIdentities.map((identity) => {
    return {
      username: identity,
    };
  });
  return userList;
};
