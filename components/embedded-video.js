import React from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { Button } from '@/components/button';
import { YouTubeEmbed } from '@next/third-parties/google';

export function EmbeddedVideo({ type, id, title, transcript, height, width, className }) {
	const ratio = Number.parse((width / height).toFixed(2));

	return (
		<div className={twMerge('flex flex-col', className)}>
			{type === 'youtube' && <YouTubeEmbed id={id} height={height} width={width} playlabel={title} />}

			{type === 'vimeo' && (
				<iframe
					className="w-full h-full absolute top-0 left-0"
					allowFullScreen
					src={`https://player.vimeo.com/video/${id}`}
					title={title ?? 'Vimeo EmbeddedVideo Player'}
				/>
			)}

			{transcript && (
				<Button color="red" className="w-full" href={transcript} download>
					Download Transcript
				</Button>
			)}
		</div>
	);
}
