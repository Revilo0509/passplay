import { getWordpackByLanguageAndCategory } from '$lib/server/db/crud';

export const load = async ({ params }) => {
	const { language, category } = params;

	const wordpack = await getWordpackByLanguageAndCategory(language, category);

	return { wordpack };
};
