const DB_NAME = 'passplay-words';
const DB_VERSION = 1;
const STORE_NAME = 'words';

interface Word {
	word: string;
	hint: string;
	category: string;
	letterCount?: number;
	syllableCount?: number;
}

interface CachedData {
	categories: string[];
	words: Word[];
	cachedAt: number;
}

let db: IDBDatabase | null = null;

async function openDB(): Promise<IDBDatabase> {
	if (db) return db;

	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			db = request.result;
			resolve(db);
		};

		request.onupgradeneeded = (event) => {
			const database = (event.target as IDBOpenDBRequest).result;
			if (!database.objectStoreNames.contains(STORE_NAME)) {
				database.createObjectStore(STORE_NAME);
			}
		};
	});
}

export async function saveToCache(data: CachedData): Promise<void> {
	const database = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = database.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.put(data, 'all-words');

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve();
	});
}

export async function getFromCache(): Promise<CachedData | null> {
	const database = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = database.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get('all-words');

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result || null);
	});
}

export async function isCacheValid(): Promise<boolean> {
	const data = await getFromCache();
	if (!data) return false;

	const ONE_DAY = 24 * 60 * 60 * 1000;
	const now = Date.now();
	return now - data.cachedAt < ONE_DAY;
}

export async function getCategories(): Promise<string[]> {
	const data = await getFromCache();
	return data?.categories ?? [];
}

export async function getWord(category?: string): Promise<Word | null> {
	const data = await getFromCache();
	if (!data || !data.words.length) return null;

	if (category) {
		const filtered = data.words.filter((w) => w.category === category);
		if (filtered.length === 0) return null;
		return filtered[Math.floor(Math.random() * filtered.length)];
	}

	return data.words[Math.floor(Math.random() * data.words.length)];
}

export async function fetchAndCacheAllWords(): Promise<void> {
	const words: Word[] = [];
	let offset = 0;
	const limit = 100;
	let hasMore = true;

	while (hasMore) {
		const response = await fetch(
			`https://www.wordgamedb.com/api/v2/words?limit=${limit}&offset=${offset}`
		);
		const result = await response.json();

		words.push(...result.words);
		hasMore = result.pagination?.hasMore ?? false;
		offset += limit;

		console.log(`Fetched ${words.length} words...`);
	}

	const categories = [...new Set(words.map((w) => w.category))];

	await saveToCache({
		categories,
		words,
		cachedAt: Date.now()
	});

	console.log(`Cached ${words.length} words in ${categories.length} categories`);
}

export async function initCache(): Promise<void> {
	const isValid = await isCacheValid();
	if (!isValid) {
		await fetchAndCacheAllWords();
	}
}