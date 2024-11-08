# Blockchain Network Setup and Smart Contract Deployment Guide

This guide provides instructions on setting up the blockchain network, creating the channel, and deploying the smart contract using a single command: `./network.sh networkUpAndDeployCC`.

## Prerequisites

Ensure the following tools are installed and configured on your system before proceeding:

1. **Clone the Repositories:**
    You need to clone both the `amc-network` repository (which contains the network setup scripts) and the `amc-chaincode` repository (which contains the smart contract code). Ensure both repositories are at the same level.

   ```bash
   # Clone the AMC Network repository
   git clone https://github.com/ninja-sha/amc-tdr-network.git
    
   # Clone the AMC Chaincode repository
   git clone https://github.com/ninja-sha/amc-tdr-chaincode.git
   ```

2. **Install Dependencies:**
   - **Docker**: For running containers.
   - **Docker Compose**: To manage multi-container Docker applications.
   - **Fabric Samples**: Hyperledger Fabric sample configuration files.
   - **Fabric Binaries**: Binaries for interacting with the Fabric network.
   - **Go**: (Optional) If needed for smart contract development.

## The directory structure should look like this:
```bash
/path/to/your/project/
├── amc-tdr-network/
└── amc-tdr-chaincode/
```

## Steps

### 1. Bringing Up the Network and Deploying the Smart Contract

Run the following command to bring up the network and deploy the smart contract:

```bash
./network.sh networkUpAndDeployCC
```
**Command Explanation `networkUpAndDeployCC`:** This command is responsible for starting up the Hyperledger Fabric network. It will bring up the necessary containers for the peers, orderers, and other components needed for the network. This specific flag ensures that, along with bringing up the network, the smart contract (chaincode) is automatically deployed on the network.
This command will:

### What Happens Behind the Scenes:
    - Start the Docker containers for the peers and orderers.
    - Create the default channel for communication between the peers.
    - Automatically deploy the chaincode (smart contract) to the network, making it ready for use.

### 2. Verify the Deployment

Once the network is up and the smart contract is deployed, you can verify the deployment by running a chaincode query, for example:

```bash
peer chaincode query -C mychannel -n tdr-chaincode -c '{"Args":["GetAllTDRs"]}'
```
This will return all Transferable Development Rights (TDRs) in the system, confirming that the chaincode is working correctly.

## Troubleshooting
- Docker Issues: Ensure that Docker and Docker Compose are properly installed and running.
- Network Setup Problems: Check that all Docker containers are running using docker ps and verify network connectivity.
- Chaincode Deployment Issues: If the chaincode is not deployed, check the logs using docker logs <container_id> for any errors.

## Conclusion
With the command ./network.sh networkUpAndDeployCC, you can quickly bring up your Hyperledger Fabric network, create the channel, and deploy the smart contract in one step. This streamlines the setup process and ensures that the blockchain environment is ready for use with the TDR smart contract.
