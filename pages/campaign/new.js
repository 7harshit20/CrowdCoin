import React, { useState } from 'react'
import Head from 'next/head'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import campaignFactory from '../../ethereum/campaignFactory';
import web3 from '../../ethereum/web3';
import { useRouter } from 'next/router';

export default () => {
    const [minContribution, setMinContribution] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('')
        try {
            const accounts = await web3.eth.getAccounts();
            await campaignFactory.methods.createCampaign(minContribution).send({ from: accounts[0] });

        } catch (error) {
            setErrorMsg(error.message);
        }
        setLoading(false);
        router.push('/');

    }

    return (
        <Layout>
            <Head>
                <title>Create new Campaign</title>
            </Head>
            <div>
                <h3>Create a campaign</h3>
                <Form onSubmit={onSubmit} error={!!errorMsg}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input label='wei' labelPosition='right' placeholder='Minimum Contribution' onChange={e => setMinContribution(e.target.value)} value={minContribution} />
                    </Form.Field>
                    <Message error header='Error' content={errorMsg} />
                    <Button primary loading={loading} type='submit'>Create!</Button>
                </Form>
            </div>
        </Layout>
    )
}
