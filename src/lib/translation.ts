interface TranslateResponse {
	translatedText: string;
}

interface TranslateError {
	error: string;
}

const DEFAULT_LIBRETRANSLATE_URL = 'http://localhost:5000';
const BATCH_SIZE = 50;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

let configuredUrl: string | null = null;

export function setLibreTranslateUrl(url: string): void {
	configuredUrl = url;
}

function getUrl(): string {
	return configuredUrl ?? DEFAULT_LIBRETRANSLATE_URL;
}

async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function translateText(
	text: string,
	sourceLang: string = 'en',
	targetLang: string = 'sv'
): Promise<string> {
	const url = getUrl();

	for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
		try {
			const response = await fetch(`${url}/translate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					q: text,
					source: sourceLang,
					target: targetLang,
					format: 'text'
				})
			});

			if (!response.ok) {
				const error: TranslateError = await response.json();
				throw new Error(error.error ?? `HTTP ${response.status}`);
			}

			const data: TranslateResponse = await response.json();
			return data.translatedText;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			
			if (message.includes('CORS') || message.includes('Failed to fetch')) {
				console.error('CORS error: LibreTranslate server may not support CORS. Try running a local server: docker run -p 5000:5000 libretranslate/libretranslate');
			}
			
			console.warn(`Translation attempt ${attempt + 1} failed: ${message}`);

			if (attempt < RETRY_ATTEMPTS - 1) {
				await delay(RETRY_DELAY * (attempt + 1));
			}
		}
	}

	throw new Error(`Failed to translate after ${RETRY_ATTEMPTS} attempts`);
}

export async function translateBatch(
	texts: string[],
	sourceLang: string = 'en',
	targetLang: string = 'sv',
	onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
	const results: string[] = [];
	const total = texts.length;

	for (let i = 0; i < texts.length; i += BATCH_SIZE) {
		const batch = texts.slice(i, i + BATCH_SIZE);
		const batchResults = await Promise.all(
			batch.map((text) => translateText(text, sourceLang, targetLang))
		);
		results.push(...batchResults);

		if (onProgress) {
			onProgress(Math.min(i + BATCH_SIZE, total), total);
		}

		if (i + BATCH_SIZE < texts.length) {
			await delay(500);
		}
	}

	return results;
}
