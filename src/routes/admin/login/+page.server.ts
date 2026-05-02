import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_PASSWORD } from '$env/static/private';
import { createSession } from '../../../hooks.server';
import { z } from 'zod';
import { timingSafeEqual } from 'crypto';
import { checkRateLimit, recordLogin, getAttemptsLeft } from '$lib/server/rateLimiter';

const loginSchema = z.object({
	password: z.string().min(1, 'Password is required')
});

function safeCompare(a: string, b: string): boolean {
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);
	if (bufA.length !== bufB.length) {
		Buffer.from(b).fill(0);
		return false;
	}
	return timingSafeEqual(bufA, bufB);
}

function getClientIp(request: Request): string {
	const socket = (request as any).socket || (request as any).connection;
	const remoteAddress = socket?.remoteAddress;
	if (remoteAddress) return remoteAddress;

	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0].trim();
	return request.headers.get('x-real-ip') || 'unknown';
}

export const load = ({ locals, request }) => {
	if (locals.user?.role === 'admin') {
		throw redirect(302, '/admin');
	}

	const ip = getClientIp(request);
	const attemptsLeft = getAttemptsLeft(ip);

	return { attemptsLeft };
};

export const actions = {
	default: async ({ cookies, request }) => {
		const ip = getClientIp(request);
		const rateLimit = checkRateLimit(ip);

		if (!rateLimit.allowed) {
			return fail(429, {
				errors: { password: [`Too many attempts. Try again in ${rateLimit.lockoutRemaining} seconds`] },
				password: ''
			});
		}

		const formData = await request.formData();
		const password = formData.get('password')?.toString() ?? '';

		const result = loginSchema.safeParse({ password });
		if (!result.success) {
			const passwordErrors = result.error.issues
				.filter((i) => i.path[0] === 'password')
				.map((i) => i.message);
			return fail(400, { errors: { password: passwordErrors }, password });
		}

		if (!safeCompare(password, ADMIN_PASSWORD)) {
			recordLogin(ip, false, 'admin');
			return fail(401, { errors: { password: ['Invalid password'] }, password });
		}

		recordLogin(ip, true, 'admin');

		const session = createSession('admin', 'admin');
		cookies.set('session', session, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7
		});

		throw redirect(303, '/admin');
	}
};