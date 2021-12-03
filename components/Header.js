import React from 'react'
import { Menu } from 'semantic-ui-react'
import Link from 'next/link'

export default function header() {
    return (
        <Menu style={{ margin: '10px' }} >
            <Link href='/' >
                <a className='item'> CrowdCoin </a>
            </Link>
            <Menu.Menu position='right'>
                <Link href='/' >
                    <a className='item'> Campaign </a>
                </Link>
                <Link href='/campaign/new' >
                    <a className='item'>+</a>
                </Link>
            </Menu.Menu>
        </Menu>
    )
}
