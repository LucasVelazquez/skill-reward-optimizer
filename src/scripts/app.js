import env from "./modules/environment.js";

const web3 = new Web3(env.BSC_MAINET_NETWORK);
let contract = null;

const resultDiv = document.getElementById("result-div");
const oracleSkillPriceText = document.getElementById("oracle-price");
const marketSkillPriceText = document.getElementById("market-price");
const rewardResultText = document.getElementById("reward-result");

const calculateButton = document.getElementById("calculate-button");
calculateButton.addEventListener("click", calculateReward);

function getContractAbi() {
  fetch(env.BSCSCAN_API_URL)
    .then((response) => response.json())
    .then((contractAbi) => {
      if (contractAbi.result === "") {
        throw "Contract ABI not found";
      }

      contract = new web3.eth.Contract(JSON.parse(contractAbi.result), env.CONTRACT_ADDRESS);
      calculateReward();
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    });
}

function calculateReward() {
  hideResults();
  contract.methods.currentPrice().call((err, currentPriceWei) => {
    if (err) throw err;
    let oracleSkillPrice = calculateOracleSkillPrice(currentPriceWei);
    fetch(
      `${env.COINGECKO_API_URL}/simple/token_price/binance-smart-chain?contract_addresses=${env.CRYPTO_BLADES_TOKEN_CONTRACT}&vs_currencies=usd`
    )
      .then((response) => response.json())
      .then((response) => {
        let marketSkillPrice = response[env.CRYPTO_BLADES_TOKEN_CONTRACT].usd;
        setPricesInView(oracleSkillPrice, marketSkillPrice);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        showResults();
      });
  });
}

function hideResults() {
  calculateButton.disabled = true;
  calculateButton.textContent = "Loading...";
  resultDiv.style.display = "none";
}

function showResults() {
  calculateButton.textContent = "Calculate again";
  calculateButton.disabled = false;
  resultDiv.style.display = "block";
}

function setPricesInView(oracleSkillPrice, marketSkillPrice) {
  oracleSkillPriceText.innerHTML = oracleSkillPrice;
  marketSkillPriceText.innerHTML = marketSkillPrice;

  let priceText = {
    text: "the SAME",
    color: "#9e8a57",
  };

  if (oracleSkillPrice > marketSkillPrice) {
    priceText.text = "LOW";
    priceText.color = "#ec4b4b";
  } else if (oracleSkillPrice < marketSkillPrice) {
    priceText.text = "HIGH";
    priceText.color = "#28a745";
  }

  rewardResultText.innerHTML = `The skill reward is ${priceText.text}.`;
  rewardResultText.style.color = priceText.color;
}

function calculateOracleSkillPrice(priceWei) {
  const bnbPriceConvertion = priceWei / env.WEI_UNIT;
  return parseFloat((1 / bnbPriceConvertion).toFixed(2));
}

window.addEventListener("load", getContractAbi);
