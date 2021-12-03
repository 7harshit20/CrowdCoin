import React, { useState } from 'react'
import { Table, Button } from 'semantic-ui-react'
import web3 from '../ethereum/web3';
import campaignFunc from '../ethereum/campaign';

const RowEntry = ({ request, id, approvers, address }) => {

    const [loading, setLoading] = useState({
        approve: false,
        finalise: false
    });
    const campaign = campaignFunc(address);

    const onApprove = async () => {
        setLoading({ approve: true, finalise: false });
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(id).send({ from: accounts[0] });
        } catch (error) {
            console.log('Something went wrong, could not approve request');
        }
        setLoading({ approve: false, finalise: false });
    }

    const onFinalize = async () => {
        setLoading({ approve: false, finalise: true });
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
        } catch (error) {
            console.log('Something went wrong, could not finalise request');
        }
        setLoading({ approve: false, finalise: false });
    }

    const { Row, Cell } = Table;

    return (
        <Row disabled={request[3]} positive={!request[3] && request[4] * 2 > approvers} >
            <Cell>{id + 1}</Cell>
            <Cell>{request[0]}</Cell>
            <Cell>{web3.utils.fromWei(request[2], 'ether')}</Cell>
            <Cell>{request[1]}</Cell>
            <Cell>{request[4]}/{approvers}</Cell>
            <Cell>
                {!request[3] ? (<Button onClick={onApprove} loading={loading.approve} color='green' basic>Approve</Button>) : null}
            </Cell>
            <Cell>
                {!request[3] ? (<Button onClick={onFinalize} loading={loading.finalise} color='blue' basic>Finalize</Button>) : null}
            </Cell>
        </Row>
    )
}

export default RowEntry
