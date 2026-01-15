import { useCallback, useRef } from "react";

export function useSound(url: string) {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const play = useCallback(() => {
		if (!audioRef.current) {
			audioRef.current = new Audio(url);
		}

		audioRef.current.currentTime = 0;
		audioRef.current.play().catch((error) => {
			console.error("Error playing sound:", error);
		});
	}, [url]);

	return { play };
}
