const BSCSCAN_API_KEY = 'GZ4XT28CTJ2SABMFYKB86YQQFZD1PSQ9H9';
const BSCSCAN_API_URL = 'https://api.bscscan.com/api?module=contract&action=getabi&address=0x33a6b3e59df5671d01bbb576360d13ed5af4a174&apikey=' + BSCSCAN_API_KEY;
const BSC_MAINET_NETWORK = 'https://bsc-dataseed.binance.org/';
const CONTRACT_ADDRESS = '0x1CBFA0EC28dA66896946474B2A93856Eb725FbbA';
const WEI_UNIT = 1000000000000000000;
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const CRYPTO_BLADES_TOKEN_CONTRACT = '0x154a9f9cbd3449ad22fdae23044319d6ef2a1fab';

const env = {
    BSCSCAN_API_KEY,
    BSCSCAN_API_URL,
    BSC_MAINET_NETWORK,
    CONTRACT_ADDRESS,
    WEI_UNIT,
    COINGECKO_API_URL,
    CRYPTO_BLADES_TOKEN_CONTRACT
}
export default env;