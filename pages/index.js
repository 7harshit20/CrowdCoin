import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import campaignFactory from '../ethereum/campaignFactory'
import { Card, Button } from 'semantic-ui-react'
import Layout from '../components/Layout';



export async function getServerSideProps() {
    const campaigns = await campaignFactory.methods.getCampaign().call();
    return {
        props: {
            campaigns
        }
    }
}


const index = ({ campaigns }) => {

    // const [campaign, setCampaign] = useState([]);
    // useEffect(() => {
    //     const loadCampaigns = async () => {
    //         let campaigns = await campaignFactory.methods.getCampaign().call();
    //         setCampaign(campaigns);
    //     }
    //     loadCampaigns();
    // }, [])

    const getCampaign = () => {
        const items = campaigns.map((address) => {
            return {
                header: address,
                description:
                    <Link href={`/campaign/${address}`}>
                        <a> View Campaign </a>
                    </Link>,
                fluid: true
            };
        });
        return <Card.Group items={items} />
    }


    return (
        <Layout>
            <Head>
                <title>CrowdCoin</title>
            </Head>
            <div>
                <h3>Open Campaigns</h3>
                <Link href='/campaign/new' >
                    <a><Button floated='right' content='Create Campaign' icon='add circle' primary labelPosition='right' /></a>
                </Link>
                {getCampaign()}
            </div>
        </Layout>
    )
}

export default index
