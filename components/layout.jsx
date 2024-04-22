import { PreviewRibbon } from '@pantheon-systems/nextjs-kit';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Head from 'next/head';

export default function Layout({ children, menu, preview = false }) {
	return (
		<div className="flex flex-col flex-1">
			{preview && <PreviewRibbon />}
			<Header menu={menu} />
			<main className="mb-auto">{children}</main>
			<Footer />
		</div>
	);
}
