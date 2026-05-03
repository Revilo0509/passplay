import {
	getCategories,
	getWord,
	initCache,
	isCacheValid,
	ensureTranslations,
	type Locale
} from './wordCache';

export type Word = {
	word: string;
	hint: string;
	category?: string;
};

export async function fetchCategories(locale: Locale = 'en'): Promise<string[]> {
	try {
		if (await isCacheValid()) {
			if (locale === 'sv') {
				await ensureTranslations('sv');
			}
			return await getCategories(locale);
		}
	} catch (e) {
		console.warn('Cache read failed, falling back to API', e);
	}

	const response = await fetch('https://www.wordgamedb.com/api/v2/categories');
	const categories = await response.json();

	initCache().catch(console.error);
	return categories;
}

export async function fetchWord(category?: string, locale: Locale = 'en'): Promise<Word> {
	try {
		if (await isCacheValid()) {
			if (locale === 'sv') {
				await ensureTranslations('sv');
			}
			const word = await getWord(category, locale);
			if (word) return word;
		}
	} catch (e) {
		console.warn('Cache read failed, falling back to API', e);
	}

	const url = new URL('https://www.wordgamedb.com/api/v2/words/random');
	if (category) url.searchParams.set('category', category);

	const response = await fetch(url.toString());
	const data = await response.json();

	return data as Word;
}
