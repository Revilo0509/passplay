import { createWordpack, listWordpacks } from '$lib/server/db/crud.remote';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/translate/login');
	}

	const wordpacks = await listWordpacks({});
	const mainPacks = wordpacks.filter(p => !p.parentId);

	return { mainPacks };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/translate/login');
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const language = formData.get('language')?.toString() ?? '';
		const parentId = formData.get('parentId')?.toString() ?? '';
		const description = formData.get('description')?.toString() ?? '';

		if (!name || !language || !parentId) {
			return { error: 'Name, language and parent pack are required' };
		}

		await createWordpack({ name, language, description, parentId });
		throw redirect(303, '/translate');
	}
};