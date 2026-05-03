import { getFromCache, getTranslatedData, saveTranslatedData, type Word, type TranslatedData } from '$lib/services/wordCache';
import { translateBatch } from './translation';

let isTranslating = false;
let translationPromise: Promise<void> | null = null;

export async function hasSwedishTranslations(): Promise<boolean> {
	const data = await getTranslatedData('sv');
	return data !== null && data.words.length > 0;
}

export async function ensureSwedishTranslations(
	onProgress?: (completed: number, total: number) => void
): Promise<void> {
	if (await hasSwedishTranslations()) {
		return;
	}

	if (isTranslating && translationPromise) {
		await translationPromise;
		return;
	}

	isTranslating = true;
	translationPromise = performTranslation(onProgress);

	try {
		await translationPromise;
	} finally {
		isTranslating = false;
		translationPromise = null;
	}
}

async function performTranslation(
	onProgress?: (completed: number, total: number) => void
): Promise<void> {
	const cachedData = await getFromCache();
	if (!cachedData || !cachedData.words.length) {
		throw new Error('No English words cached to translate');
	}

	console.log(`Starting translation of ${cachedData.words.length} words to Swedish...`);

	const uniqueWords = new Map<string, { word: string; hint: string }>();

	for (const w of cachedData.words) {
		uniqueWords.set(w.word, { word: w.word, hint: w.hint });
	}

	const wordsToTranslate = Array.from(uniqueWords.values());
	const textsToTranslate: string[] = [];

	for (const { word, hint } of wordsToTranslate) {
		textsToTranslate.push(word);
		if (hint) textsToTranslate.push(hint);
	}

	const translatedTexts = await translateBatch(textsToTranslate, 'en', 'sv', onProgress);

	const translatedWords: Word[] = [];
	let textIndex = 0;

	for (const { word } of wordsToTranslate) {
		const translatedWord = translatedTexts[textIndex++] ?? word;
		const translatedHint = translatedTexts[textIndex++] ?? '';

		translatedWords.push({
			word: translatedWord,
			hint: translatedHint,
			category: ''
		});
	}

	const translatedCategories = [...new Set(cachedData.categories.map((c) => c))];

	console.log(
		`Translation complete: ${translatedWords.length} words, ${translatedCategories.length} categories`
	);

	await saveTranslatedData({
		categories: translatedCategories,
		words: translatedWords,
		translatedAt: Date.now(),
		locale: 'sv'
	});
}
