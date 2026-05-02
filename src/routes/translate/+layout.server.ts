import { redirect } from '@sveltejs/kit';

export const load = ({ locals, url }) => {
	if (url.pathname === '/translate/login') return;

	if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'translator')) {
		throw redirect(302, '/translate/login');
	}
};