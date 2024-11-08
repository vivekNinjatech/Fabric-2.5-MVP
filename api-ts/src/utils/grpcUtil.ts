import * as grpc from '@grpc/grpc-js';
import { promises as fs } from 'fs';
import { peerEndpoint, peerHostAlias, tlsCertPath } from '../config/config';

export async function newGrpcConnection(): Promise<grpc.Client> {
  const tlsRootCert = await fs.readFile(tlsCertPath);
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  return new grpc.Client(peerEndpoint, tlsCredentials, {
    'grpc.ssl_target_name_override': peerHostAlias,
  });
}
