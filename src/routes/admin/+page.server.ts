import { getLogins } from '$lib/server/rateLimiter';

export const load = ({ locals }) => {
	return { user: locals.user, logins: getLogins() };
};