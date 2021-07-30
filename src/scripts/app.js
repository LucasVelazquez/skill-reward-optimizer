const BSCSCAN_API_KEY = 'GZ4XT28CTJ2SABMFYKB86YQQFZD1PSQ9H9';
const BSCSCAN_API_URL = 'https://api.bscscan.com/api?module=contract&action=getabi&address=0x33a6b3e59df5671d01bbb576360d13ed5af4a174&apikey=' + BSCSCAN_API_KEY;
const BSC_MAINET_NETWORK = 'https://bsc-dataseed.binance.org/';
const CONTRACT_ADDRESS = '0x1CBFA0EC28dA66896946474B2A93856Eb725FbbA';
const WEI_UNIT = 1000000000000000000;
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const CRYPTO_BLADES_TOKEN_CONTRACT = '0x154a9f9cbd3449ad22fdae23044319d6ef2a1fab';

const web3 = new Web3(BSC_MAINET_NETWORK);

const resultDiv = document.getElementById('result-div');
const oracleSkillPriceText = document.getElementById('oracle-price');
const marketSkillPriceText = document.getElementById('market-price');
const rewardResultText = document.getElementById('reward-result');

const calculateButton = document.getElementById('calculate-button');
calculateButton.addEventListener('click', calculateReward)

let supportModalStatus = false;

const supportButton = document.getElementById('support-button');
supportButton.addEventListener('click', toggleSupportModal)

const closeSupportButton = document.getElementById('close-support-button');
closeSupportButton.addEventListener('click', toggleSupportModal)

const supportModal = document.getElementById('support-modal');

function toggleSupportModal() {
    supportModal.style.display = (supportModalStatus) ? 'none' : 'block';
    supportModalStatus = !supportModalStatus;
}

function calculateReward() {
    resultDiv.style.display = 'none';
    calculateButton.disabled = true;
    calculateButton.textContent = 'Loading...';
    fetch(BSCSCAN_API_URL)
        .then(response => response.json())
        .then((data) => {
            let contractABI = data.result;
            if (contractABI === '') throw 'Contract ABI not found.';

            let contract = new web3.eth.Contract(JSON.parse(contractABI), CONTRACT_ADDRESS);
            contract.methods.currentPrice()
                .call((err, res) => {
                    if (err) throw err;

                    const currentPriceWei = res;
                    let bnbPriceConvertion = currentPriceWei / WEI_UNIT;
                    let oracleSkillPrice = parseFloat((1 / bnbPriceConvertion).toFixed(2));

                    fetch(COINGECKO_API_URL + '/simple/token_price/binance-smart-chain?contract_addresses=' + CRYPTO_BLADES_TOKEN_CONTRACT + '&vs_currencies=usd')
                        .then(response => response.json())
                        .then((response) => {
                            oracleSkillPriceText.innerHTML = oracleSkillPrice;
                            let marketSkillPrice = response[CRYPTO_BLADES_TOKEN_CONTRACT].usd;
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

