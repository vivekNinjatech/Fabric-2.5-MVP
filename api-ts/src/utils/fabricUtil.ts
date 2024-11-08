import {
  connect,
  Identity,
  Signer,
  signers,
} from '@hyperledger/fabric-gateway';
import { newGrpcConnection } from './grpcUtil';
import {
  mspId,
  cryptoPath,
  keyDirectoryPath,
  channelName,
  chaincodeName,
} from '../config/config';
import { promises as fs } from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';
import { envOrDefault } from './envUtil';
import { logError, logWarning, logSuccess } from '../utils/logger';

async function getFirstDirFileName(dirPath: string): Promise<string> {
  const files = await fs.readdir(dirPath);
  const file = files[0];
  if (!file) {
    logWarning(`No files in directory: ${dirPath}`);
    throw new Error(`No files in directory: ${dirPath}`);
  }
  return path.join(dirPath, file);
}

async function newSigner(): Promise<Signer> {
  const keyPath = await getFirstDirFileName(keyDirectoryPath);
  const privateKeyPem = await fs.readFile(keyPath);
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
}

async function newIdentity(): Promise<Identity> {
  const certDirectoryPath = envOrDefault(
    'CERT_DIRECTORY_PATH',
    path.resolve(
      cryptoPath,
      'users',
      'User1@org1.example.com',
      'msp',
      'signcerts'
    )
  );
  const certPath = await getFirstDirFileName(certDirectoryPath);
  const credentials = await fs.readFile(certPath);
  return { mspId, credentials };
}

export async function getAllUserTDRs(owner: string): Promise<any[]> {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  });

  try {
    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    const resultBytes = await contract.evaluateTransaction('GetAllUserTDRs', owner);
    console.log(resultBytes,"--id--");
    const utf8Decoder = new TextDecoder();
    const resultJson = utf8Decoder.decode(resultBytes);
    return JSON.parse(resultJson);
  } catch (error: any) {
    logError(`Error fetching TDRs for owner: ${owner}, Error: ${error.message}`);
    return [];
  } finally {
    gateway.close();
    client.close();
  }
}

export async function getAllTDRs(): Promise<any[]> {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  });

  try {
    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    const resultBytes = await contract.evaluateTransaction('GetAllTDRs');

    const utf8Decoder = new TextDecoder();
    const resultJson = utf8Decoder.decode(resultBytes);
    return JSON.parse(resultJson);
  } catch (error: any) {
    logError(`Error fetching all TDRs, Error: ${error.message}`);
    return [];
  } finally {
    gateway.close();
    client.close();
  }
}

export async function getTDRHistory(id: string): Promise<any[]> {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  });

  try {
    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    const resultBytes = await contract.evaluateTransaction('GetTDRHistory', id);

    const utf8Decoder = new TextDecoder();
    const resultJson = utf8Decoder.decode(resultBytes);
    return JSON.parse(resultJson);
  } catch (error: any) {
    logError(`Error retrieving history for TDR ID: ${id}, Error: ${error.message}`);
    return [];
  } finally {
    gateway.close();
    client.close();
  }
}

export async function destroyTDR(id: string): Promise<void> {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  });

  try {
    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    await contract.submitTransaction('DestroyTDR', id);
    logSuccess(`TDR with ID ${id} successfully destroyed`);
  } catch (error: any) {
    logError(`Failed to destroy TDR with ID: ${id}, Error: ${error.message}`);
    throw error;
  } finally {
    gateway.close();
    client.close();
  }
}

export async function updateTDR(id: string, newAmount: number, newValidTill: string): Promise<void> {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  });

  try {
    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    await contract.submitTransaction('UpdateTDR', id, newAmount.toString(), newValidTill);
    logSuccess(`TDR with ID ${id} updated successfully`);
  } catch (error: any) {
    logError(`Failed to update TDR with ID: ${id}, Error: ${error.message}`);
    throw error;
  } finally {
    gateway.close();
    client.close();
  }
}

export async function issueTDR(id:string, issuer: string, owner: string, amount: number, validTill: string, ipfsDocumentLink: string): Promise<void> {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  });

  try {
    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    await contract.submitTransaction('IssueTDR', id, issuer, owner, amount.toString(), validTill, ipfsDocumentLink);
    logSuccess(`TDR with ID ${id} issued successfully`);
  } catch (error: any) {
    logError(`Failed to issue TDR with ID: ${id}, Error: ${error.message}`);
    throw error;
  } finally {
    gateway.close();
    client.close();
  }
}

export async function transferTDR(id: string, newOwner: string): Promise<void> {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  }); 

  try {
    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    await contract.submitTransaction('TransferTDR', id, newOwner);
    logSuccess(`TDR with ID ${id} transferred successfully`);
  } catch (error: any) {
    logError(`Failed to transfer TDR with ID: ${id}, Error: ${error.message}`);
    throw error;
  } finally {
    gateway.close();
    client.close();
  }
}

export async function verifyTDR(id: string): Promise<void> {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  });

  try {
    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    await contract.submitTransaction('VerifyTDR', id);
    logSuccess(`TDR with ID ${id} verified successfully`);
  } catch (error: any) {
    logError(`Failed to verify TDR with ID: ${id}, Error: ${error.message}`);
    throw error;
  } finally {
    gateway.close();
    client.close();
  }
}

export async function getTDRDetails(id: string): Promise<any> {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  });

  try {
    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    const result = await contract.evaluateTransaction('GetTDRDetails', id);
    const stringResult = new TextDecoder().decode(result);
    
    // Parse the result to a JSON object
    const parsedResult = JSON.parse(stringResult);

    return parsedResult;
  } catch (error: any) {
    logError(`Failed to get TDR details with ID: ${id}, Error: ${error.message}`);
    throw error;
  } finally {
    gateway.close();
    client.close();
  }
}
