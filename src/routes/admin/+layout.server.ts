import { redirect } from '@sveltejs/kit';

export const load = ({ locals, url }) => {
	if (url.pathname === '/admin/login') return;

	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(302, '/admin/login');
	}
};
