# README - TDR Chaincode Documentation

This document explains the functions of the TDR Chaincode developed for managing Transferable Development Rights (TDRs) on the AMC blockchain network.

## Functions Overview

### `IssueTDR`
**Purpose**: This function issues a new TDR with a specific ID, amount, issuer, and expiration date.  
**Arguments**:
- `TDR_ID` (string): Unique identifier for the TDR.
- `Issuer` (string): The organization issuing the TDR.
- `Owner` (string): The current owner of the TDR.
- `Amount` (float64): The value of the TDR.
- `ValidTill` (string): The expiration date of the TDR.

**Description**: When this function is invoked, a new TDR record is created in the blockchain with the provided data. This TDR is initially marked as "active" and "not verified."

### `TransferTDR`
**Purpose**: This function allows the transfer of ownership of an existing TDR from one entity to another.  
**Arguments**:
- `TDR_ID` (string): The ID of the TDR to be transferred.
- `NewOwner` (string): The new owner of the TDR.

**Description**: The specified TDR will have its owner updated in the blockchain. This function ensures that the ownership transfer is recorded for auditing and verification purposes.

### `VerifyTDR`
**Purpose**: This function verifies the authenticity of a TDR.  
**Arguments**:
- `TDR_ID` (string): The ID of the TDR to be verified.

**Description**: Once invoked, this function marks the TDR as verified. It changes the state of the TDR to "verified," indicating that it has passed necessary checks (e.g., validation by AMC or other authorities).

### `GetTDRDetails`
**Purpose**: Retrieves the detailed information of a TDR based on its ID.  
**Arguments**:
- `TDR_ID` (string): The ID of the TDR whose details are to be fetched.

**Description**: This function fetches and returns all relevant details of the TDR, including its issuer, owner, amount, validity period, and current status (verified/active).

### `GetAllUserTDRs`
**Purpose**: Retrieves all TDRs owned by a specific user.  
**Arguments**:
- `Owner` (string): The name or identifier of the user whose TDRs are to be fetched.

**Description**: This function fetches all TDRs that belong to a specific user. It can be used by the frontend or backend to list all TDRs associated with a particular owner.

### `GetAllTDRs`
**Purpose**: Retrieves all TDRs in the system.  
**Arguments**: None

**Description**: This function returns a list of all TDRs stored in the blockchain. It is useful for displaying a complete list of TDRs issued by AMC or for administrative purposes.

### `GetTDRHistory`
**Purpose**: Retrieves the historical transaction details for a specific TDR.  
**Arguments**:
- `TDR_ID` (string): The ID of the TDR whose history is to be fetched.

**Description**: This function provides the history of the TDR, such as ownership transfers and verification status changes. It can be used to track the TDR's lifecycle and changes over time.

### `DestroyTDR`
**Purpose**: Deactivates or destroys a TDR, marking it as invalid.  
**Arguments**:
- `TDR_ID` (string): The ID of the TDR to be destroyed.

**Description**: This function marks a TDR as "destroyed" or inactive. It is useful in cases where the TDR is no longer valid due to various reasons (e.g., expiration, cancellation, etc.).

### `UpdateTDR`
**Purpose**: Updates the details of an existing TDR, including the amount and validity period.  
**Arguments**:
- `TDR_ID` (string): The ID of the TDR to be updated.
- `NewAmount` (float64): The new value of the TDR.
- `NewValidTill` (string): The new expiration date for the TDR.

**Description**: This function allows modifications to an existing TDR. Changes such as updating the value or extending the expiration date can be made by invoking this function.

## Example Commands

### `IssueTDR` Example:
```bash
peer chaincode invoke -o localhost:7050 ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C amc-tdr-channel -n amc-tdr-chaincode --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"IssueTDR","Args":["TDR12345", "AMC Corp", "SHAYAN SHAIKH", "500000", "2025-12-31", "https://ipfs.io/ipfs/QmExampleLink"]}'
```

### `TransferTDR` Example:
```bash
peer chaincode invoke -o localhost:7050 ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C amc-tdr-channel -n amc-tdr-chaincode --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"TransferTDR","Args":["TDR12345", "Vivek"]}'
```

### `VerifyTDR` Example:
```bash
peer chaincode invoke -o localhost:7050 ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C amc-tdr-channel -n amc-tdr-chaincode --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"VerifyTDR","Args":["TDR12345"]}'
```

### `GetTDRDetails` Example:
```bash
peer chaincode query \
    -C amc-tdr-channel -n amc-tdr-chaincode \
    -c '{"function":"GetTDRDetails","Args":["TDR12345"]}'
```
### `GetAllUserTDRs` Example:
```bash
peer chaincode query \
    -C amc-tdr-channel -n amc-tdr-chaincode \
    -c  '{"function":"GetAllUserTDRs","Args":["Jane Smith"]}'
```
### `GetAllTDRs` Example:
```bash
peer chaincode query \
    -C amc-tdr-channel -n amc-tdr-chaincode \
    -c '{"function":"GetAllTDRs","Args":[]}'
```
### `GetTDRHistory` Example:
```bash
peer chaincode query \
    -C amc-tdr-channel -n amc-tdr-chaincode \
    -c '{"function":"GetTDRHistory","Args":["TDR12345"]}'
```
### `DestroyTDR` Example:
```bash
peer chaincode invoke -o localhost:7050 ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C amc-tdr-channel -n amc-tdr-chaincode --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"DestroyTDR","Args":["TDR12345"]}'
```
### `UpdateTDR` Example:
```bash
peer chaincode invoke -o localhost:7050 ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C amc-tdr-channel -n amc-tdr-chaincode --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"UpdateTDR","Args":["TDR12345", "550000", "2026-12-31"]}'
```

## Data Model: TDR
**Description**: Each TDR in the system follows the structure below:

```go
type TDR struct {
    ID         string `json:"id"`         // Unique identifier for the TDR
    Issuer     string `json:"issuer"`     // Issuer of the TDR (e.g., AMC)
    Owner      string `json:"owner"`      // Owner of the TDR
    Amount     float64 `json:"amount"`    // Monetary value of the TDR
    IssueDate  string `json:"issueDate"`  // Date of issuance
    ValidTill  string `json:"validTill"`  // Expiration date of the TDR
    IsVerified bool   `json:"isVerified"` // Verification status of the TDR
    IsActive   bool   `json:"isActive"`   // Activity status of the TDR
}
```

## Usage Guidelines for Backend and Frontend Developers

### Backend:
**Description**: The backend will interact with the chaincode via Fabric SDKs or REST APIs to invoke and query the functions described above. For example, the backend can fetch all TDRs for a user or issue a new TDR as part of the business logic.

### Frontend:
**Description**: The frontend will use the backend APIs to invoke the chaincode functions and display the results to the user. For instance, when a user requests to transfer a TDR, the frontend will pass the appropriate TDR ID and new owner name to the backend, which will invoke the TransferTDR chaincode function.








