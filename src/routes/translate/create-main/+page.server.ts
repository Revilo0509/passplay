import { createWordpack } from '$lib/server/db/crud.remote';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/translate/login');
	}
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/translate/login');
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const description = formData.get('description')?.toString() ?? '';

		if (!name) {
			return { error: 'Name is required' };
		}

		await createWordpack({ name, language: 'en', description });
		throw redirect(303, '/translate');
	}
};