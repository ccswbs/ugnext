import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@awesome.me/kit-7993323d0c/icons/classic/solid';
import { faEnvelope } from '@awesome.me/kit-7993323d0c/icons/classic/regular';
import { Link } from '@/components/link';
import PropTypes from 'prop-types';

export const Contact = ({ name, title, phoneNumber, extension, email }) => {
	return (
		<div className="flex flex-col mb-2 bg-grey-50 p-4">
			<span className="font-bold">{name}</span>

			<span>{title}</span>

			<div className="flex gap-1 items-center">
				<FontAwesomeIcon icon={faPhone} />
				<Link className="py-0" href={`tel:${phoneNumber}`}>
					{phoneNumber}
				</Link>
				{extension && <span>Ext. {extension}</span>}
			</div>

			<div className="flex gap-1 items-center">
				<FontAwesomeIcon icon={faEnvelope} />
				<Link className="py-0" href={`mailto:${email}`}>
					{email}
				</Link>
			</div>
		</div>
	);
};

Contact.propTypes = {
	name: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	phoneNumber: PropTypes.string.isRequired,
	extension: PropTypes.string,
	email: PropTypes.string.isRequired,
};
