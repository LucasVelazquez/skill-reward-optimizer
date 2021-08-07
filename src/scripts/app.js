import env from './modules/environment.js';

const web3 = new Web3(env.BSC_MAINET_NETWORK);

const resultDiv = document.getElementById('result-div');
const oracleSkillPriceText = document.getElementById('oracle-price');
const marketSkillPriceText = document.getElementById('market-price');
const rewardResultText = document.getElementById('reward-result');

const calculateButton = document.getElementById('calculate-button');
calculateButton.addEventListener('click', calculateReward)

function calculateReward() {
    resultDiv.style.display = 'none';
    calculateButton.disabled = true;
    calculateButton.textContent = 'Loading...';
    fetch(env.BSCSCAN_API_URL)
        .then(response => response.json())
        .then((data) => {
            let contractABI = data.result;
            if (contractABI === '') throw 'Contract ABI not found.';

            let contract = new web3.eth.Contract(JSON.parse(contractABI), env.CONTRACT_ADDRESS);
            contract.methods.currentPrice()
                .call((err, res) => {
                    if (err) throw err;

                    const currentPriceWei = res;
                    let bnbPriceConvertion = currentPriceWei / env.WEI_UNIT;
                    let oracleSkillPrice = parseFloat((1 / bnbPriceConvertion).toFixed(2));

                    fetch(env.COINGECKO_API_URL + '/simple/token_price/binance-smart-chain?contract_addresses=' + env.CRYPTO_BLADES_TOKEN_CONTRACT + '&vs_currencies=usd')
                        .then(response => response.json())
                        .then((response) => {
                            oracleSkillPriceText.innerHTML = oracleSkillPrice;
                            let marketSkillPrice = response[env.CRYPTO_BLADES_TOKEN_CONTRACT].usd;
                            marketSkillPriceText.innerHTML = marketSkillPrice;

                            let resultText = 'The skill reward is ';
                            if (oracleSkillPrice > marketSkillPrice) {
                                rewardResultText.innerHTML = resultText + 'LOW.';
                                rewardResultText.style.color = '#ec4b4b';
                            }
                            else if (oracleSkillPrice < marketSkillPrice) {
                                rewardResultText.innerHTML = resultText + 'HIGH.';
                                rewardResultText.style.color = '#28a745';
                            }
                            else {
                                rewardResultText.innerHTML = resultText + 'the SAME.'
                                rewardResultText.style.color = '#9e8a57'
                            }

                            resultDiv.style.display = 'block';

                        })
                        .catch((err) => {
                            throw err
                        })
                        .finally(() => {
                            calculateButton.textContent = 'Calculate again';
                            calculateButton.disabled = false;
                        })
                });
        })
        .catch((error) => {
            console.log('Error: ' + error);
        })
}

window.addEventListener('load', calculateReward);

