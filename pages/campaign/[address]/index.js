import React from 'react'
import Layout from '../../../components/Layout'
import campaignFactory from '../../../ethereum/campaignFactory'
import campaignFunc from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3';
import { Card, Grid, Button } from 'semantic-ui-react';
import ContributeForm from '../../../components/ContributeForm';
import Link from 'next/link'



export async function getStaticProps({ params }) {
    const campaign = campaignFunc(params.address);
    const summary = await campaign.methods.getSummary().call();
    return {
        props: {
            manager: summary[0],
            minContribution: summary[1],
            reqSize: summary[2],
            aprSize: summary[3],
            balance: summary[4],
            address: params.address
        }
    }
}

export async function getStaticPaths() {
    const addresses = await campaignFactory.methods.getCampaign().call();
    const paths = addresses.map((address) => {
        return {
            params: {
                address
            }
        }
    })
    return {
        paths,
        fallback: false
    }
}

export default ({ manager, minContribution, reqSize, aprSize, balance, address }) => {

    const items = [
        {
            header: manager,
            meta: 'Address of manager',
            description: 'The manager created this campaign and can create requests to withdraw funds.',
            style: { overflowWrap: 'break-word' }
        },
        {
            header: minContribution,
            meta: 'Minimum contribution (wei)',
            description: 'You must contribute at least this much wei to become an approver.',
            style: { overflowWrap: 'break-word' }
        },
        {
            header: reqSize,
            meta: 'Number of requests',
            description: 'A request tries to withdraw money from the contract. Requests must be approved first by approvers.',
            style: { overflowWrap: 'break-word' }
        },
        {
            header: aprSize,
            meta: 'Number of approvers',
            description: 'The number of people who have already donated to this campaign.',
            style: { overflowWrap: 'break-word' }
        },
        {
            header: web3.utils.fromWei(balance, 'ether'),
            meta: 'Campaign balance (ether)',
            description: 'How much money this campaign has accumulated.',
            style: { overflowWrap: 'break-word' }
        }
    ];
    return (
        <Layout>
            <h2>Campaign Details</h2><br />
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Card.Group items={items} />
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm address={address} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link href={{
                            pathname: `/campaign/${address}/requests`,
                            query: { address },
                        }}>
                            <a><Button primary >View Requests</Button></a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    )
}
