const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const CampaignFactory = require('../ethereum/build/CampaignFactory.json');
const Campaign = require('../ethereum/build/Campaign.json');

let accounts, campaign, campaignFactory, campaignAddress;
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    campaignFactory = await new web3.eth.Contract(CampaignFactory.abi)
        .deploy({ data: CampaignFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '1500000' });

    await campaignFactory.methods.createCampaign('100').send({ from: accounts[1], gas: '1500000' });
    [campaignAddress] = await campaignFactory.methods.getCampaign().call();

    campaign = await new web3.eth.Contract(Campaign.abi, campaignAddress);
});

describe('Campaign', () => {
    it('campaign and campaign factory get deployed', () => {
        assert.ok(campaignFactory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as a campaign manager and sets minimum contribution', async () => {
        assert.equal(accounts[1], await campaign.methods.manager().call());
        assert.equal('100', await campaign.methods.minContribution().call());
    })

    it('allows to contribute and stores the contributor', async () => {
        for (let i = 0; i < 2; i++) {
            await campaign.methods.contribute().send({ from: accounts[i], value: '300' });
            assert(await campaign.methods.approvers(accounts[i]).call());
        }
    })

    it('requires a minimum contribution', async () => {
        let occured = true;
        try {
            await campaign.methods.contribute().send({ from: accounts[3], value: '50' });
        } catch (error) {
            occured = false;
        }
        assert(!occured);
    })

    it('allows a manger to make a payment request', async () => {
        await campaign.methods.createRequest('buy wiring', accounts[5], '400').send({ from: accounts[1], gas: '1000000' });

        const req = await campaign.methods.requests(0).call();
        assert.equal(req.description, 'buy wiring');
        assert.equal(req.recipient, accounts[5]);
        assert.equal(req.value, '400');
        assert(!req.complete);
    })

    it('processes request', async () => {
        for (let i = 0; i < 3; i++) {
            await campaign.methods.contribute().send({ from: accounts[i], value: web3.utils.toWei('5', 'ether') });
            assert(await campaign.methods.approvers(accounts[i]).call());
        };
        await campaign.methods.createRequest('buy wiring', accounts[5], web3.utils.toWei('10', 'ether')).send({ from: accounts[1], gas: '1000000' });
        for (let i = 0; i < 2; i++) {
            await campaign.methods.approveRequest(0).send({ from: accounts[i], gas: '1000000' });
        }
        await campaign.methods.finalizeRequest(0).send({ from: accounts[1], gas: '1000000' });

        let balance = await web3.eth.getBalance(campaignAddress);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        assert.equal(balance, 5);
    });
});
