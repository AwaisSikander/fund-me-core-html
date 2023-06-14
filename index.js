import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
    connectButton.innerHTML = "Connected";
  } else {
    connectButton.innerHTML = "Please install metamask";
  }
}

async function fund() {
  const ethAmount = document.getElementById("fund").value;
  console.log(`Fundoing With ${ethAmount} ....`);
  if (typeof window.ethereum !== "undefined") {
    // Provider / Connection to the blockchain
    // Signer /Wallet Someone with some gas
    // Contract that we are interacting with
    // ^ ABI & Address

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txRes = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // listen for tx to be mined
      // listed for an event
      await listenForTxMined(txRes, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTxMined(tx, provider) {
  console.log(`Mining ${tx.hash}..`);

  return new Promise((resolve, reject) => {
    provider.once(tx.hash, (txReciept) => {
      console.log(`Completed with ${txReciept.confirmations} confirmations`);
      resolve();
    });
  });
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(balance);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txRes = await contract.withdraw();
      await listenForTxMined(txRes, provider);
    } catch (err) {
      console.log(err);
    }
  }
}
