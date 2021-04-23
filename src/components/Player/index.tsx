import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import Image from 'next/image'

import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import { useContext, useRef, useEffect, useState } from 'react'
import { PlayerContext } from '../../contexts/PlayerContext'

export function Player() {

	// Barra de progresso
	const [progress, setProgress] = useState(0)

	// Referência para o áudio
	const audioRef = useRef<HTMLAudioElement>(null)

	// Desestruturação dos elementos que estão dentro do contexto
	const { 
		episodeList, 
		currentEpisodeIndex, 
		isPlaying, 
		isLooping,
		isShuffling,
		clearPlayerState,
		togglePlay, 
		toggleLoop,
		toggleSuffle,
		setPlayingState,
		playNext,
		playPrevious, 
		hasNext,
		hasPrevious
	} = useContext(PlayerContext)

	// Episódio atual
	const episode = episodeList[currentEpisodeIndex]

	// Função que irá observar o progresso da barra de progresso do Player
	function setupProgressListener() {
		audioRef.current.currentTime = 0;

		audioRef.current.addEventListener('timeupdate', () => {
			setProgress(Math.floor(audioRef.current.currentTime))
		})
	}

	// Função para alterar a barra de progresso com o slider
	function handleSeek(amount: number) {
		audioRef.current.currentTime = amount;
		setProgress(amount)
	}

	// Função que irá fazer com que seja tocados episódios aleatórios quando o áudio acabar
	function handleEpisodeEnded() {
		if (hasNext) {
			playNext();

		} else {
			clearPlayerState();
		}
	}

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
					<span>{convertDurationToTimeString(progress)}</span>

					<div className={styles.slider}>
						{ episode ? (

							<Slider 
								max={episode.duration}
								value={progress}
								onChange={handleSeek}
								trackStyle={{ backgroundColor: '#04d361' }}
								railStyle={{ backgroundColor: '#9f75ff' }}
								handleStyle={{ borderColor: '#04d361', borderWidth: 3 }}
							/>
						) : (

							<div className={styles.emptySlider} />
						) }
					</div>

					<span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>

				</div>

				{ episode && (

					<audio 
						src={episode.url}
						ref={audioRef}
						autoPlay 
						loop={isLooping}
						onEnded={handleEpisodeEnded}
						onPlay={() => setPlayingState(true)}
						onPause={() => setPlayingState(false)}
						onLoadedMetadata={setupProgressListener}
					/>
				) }

				<div className={styles.buttons}>
					<button 
						type="button" 
						disabled={!episode || episodeList.length == 1}
						onClick={toggleSuffle}
						className={isShuffling ? styles.isActive : ''}
					>
						<img src="/shuffle.svg" alt="Embaralhar" />
					</button>

					<button type="button" disabled={!episode} onClick={playPrevious}>
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

					<button type="button" disabled={!episode} onClick={playNext}>
						<img src="/play-next.svg" alt="Tocar próxima" />
					</button>

					<button 
						type="button" 
						disabled={!episode} 
						onClick={toggleLoop} 
						className={isLooping ? styles.isActive : ''}>
						<img src="/repeat.svg" alt="Repetir" />
					</button>
				</div>
			</footer>		
		</div>
	)
}
