export async function getStaticPaths() {
	return {
		paths: [],
		fallback: true,
	}
}

export async function getStaticProps(context) {
	return {
		notFound: true,
	}
}

export default function UndergraduateAdmissionRequirements(props) {

}