import '../styles/global.scss'
import styles from '../styles/app.module.scss'

import { useState } from 'react'
import { Header } from '../components/Header'
import { Player } from '../components/Player'
import { PlayerContext } from '../contexts/PlayerContext'

function MyApp({ Component, pageProps }) {

	const [episodeList, setEpisodeList] = useState([])
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)

	// Função para setar os elementos do episódio
	function play(episode) {
		setEpisodeList([episode])
		setCurrentEpisodeIndex(0)
		setIsPlaying(true)
	}

	// Função para dar play/pause no episódio
	function togglePlay() {
		setIsPlaying(!isPlaying)
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

	return (
		<PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState }}>
			<div className={styles.wrapper}>
				<main>
					<Header />
					<Component {...pageProps} />
				</main>

				<Player />
			</div>
		</PlayerContext.Provider>
		)
}

export default MyApp
