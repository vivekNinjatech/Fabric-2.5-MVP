import { envOrDefault } from '../utils/envUtil';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();
export const channelName = envOrDefault(
  'CHANNEL_NAME',
  process.env.CHANNEL_NAME!
);
export const chaincodeName = envOrDefault(
  'CHAINCODE_NAME',
  process.env.CHAINCODE_NAME!
);
export const mspId = envOrDefault('MSP_ID', 'Org1MSP');
// export const cryptoPath = envOrDefault(
//   'CRYPTO_PATH',
//   path.resolve(
//     __dirname,
//     '..',
//     '..',
//     '..',
//     'config',
//     'crypto-config',
//     'peerOrganizations',
//     'org1.example.com'
//   )
// );
export const cryptoPath = envOrDefault(
  'CRYPTO_PATH',
  path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'amc-tdr-network',
    'organizations',
    'peerOrganizations',
    'org1.example.com'
  )
);
export const keyDirectoryPath = path.join(
  cryptoPath,
  'users',
  'User1@org1.example.com',
  'msp',
  'keystore'
);
export const certDirectoryPath = path.join(
  cryptoPath,
  'users',
  'User1@org1.example.com',
  'msp',
  'signcerts'
);
export const tlsCertPath = path.join(
  cryptoPath,
  'peers',
  'peer0.org1.example.com',
  'tls',
  'ca.crt'
);
export const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');
export const peerHostAlias = envOrDefault(
  'PEER_HOST_ALIAS',
  'peer0.org1.example.com'
);
