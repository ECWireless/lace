import React, { useState, useEffect } from 'react';
import { connect } from '@aragon/connect'
import { TokenManager } from '@aragon/connect-thegraph-tokens'
import './App.css';

// Components
import { Button } from './components/Buttons'
import { Card } from './components/Cards'
import { Container, Flex, FlexColumn } from './components/Containers'
import { H1 } from './components/Typography'

// Config
const LACE_ID = '0x0d9FD3f485Bd8D77B8610477785671ae824b1317'

function App() {
	const [org, setOrg] = useState(null)
	const [apps, setApps] = useState(null)
	const [tokenManagerAddress, setTokenManagerAddress] = useState(null)
	const [token, setToken] = useState(null)
	const [holders, setHolders] = useState(null)
	const [appAddress, setAppAddress] = useState('[none selected]')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function initOrg() {
			try {
				setLoading(true)
				const org = await connect(LACE_ID, 'thegraph', { chainId: 4 })
				let apps = await org.apps();
				let tokenManagerAddress = await org.app('token-manager')
				tokenManagerAddress = await tokenManagerAddress.address
		
				// Get Token Manager App Address
				// const tokenManagerApp = await org.app('token-manager')
				const tokenManager = new TokenManager(
					// Token Manager App Address
					tokenManagerAddress,
					'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-rinkeby'
				)
				const token = await tokenManager.token()
				const holders = await token.holders()
		
				setOrg(org)
				setApps(apps)
				setTokenManagerAddress(tokenManagerAddress)
				setToken(token)
				setHolders(holders)
			} catch(e) {
				console.log('connect error:', e)
			} finally {
				setLoading(false)
			}
		}

		initOrg()
	}, [])

	return (
		<Container>
			<H1>Project Lace</H1>
			{loading ? <p>Loading...</p> : (
				<FlexColumn>
					<h3>Organization Name: <span style={{fontWeight: 'bold'}}>LaceTest3</span></h3>
					<h3>Organization Address:</h3>
					<p>{org.location}</p>
					<br />
					<br />
					<h4>Apps:</h4>
					<Flex style={{alignSelf: 'center', width: '100%'}}>
						{
							apps.filter(app => app.name !== null).map(app => {
								return <Button onClick={() => setAppAddress(app.address)} key={app.appId}>{app.name}</Button>
							})
						}
					</Flex>
					<Card>App Address: {appAddress}</Card>
					{appAddress === tokenManagerAddress && (
						<>
							<Card>
								<h2>Token Details:</h2>
								<p>Name: {token.name}</p>
								<p>Symbol: {token.symbol}</p>
								<p>Total Supply: {Number(token.totalSupply) / Math.pow(10, 18)}</p>
								<p>Transferable: {token.transferable ? 'Yes' : 'No'}</p>
							</Card>

							<Card>
								{holders.map(holder => {
									return(
										<div key={holder.address}>
											<h2>Token Holder 1: {holder.address} <span style={{fontWeight: 'bold'}}>{holder.address === '0x1a9cee6e1d21c3c09fb83a980ea54299f01920cd' 
												? '(Elliott)' 
												: '(Unknown Person'}</span>
											</h2>
											<p>Balance: {Number(holder.balance)  / Math.pow(10, 18)}</p>
											<p>Token Address: {holder.tokenAddress}</p>
										</div>
									)
									
								})}
							</Card>
						</>
					)}
					<h2>View Cred Desitribution:</h2>
					<a href="https://ecwireless.github.io/lacecred/">LaceCred</a>
				</FlexColumn>
			)}
		</Container>
	);
}

export default App;
