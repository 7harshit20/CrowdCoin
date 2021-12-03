import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

export default new web3.eth.Contract(CampaignFactory.abi, '0x8F0ACc4847b00897BA200Bb35dFeEb00DBF9564D');