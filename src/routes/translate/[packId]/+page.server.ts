import { getTranslationWords, saveTranslation } from '$lib/server/db/crud.remote';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/translate/login');
	}

	const result = await getTranslationWords({ childPackId: params.packId });
	
	if (!result) {
		return { 
			isMainPack: true, 
			packId: params.packId,
			words: [],
			currentIndex: 0,
			totalCount: 0,
			translatedCount: 0
		};
	}

	return {
		isMainPack: false,
		packId: params.packId,
		words: result.words,
		currentIndex: 0,
		totalCount: result.totalCount,
		translatedCount: result.translatedCount,
		childLanguage: result.childLanguage
	};
};

export const actions = {
	saveTranslation: async ({ request, params }) => {
		const formData = await request.formData();
		const wordId = formData.get('wordId')?.toString() ?? '';
		const value = formData.get('value')?.toString() ?? '';
		
		if (!wordId || !value) {
			return { error: 'Word ID and translation value are required' };
		}

		const packId = params.packId;
		
		const result = await getTranslationWords({ childPackId: packId });
		if (result) {
			await saveTranslation({ wordId, language: result.childLanguage, value });
			return { success: true };
		}
		
		return { error: 'Pack not found' };
	}
};