import React, { useState } from 'react';
import { connect } from '@aragon/connect'
import { TokenManager } from '@aragon/connect-thegraph-tokens'
import './App.css';

// Components
import { Button } from './components/Buttons'
import { Container } from './components/Containers'
import { H1 } from './components/Typography'

// Config
const LACE_ID = '0x2FC93840d11b9A280948cCFd0B6802A703ec632A'

function App() {
	const [org, setOrg] = useState(null)
	const [apps, setApps] = useState(null)
	const [loading, setLoading] = useState(true)
	
	async function initOrg() {
		const org = await connect(LACE_ID, 'thegraph', { chainId: 4 })
		const apps = await org.apps();

		console.log(apps)
		setOrg(org)
		setApps(apps)
		setLoading(false)
	}

	async function initTokens() {
		const tokenManager = new TokenManager(
			'0x182b3e1c15c4e313f251898f6fb17c31861554b1',
			'https://api.thegraph.com/subgraphs/name/aragon/aragon-tokens-rinkeby'
		  )

		console.log(tokenManager)
	}

	return (
		<Container>
			<H1>Project Lace</H1>
			<Button onClick={initOrg}>Initialize</Button>
			{!loading && (
				<div>
					<h3>Organization Address:</h3>
					<p>{org.location}</p>
					<br />
					<br />
					<h4>Apps:</h4>
					<ul>
						{apps.map(app => (
							<li key={app.appId} onClick={initTokens}>{app.name}</li>
						))}
					</ul>
				</div>
			)}
		</Container>
	);
}

export default App;
