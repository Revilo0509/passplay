import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { ADMIN_PASSWORD, TRANSLATOR_PASSWORD } from '$env/static/private';
import { createHmac } from 'crypto';

function verifySession(session: string): { id: string; role: 'admin' | 'translator' } | null {
	try {
		const [payload, hash] = session.split('.');
		const role = JSON.parse(atob(payload)).role;
		const secret = role === 'admin' ? ADMIN_PASSWORD : TRANSLATOR_PASSWORD;
		const expectedHash = createHmac('sha256', secret).update(payload).digest('hex').slice(0, 16);
		if (hash !== expectedHash) return null;

		const data = JSON.parse(atob(payload));
		if (!data.id || !data.role) return null;
		return data as { id: string; role: 'admin' | 'translator' };
	} catch {
		return null;
	}
}

function createSession(id: string, role: 'admin' | 'translator'): string {
	const secret = role === 'admin' ? ADMIN_PASSWORD : TRANSLATOR_PASSWORD;
	const payload = btoa(JSON.stringify({ id, role }));
	const hash = createHmac('sha256', secret).update(payload).digest('hex').slice(0, 16);
	return `${payload}.${hash}`;
}

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');
	const user = session ? verifySession(session) : null;
	event.locals.user = user;

	const publicRoutes = ['/admin/login', '/translate/login'];
	const isPublicRoute = publicRoutes.includes(event.url.pathname);

	if (!user && !isPublicRoute) {
		if (event.url.pathname.startsWith('/admin')) {
			return new Response(null, { status: 302, headers: { Location: '/admin/login' } });
		}
		if (event.url.pathname.startsWith('/translate')) {
			return new Response(null, { status: 302, headers: { Location: '/translate/login' } });
		}
	}

	return resolve(event);
};

export { createSession };

export const handle = sequence(handleAuth, handleParaglide);
