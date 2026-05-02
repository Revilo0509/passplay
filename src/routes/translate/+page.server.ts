import {
	listWordpacks,
	createWordpack,
	addBulkWords,
	deleteWordpack,
	getMainPackWithWordCount,
	getChildPackWithTranslationCount
} from '$lib/server/db/crud.remote';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/translate/login');
	}

	const wordpacks = await listWordpacks({});
	
	const mainPacks = wordpacks.filter(p => !p.parentId);
	const childPacks = wordpacks.filter(p => p.parentId);
	
	const mainPacksWithCounts = await Promise.all(
		mainPacks.map(async (pack) => {
			const result = await getMainPackWithWordCount({ id: pack.id });
			const childPacksForMain = childPacks.filter(c => c.parentId === pack.id);
			const childPacksWithCounts = await Promise.all(
				childPacksForMain.map(async (child) => {
					const childResult = await getChildPackWithTranslationCount({ id: child.id });
					return {
						...child,
						wordCount: childResult?.translationCount || 0,
						mainWordCount: childResult?.mainWordCount || 0,
						parentName: childResult?.parentName || ''
					};
				})
			);
			return {
				...pack,
				wordCount: result?.wordCount || 0,
				children: childPacksWithCounts
			};
		})
	);

	return { 
		user: locals.user, 
		mainPacks: mainPacksWithCounts
	};
};

export const actions = {
	addWord: async ({ request }) => {
		const formData = await request.formData();
		const wordpackId = formData.get('wordpackId')?.toString() ?? '';
		const word = formData.get('word')?.toString() ?? '';
		const hint = formData.get('hint')?.toString() ?? '';

		if (!wordpackId || !word) {
			return { error: 'Word is required' };
		}

		await addBulkWords({ wordpackId, words: [{ word, hint }] });
		return { success: true };
	}
};
