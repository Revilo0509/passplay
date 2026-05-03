const BASE_URL = "https://www.wordgamedb.com/api/v2";

export type Word = {
	word: string;
	hint: string;
};

export async function fetchCategories(): Promise<string[]> {
	const response = await fetch(`${BASE_URL}/categories`);
	return response.json();
}

export async function fetchWord(category: string): Promise<Word> {
	const response = await fetch(`${BASE_URL}/words?category=${category}&limit=1`);
	const data = await response.json();
	return data.words[0] as Word;
}