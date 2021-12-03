import React, { useState } from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import campaignFunc from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import Router from 'next/router'

const ContributeForm = ({ address }) => {
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState({
        type: '',
        msg: ''
    })

    const onClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        const campaign = campaignFunc(address);
        try {
            const accounts = await web3.eth.getAccounts();
            setAlert({ type: '', msg: '' });
            await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei(value, 'ether') });
            setAlert({ type: 'success', msg: 'Contribution made successfully!' });
            Router.reload(window.location.pathname);
        } catch (error) {
            setAlert({ type: 'error', msg: error.message });
        }
        setLoading(false);
    }

    return (
        <div>
            <h3>Contribute to the campaign</h3>
            <Form error={alert.type === 'error'} success={alert.type === 'success'}>
                <Form.Field>
                    <label>Contribution Amount</label>
                    <Input label='ether' labelPosition='right' placeholder='Enter here...' onChange={e => setValue(e.target.value)} value={value} />
                </Form.Field>
                <Message success header={alert.type} content={alert.msg} />
                <Message error header={alert.type} content={alert.msg} />
                <Button type='submit' onClick={onClick} primary loading={loading} >Contribute!</Button>
            </Form>
        </div>
    )
}

export default ContributeForm;
