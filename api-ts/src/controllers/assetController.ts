import { Request, Response } from 'express';
import {
  issueTDR,
  getTDRDetails,
  transferTDR,
  verifyTDR,
  getAllUserTDRs,
  getAllTDRs,
  getTDRHistory,
  destroyTDR,
  updateTDR,
} from '../utils/fabricUtil';
import { logError, logInfo, logSuccess, logNotFound } from '../utils/logger';

// Handler for issuing a new TDR
export async function issueTDRHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id, issuer, owner, amount, validTill, ipfsDocumentLink } = req.body;
    await issueTDR(id, issuer, owner, amount, validTill, ipfsDocumentLink);
    logSuccess(`TDR issued successfully with ID: ${id}`);
    res.status(201).send({ message: 'TDR issued successfully' });
  } catch (error: any) {
    logError(`Failed to issue TDR: ${error.message}`);
    res.status(500).send({ error: 'Failed to issue TDR' });
  }
}

// Handler for transferring TDR ownership
export async function transferTDRHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id, newOwner } = req.body;
    await transferTDR(id, newOwner);
    logSuccess(`TDR with ID: ${id} transferred to new owner: ${newOwner}`);
    res.status(200).send({ message: 'TDR transferred successfully' });
  } catch (error: any) {
    logError(`Failed to transfer TDR: ${error.message}`);
    res.status(500).send({ error: 'Failed to transfer TDR' });
  }
}

// Handler for verifying a TDR
export async function verifyTDRHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.body;
    await verifyTDR(id);
    logSuccess(`TDR with ID: ${id} verified successfully`);
    res.status(200).send({ message: 'TDR verified successfully' });
  } catch (error: any) {
    logError(`Failed to verify TDR: ${error.message}`);
    res.status(500).send({ error: 'Failed to verify TDR' });
  }
}

// Handler for reading TDR details by ID
export async function getTDRDetailsHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const tdrDetails = await getTDRDetails(id);
    if (!tdrDetails) {
      logNotFound(`TDR with ID: ${id} not found`);
      res.status(404).send({ error: 'TDR not found' });
      return;
    }

    logInfo(`TDR with ID: ${id} fetched successfully`);
    res.status(200).send((tdrDetails));
  } catch (error: any) {
    logError(`Failed to fetch TDR details: ${error.message}`);
    res.status(500).send({ error: 'Failed to fetch TDR details' });
  }
}

// Handler for fetching all TDRs for a specific user
export async function getAllUserTDRsHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { owner } = req.params;
    const tdrs = await getAllUserTDRs(owner);

    if (!tdrs || tdrs.length === 0) {
      logNotFound(`No TDRs found for owner: ${owner}`);
      res.status(404).send({ error: 'No TDRs found for this owner' });
      return;
    }

    logInfo(`Fetched all TDRs for owner: ${owner}`);
    res.status(200).send(tdrs);
  } catch (error: any) {
    logError(`Failed to fetch TDRs for owner: ${error.message}`);
    res.status(500).send({ error: 'Failed to fetch TDRs for owner' });
  }
}

// Handler for fetching all TDRs on the ledger
export async function getAllTDRsHandler(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const tdrs = await getAllTDRs();

    if (!tdrs || tdrs.length === 0) {
      logNotFound('No TDRs found');
      res.status(404).send({ error: 'No TDRs found' });
      return;
    }

    logInfo('Fetched all TDRs');
    res.status(200).send(tdrs);
  } catch (error: any) {
    logError(`Failed to fetch all TDRs: ${error.message}`);
    res.status(500).send({ error: 'Failed to fetch all TDRs' });
  }
}

// Handler for fetching the transaction history of a specific TDR
export async function getTDRHistoryHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const history = await getTDRHistory(id);

    if (!history || history.length === 0) {
      logNotFound(`No history found for TDR ID: ${id}`);
      res.status(404).send({ error: 'No history found for this TDR' });
      return;
    }

    logInfo(`Fetched history for TDR ID: ${id}`);
    res.status(200).send(history);
  } catch (error: any) {
    logError(`Failed to fetch history for TDR ID: ${error.message}`);
    res.status(500).send({ error: 'Failed to fetch history for TDR' });
  }
}

// Handler for destroying a TDR
export async function destroyTDRHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.body;
    await destroyTDR(id);
    logSuccess(`TDR with ID: ${id} destroyed successfully`);
    res.status(200).send({ message: 'TDR destroyed successfully' });
  } catch (error: any) {
    logError(`Failed to destroy TDR: ${error.message}`);
    res.status(500).send({ error: 'Failed to destroy TDR' });
  }
}

// Handler for updating a TDR
export async function updateTDRHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id,  amount, validTill } = req.body;
    await updateTDR(id, amount, validTill);
    logSuccess(`TDR with ID: ${id} updated successfully`);
    res.status(200).send({ message: 'TDR updated successfully' });
  } catch (error: any) {
    logError(`Failed to update TDR: ${error.message}`);
    res.status(500).send({ error: 'Failed to update TDR' });
  }
}
