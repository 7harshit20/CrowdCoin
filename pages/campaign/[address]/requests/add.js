import React, { useState } from 'react'
import Layout from '../../../../components/Layout'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import web3 from '../../../../ethereum/web3';
import campaignFunc from '../../../../ethereum/campaign';
import Router from 'next/router'
import Link from 'next/link'

export async function getServerSideProps({ query }) {
    return {
        props: {
            address: query.address
        }
    }
}

const add = ({ address }) => {
    const [desc, setDesc] = useState('');
    const [value, setValue] = useState('');
    const [recipient, setRecipient] = useState('');
    const [alert, setAlert] = useState({
        type: '',
        msg: ''
    });
    const [loading, setLoading] = useState(false);
    const onClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        const campaign = campaignFunc(address);
        try {
            const accounts = await web3.eth.getAccounts();
            setAlert({ type: '', msg: '' });
            await campaign.methods.createRequest(desc, recipient, web3.utils.toWei(value, 'ether')).send({ from: accounts[0] });
            setAlert({ type: 'success', msg: 'Request added successfully!' });
            Router.push(`/campaign/${address}/requests`);
        } catch (error) {
            setAlert({ type: 'error', msg: error.message });
        }
        setLoading(false);
    }
    return (
        <Layout>
            <h3>Create a request</h3>
            <Form error={alert.type === 'error'} success={alert.type === 'success'}>
                <Form.Field>
                    <label>Desciption</label>
                    <Input onChange={e => setDesc(e.target.value)} value={desc} />
                </Form.Field>
                <Form.Field>
                    <label>Value in ether</label>
                    <Input label='ether' labelPosition='right' onChange={e => setValue(e.target.value)} value={value} />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input onChange={e => setRecipient(e.target.value)} value={recipient} />
                </Form.Field>
                <Message success header={alert.type} content={alert.msg} />
                <Message error header={alert.type} content={alert.msg} />
                <Button type='submit' onClick={onClick} primary loading={loading} >Add Request</Button>
            </Form><br />
            <Link href={{
                pathname: `/campaign/${address}/requests`,
                query: { address },
            }}>
                <a>← Back to requests</a>
            </Link>
        </Layout>
    )
}

export default add
