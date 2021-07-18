const pmsIdToRoomCategory: { [key: string]: string } = {
	3: 'четырёхместный',
	32769: 'пятиместный #30',
	4: 'пятиместный #36',
	32770: 'резерв #39',
	2: 'трёхместный',
	1: 'двухместный',
	32768: 'пятиместный #46',
	65536: 'четырёхместный #43'
};

export function getRoomCategory(pmsId: number): string | undefined {
	const roomCategory = pmsIdToRoomCategory[pmsId];
	if (!roomCategory) {
		console.warn('Room category not found for ', pmsId);
	}
	return roomCategory;
}
