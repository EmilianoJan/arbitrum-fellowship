# Nitro Chain Monitor (HTML + CSS + JavaScript)

A simple web monitor to observe Nitro local and Arbitrum Sepolia metrics in real time.

## Includes

- Polling every N seconds for:
  - L2 block number from ArbSys(0x64).arbBlockNumber()
  - L1 block number from eth_blockNumber on the L1 RPC
  - L1 base fee from ArbGasInfo(0x6C).getL1BaseFeeEstimate()
  - L2 gas price from ArbGasInfo(0x6C).getMinimumGasPrice()
  - Block fill = gasUsed / gasLimit from eth_getBlockByNumber(latest)
- Network selector (bonus):
  - Local Nitro testnode (L1 8545, L2 8547)
  - Arbitrum Sepolia
  - Custom
- Phase tagging:
  - BEFORE / DURING / AFTER
- Visualization:
  - Live KPIs
  - Sparklines
  - Sample table
  - Summary by phase
- Export:
  - JSON
  - CSV

## Files

- BasicMonitor.html: main monitor
- installation.md: notes to start nitro-testnode

## How to Run

1. Start Nitro testnode (if you are using local)

   - L1: http://127.0.0.1:8545
   - L2: http://127.0.0.1:8547

2. Serve this folder with an HTTP server (do not open with file://)

   Example with Python:

   python3 -m http.server 8080

3. Open in your browser:

   http://127.0.0.1:8080/BasicMonitor.html

4. In the page:

   - Keep Local profile for testnode or switch to Sepolia.
   - Click Start Monitor.
   - Keep phase set to BEFORE at the beginning.

5. Run the workload while the monitor is running

   - Use the workload script available in your project.
   - When load starts, change phase to DURING.
   - When it finishes, change phase to AFTER.

6. Download results with Download JSON or Download CSV.

## Expected Observations

- BEFORE:
  - Lower block fill.
  - More stable gas.
- DURING:
  - Block fill increases.
  - Gas and estimated L1 base fee may increase.
  - More block activity.
- AFTER:
  - Block fill and gas tend to stabilize.

## Checklist de deliverables

- [ ] Nitro testnode running locally
- [x] Monitor tool that polls and displays the required metrics
- [ ] Workload execution completed
- [x] Output view before/during/after load (live + export)
- [x] Project README: how to run, what to observe

## Technical Notes

- Precompiles are queried via eth_call on L2:
  - ArbSys at 0x64
  - ArbGasInfo at 0x6C
- Sepolia defaults:
  - L2: https://sepolia-rollup.arbitrum.io/rpc
  - L1: https://ethereum-sepolia-rpc.publicnode.com
  - You can change them manually if you prefer another RPC provider.
