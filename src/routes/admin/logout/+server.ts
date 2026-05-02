import { redirect } from '@sveltejs/kit';

export const POST = ({ cookies }) => {
	cookies.delete('session', { path: '/', httpOnly: true, sameSite: 'strict' });
	throw redirect(302, '/admin/login');
};