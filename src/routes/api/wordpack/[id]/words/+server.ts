import { getWordpackWords } from '$lib/server/db/crud.remote';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const wordpackId = params.id;
	if (!wordpackId) {
		return json({ error: 'Wordpack ID required' }, { status: 400 });
	}

	const wordList = await getWordpackWords({ wordpackId });
	return json(wordList ?? []);
};