import PropTypes from 'prop-types';

export const Story = ({ backgroundImage, foregroundImage, content, footer }) => (
	<div className="flex w-full flex-col">
		<div className="relative flex w-full items-center justify-center overflow-hidden">
			<div className="absolute z-0 h-full max-h-full w-full">{backgroundImage}</div>

			<div className="container z-10 flex w-full max-w-max-content flex-col items-center gap-6 px-6 pt-6 lg:flex-row">
				<div className="flex w-full justify-center lg:w-1/2">{content}</div>
				<div className="flex w-full justify-center lg:mt-auto lg:w-1/2">{foregroundImage}</div>
			</div>
		</div>

		<div className="flex w-full items-center justify-center bg-black p-4 text-white">
			<div className="text-xl">{footer}</div>
		</div>
	</div>
);

Story.propTypes = {
	backgroundImage: PropTypes.node.isRequired,
	foregroundImage: PropTypes.node.isRequired,
	content: PropTypes.node.isRequired,
	footer: PropTypes.string.isRequired,
};
