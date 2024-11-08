package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// TDR represents a Transferable Development Right
type TDR struct {
	ID               string  `json:"id"`
	Issuer           string  `json:"issuer"`
	Owner            string  `json:"owner"`
	Amount           float64 `json:"amount"`
	IssueDate        string  `json:"issueDate"`
	ValidTill        string  `json:"validTill"`
	IsVerified       bool    `json:"isVerified"`
	IsActive         bool    `json:"isActive"`
	IpfsDocumentLink string  `json:"ipfsDocumentLink"` // New field for IPFS link
}

// TDRContract manages TDR-related transactions
type TDRContract struct {
	contractapi.Contract
}

// IssueTDR issues a new TDR
func (c *TDRContract) IssueTDR(ctx contractapi.TransactionContextInterface, id string, issuer string, owner string, amount float64, validTill string, ipfsDocumentLink string) error {
	issueDate := time.Now().Format(time.RFC3339)
	tdr := TDR{
		ID:               id,
		Issuer:           issuer,
		Owner:            owner,
		Amount:           amount,
		IssueDate:        issueDate,
		ValidTill:        validTill,
		IsVerified:       false,
		IsActive:         true,
		IpfsDocumentLink: ipfsDocumentLink,
	}

	tdrJSON, err := json.Marshal(tdr)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, tdrJSON)
}

// TransferTDR transfers ownership of a TDR to a new owner
func (c *TDRContract) TransferTDR(ctx contractapi.TransactionContextInterface, id string, newOwner string) error {
	tdrJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read TDR: %v", err)
	}
	if tdrJSON == nil {
		return fmt.Errorf("TDR %s does not exist", id)
	}

	var tdr TDR
	err = json.Unmarshal(tdrJSON, &tdr)
	if err != nil {
		return err
	}

	tdr.Owner = newOwner
	tdrJSON, err = json.Marshal(tdr)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, tdrJSON)
}

// VerifyTDR marks a TDR as verified
func (c *TDRContract) VerifyTDR(ctx contractapi.TransactionContextInterface, id string) error {
	tdrJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read TDR: %v", err)
	}
	if tdrJSON == nil {
		return fmt.Errorf("TDR %s does not exist", id)
	}

	var tdr TDR
	err = json.Unmarshal(tdrJSON, &tdr)
	if err != nil {
		return err
	}

	tdr.IsVerified = true
	tdrJSON, err = json.Marshal(tdr)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, tdrJSON)
}

// GetTDRDetails retrieves a TDR by ID
func (c *TDRContract) GetTDRDetails(ctx contractapi.TransactionContextInterface, id string) (*TDR, error) {
	tdrJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read TDR: %v", err)
	}
	if tdrJSON == nil {
		return nil, fmt.Errorf("TDR %s does not exist", id)
	}

	var tdr TDR
	err = json.Unmarshal(tdrJSON, &tdr)
	if err != nil {
		return nil, err
	}

	return &tdr, nil
}

// GetAllUserTDRs retrieves all TDRs belonging to a specific owner
func (c *TDRContract) GetAllUserTDRs(ctx contractapi.TransactionContextInterface, owner string) ([]*TDR, error) {
	queryString := fmt.Sprintf(`{"selector":{"owner":"%s"}}`, owner)
	return c.queryTDRs(ctx, queryString)
}

// GetAllTDRs retrieves all TDRs
func (c *TDRContract) GetAllTDRs(ctx contractapi.TransactionContextInterface) ([]*TDR, error) {
	queryString := `{"selector":{}}`
	return c.queryTDRs(ctx, queryString)
}

// queryTDRs is a helper function for retrieving TDRs based on a CouchDB query
func (c *TDRContract) queryTDRs(ctx contractapi.TransactionContextInterface, queryString string) ([]*TDR, error) {
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var tdrs []*TDR
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var tdr TDR
		err = json.Unmarshal(queryResponse.Value, &tdr)
		if err != nil {
			return nil, err
		}
		tdrs = append(tdrs, &tdr)
	}

	return tdrs, nil
}

// GetTDRHistory retrieves the transaction history for a specific TDR
func (c *TDRContract) GetTDRHistory(ctx contractapi.TransactionContextInterface, id string) ([]map[string]interface{}, error) {
	historyIterator, err := ctx.GetStub().GetHistoryForKey(id)
	if err != nil {
		return nil, err
	}
	defer historyIterator.Close()

	var history []map[string]interface{}
	for historyIterator.HasNext() {
		historyData, err := historyIterator.Next()
		if err != nil {
			return nil, err
		}

		entry := map[string]interface{}{
			"txId":      historyData.TxId,
			"timestamp": historyData.Timestamp,
			"isDelete":  historyData.IsDelete,
		}
		var tdr TDR
		if historyData.Value != nil {
			err = json.Unmarshal(historyData.Value, &tdr)
			if err != nil {
				return nil, err
			}
			entry["value"] = tdr
		}
		history = append(history, entry)
	}

	return history, nil
}

// DestroyTDR deactivates a TDR
func (c *TDRContract) DestroyTDR(ctx contractapi.TransactionContextInterface, id string) error {
	tdrJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read TDR: %v", err)
	}
	if tdrJSON == nil {
		return fmt.Errorf("TDR %s does not exist", id)
	}

	var tdr TDR
	err = json.Unmarshal(tdrJSON, &tdr)
	if err != nil {
		return err
	}

	tdr.IsActive = false
	tdrJSON, err = json.Marshal(tdr)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, tdrJSON)
}

// UpdateTDR updates an existing TDR
func (c *TDRContract) UpdateTDR(ctx contractapi.TransactionContextInterface, id string, newAmount float64, newValidTill string) error {
	tdrJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read TDR: %v", err)
	}
	if tdrJSON == nil {
		return fmt.Errorf("TDR %s does not exist", id)
	}

	var tdr TDR
	err = json.Unmarshal(tdrJSON, &tdr)
	if err != nil {
		return err
	}

	tdr.Amount = newAmount
	tdr.ValidTill = newValidTill
	tdrJSON, err = json.Marshal(tdr)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, tdrJSON)
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(TDRContract))
	if err != nil {
		log.Panicf("Error creating TDRContract chaincode: %v", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panicf("Error starting TDRContract chaincode: %v", err)
	}
}
