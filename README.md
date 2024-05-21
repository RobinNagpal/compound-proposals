# Compound Proposal CLI

# Introduction

Creating proposals for the Compound protocol manually can lead to various errors such as incorrect addresses for Compound markets and assets, as well as issues with the precision of values. Additionally, the current process requires cross-team reviews only after proposals have been added to the blockchain, with limited tooling available for pre-submission review.

Moreover, there are almost no publicly verifiable tests or simulations to assess the impact of proposals before they are executed on-chain. This makes it challenging to identify and correct issues early, potentially resulting in failed proposals and wasted resources.

# Compound CLI Benefits

Compound CLI tool addresses these issues by automating the proposal creation process, offering the following benefits:

- Reduces Human Errors: Automates the generation of proposal files, minimizing the risk of incorrect addresses and value precision issues.
- Enables Pre-Submission Testing: Generates testing files and scripts to verify the correctness and simulate the execution of proposals.
- Streamlines the Process: Creates a more efficient and reliable proposal process, from creation to on-chain submission.

## Features

- Proposal File Generation: Creates a proposal file with all the required information.
- Testing File Generation: Generates a testing file to verify the correctness of the proposal using Foundry.
- Simulation Script Generation: Produces a script to simulate the proposal execution on a forked network, allowing you to observe the effects on the main chain.
- README Generation: Automatically generates a README file for the proposal.

## How It Works

After running the tool, the user is guided through a series of prompts and input fields on the CLI to get all the necessary data required for the proposal.

1. Initial Prompt:

   The user is prompted with a menu of options to choose from, such as "Add an Asset."

2. Select Chain:

   The user selects the chain for which the proposal will be generated. Options include mainnet, polygon, etc.

3. Base Asset Selection:

   The user is asked to choose the base asset of the market, with options like Native USDC or WETH, depending upon the chosen market.

4. Detailed Prompts Based on Initial Selection:

- The user is then asked specific questions related to their initial selection.
- For example, if the user chooses "Add an Asset":
  - The user selects the token they want to add from a list of available tokens according to the selected chain.
  - The user is prompted to enter values necessary for adding an asset, such as:
    - Borrow Collateral Factor
    - Liquidate Collateral Factor
    - Liquidation Factor
    - Supply Cap

5. Proposal Details:

   Finally, the user is asked to provide additional details for the proposal:

   - Title for the Proposal
   - Name of the Author
   - Link to the Forum Discussion (optional)

6. File Generation:

   After entering all the required values, the tool generates all the necessary files which includes:

   - Proposal file
   - Testing file
   - Simulation script
   - README file

7. Executing Tests and Scripts:

   The user can then use the commands provided in the `Makefile` to execute the tests and the simulation script.

### Using Hardware Wallet

For running the scripts onchain, hardware wallet can also be used by running the appropriate command from the `Makefile` and passing in the required values like path to the script file. The `.env` file has to be configured with the values required for deployment via ledger i.e., MNEMONIC_INDEX and LEDGER_SENDER

### Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com
   ```

2. Install the dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory and add the relevant variables according to the `.env.example`

4. Run the CLI tool:

   ```bash
   yarn generate
   ```

5. Follow the prompts to generate the proposal files.

# Conclusion

This tool provides a simple and efficient way to generate proposal files for the DAO. It allows users to easily enter the required values and generate all the necessary
files for the proposal, testing, and simulation. By automating the proposal creation process, the tool reduces the risk of human errors and streamlines the proposal submission process. It also enables users to test and simulate the proposal before submitting it on-chain, providing a more reliable and efficient way to create and execute proposals for the Compound protocol.

### Running the test

To execute the tests, run the following command by passing in the path of the test file:

```bash
make run_test PROPOSAL_PATH=src/proposals/new_proposal_path/new_test_file.t.sol
```

### Running the script

Before running the script, we need to generate the summary of the proposal required for the execution of the script. To generate the summary of a proposal, run the following command with the path to the README file of the proposal:

```bash
make generate_summary SUMMARY_PATH=src/proposals/new_proposal_path/README.md
```

In order to execute the script and deploy the proposal locally, first we need to start an Anvil node. Run the following command to start an Anvil node by passing in the RPC url of the target chain:

```bash
make run_anvil RPC_URL=https://ethereum-rpc.publicnode.com/
```

Now, to execute the script, run the below command with path of the script file and enter the sender address in the `.env` file:

```bash
make run_script SCRIPT_PATH=src/proposals/new_script_path/new_script.s.sol:NewScript
```

#### Running Script with Private Key

To execute the script on the local Anvil node with a private key, first setup the sender and private key in the `.env` file and then run the following command by passing in the script path:

```bash
make run_script_pk SCRIPT_PATH=src/proposals/new_script_path/new_script.s.sol:NewScript
```

#### Running Script with Ledger

To execute the script using a hardware wallet like ledger, first setup the mnemonic and ledger sender in the `.env` file and then run the following command by passing in the script path:

```bash
make run_script_ledger SCRIPT_PATH=src/proposals/new_script_path/new_script.s.sol:NewScript
```
