import { getCategories, getWord, initCache, isCacheValid } from './wordCache';

export type Word = {
	word: string;
	hint: string;
	category?: string;
};

export async function fetchCategories(): Promise<string[]> {
	try {
		if (await isCacheValid()) {
			return await getCategories();
		}
	} catch (e) {
		console.warn('Cache read failed, falling back to API', e);
	}

	const response = await fetch('https://www.wordgamedb.com/api/v2/categories');
	const categories = await response.json();

	initCache().catch(console.error);
	return categories;
}

export async function fetchWord(category?: string): Promise<Word> {
	try {
		if (await isCacheValid()) {
			const word = await getWord(category);
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
