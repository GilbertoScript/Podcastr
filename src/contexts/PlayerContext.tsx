// Criação do contexto de player
import { createContext, useState, ReactNode } from 'react'

type Episode = {
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	url: string;
}

type PlayerContextData = {
	episodeList: Episode[];
	currentEpisodeIndex: number;
	isPlaying: boolean; 
	isLooping: boolean;
	isShuffling: boolean;
	clearPlayerState: () => void;
	play: (episode: Episode) => void;
	playList: (list: Episode[], index: number) => void
	playNext: () => void;
	playPrevious: () => void;
	setPlayingState: (state: boolean) => void;
	togglePlay: () => void;
	toggleLoop: () => void;
	toggleSuffle: () => void;
	hasNext: boolean;
	hasPrevious: boolean;
}

type PlayerContextProviderProps = {
	children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
	const [episodeList, setEpisodeList] = useState([])
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isLooping, setIsLooping] = useState(false)
	const [isShuffling, setIsShuffling] = useState(false)

	// Função para setar os elementos do episódio
	function play(episode: Episode) {
		setEpisodeList([episode])
		setCurrentEpisodeIndex(0)
		setIsPlaying(true)
	}

	function playList(list: Episode[], index: number) {
		setEpisodeList(list)
		setCurrentEpisodeIndex(index)
		setIsPlaying(true)
	}

	function clearPlayerState() {
		setEpisodeList([]);
		setCurrentEpisodeIndex(0)
	}

	// Função para dar play/pause no episódio
	function togglePlay() {
		setIsPlaying(!isPlaying)
	}

	// Função para ativar loop no episódio
	function toggleLoop() {
		setIsLooping(!isLooping)
	}

	// Função para ativar o suffle
	function toggleSuffle() {
		setIsShuffling(!isShuffling)
	}

	const hasPrevious = currentEpisodeIndex > 0;
	const hasNext =  isShuffling || (currentEpisodeIndex + 1)  < episodeList.length ;

	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

	function playNext() {
		
		if(isShuffling) {
			const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
			setCurrentEpisodeIndex(nextRandomEpisodeIndex)

		} else if (hasNext) {

			setCurrentEpisodeIndex(currentEpisodeIndex + 1)
		}
		
	}

	function playPrevious() {
		if (hasPrevious) {
			setCurrentEpisodeIndex(currentEpisodeIndex - 1)
		}
	}

	return (
		<PlayerContext.Provider 
			value={{ 
				episodeList, 
				currentEpisodeIndex, 
				play, 
				playList, 
				playNext,
				playPrevious,
				clearPlayerState,
				isPlaying, 
				isLooping,
				isShuffling,
				togglePlay, 
				toggleLoop,
				toggleSuffle,
				setPlayingState, 
				hasNext, 
				hasPrevious, 
			}}
		>
			{children}
		</PlayerContext.Provider>
	)
}
