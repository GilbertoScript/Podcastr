import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import Image from 'next/image'

import { useContext, useRef, useEffect } from 'react'
import { PlayerContext } from '../../contexts/PlayerContext'

export function Player() {

	// Referência para o áudio
	const audioRef = useRef<HTMLAudioElement>(null)

	// Desestruturação dos elementos que estão dentro do contexto
	const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState } = useContext(PlayerContext)

	// Episódio atual
	const episode = episodeList[currentEpisodeIndex]

	/* Cada vez que o valor de isPlaying for mudado, algo irá acontecer: */
	useEffect(() => {

		// Caso audioRef não esteja tocando nada, nada será feito
		if(!audioRef.current) {
			return;
		}

		// Efeito de play e pause para o isPlaying.
		if(isPlaying) {
			audioRef.current.play()

		} else {
			audioRef.current.pause()
		}

	}, [isPlaying])

	return (
		<div className={styles.playerContainer}>
			
			<header>
				<img src="/playing.svg" alt="Tocando agora" />
				<strong>Tocando agora</strong>
			</header>

			{ episode ? (

				<div className={styles.currentEpisode}>
					<Image 
						width={592} 
						height={592} 
						src={episode.thumbnail} 
						alt={episode.title} 
						objectFit="cover"
					/>

					<strong>{episode.title}</strong>
					<span>{episode.members}</span>
				</div>
			) : (

				<div className={styles.emptyPlayer}>
					<strong>Selecione um podcast para ouvir</strong>
				</div>
			) }

			<footer className={!episode ? styles.empty : ''}>
				<div className={styles.progress}>
					<span>00:00</span>

					<div className={styles.slider}>
						{ episode ? (

							<Slider 
								trackStyle={{ backgroundColor: '#04d361' }}
								railStyle={{ backgroundColor: '#9f75ff' }}
								handleStyle={{ borderColor: '#04d361', borderWidth: 3 }}
							/>
						) : (

							<div className={styles.emptySlider} />
						) }
					</div>

					<span>00:00</span>
				</div>

				{ episode && (

					<audio 
						src={episode.url}
						ref={audioRef}
						autoPlay 
						onPlay={() => setPlayingState(true)}
						onPause={() => setPlayingState(false)}
					/>
				) }

				<div className={styles.buttons}>
					<button type="button" disabled={!episode}>
						<img src="/shuffle.svg" alt="Embaralhar" />
					</button>

					<button type="button" disabled={!episode}>
						<img src="/play-previous.svg" alt="Tocar anterior" />
					</button>

					<button 
						type="button" 
						className={styles.playButton} 
						disabled={!episode}
						onClick={togglePlay}
					>
						{ isPlaying ?

							<img src="/pause.svg" alt="Pausar" />
						:
							<img src="/play.svg" alt="Tocar" />
						}
					</button>

					<button type="button" disabled={!episode}>
						<img src="/play-next.svg" alt="Tocar próxima" />
					</button>

					<button type="button" disabled={!episode}>
						<img src="/repeat.svg" alt="Repetir" />
					</button>
				</div>
			</footer>		
		</div>
	)
}
