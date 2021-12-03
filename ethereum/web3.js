import Web3 from "web3";

// if (!window.ethereum) window.alert('Non-compatible browser, please install metamask');

let web3;
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    console.log('ssr or no metamask');
    const provider = new Web3.providers.HttpProvider(process.env.infura_endpoint);
    web3 = new Web3(provider);
}

export default web3;