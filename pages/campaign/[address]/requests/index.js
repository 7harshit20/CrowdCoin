import React from 'react'
import Layout from '../../../../components/Layout'
import { Table, Button } from 'semantic-ui-react'
import Link from 'next/link'
import campaignFunc from '../../../../ethereum/campaign'
import RowEntry from '../../../../components/RowEntry'


export async function getServerSideProps({ query }) {
    const { address } = query
    const campaign = campaignFunc(address);
    const summary = await campaign.methods.getSummary().call();
    const len = summary[2];
    let requests = [];
    for (let index = 0; index < len; index++) {
        const request = await campaign.methods.requests(index).call();
        requests.push(request);
    }
    return {
        props: {
            address,
            aprSize: summary[3],
            requestsString: JSON.stringify(requests)
        }
    }
}

const renderRows = (requests, aprSize, address) => {
    return requests.map((request, index) => <RowEntry key={index} id={index} address={address} approvers={aprSize} request={request} />);
}

export default ({ address, aprSize, requestsString }) => {
    const requests = JSON.parse(requestsString);
    const { Header, Row, HeaderCell, Body } = Table;
    return (
        <Layout>
            <Link href={{
                pathname: `/campaign/${address}/requests/add`,
                query: { address },
            }}>
                <a><Button floated='right' style={{ marginBottom: 10 }} primary>Add requests</Button></a>
            </Link>
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Postive Votes</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {renderRows(requests, aprSize, address)}
                </Body>
            </Table>
            <div>Found {requests.length} requests.</div>
        </Layout>
    )
}
