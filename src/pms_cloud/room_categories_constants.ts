const pmsIdToRoomCategory: { [key: string]: string } = {
	1: 'двухместный',
	2: 'трёхместный',
	3: 'четырёхместный',
	4: 'пятиместный #36',
	32769: 'пятиместный #30',
	32770: 'резерв #39',
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

const pmsRoomTypeIdToRealRooms: { [key: number]: number[] } = {
	1: [20, 21, 10, 2, 35, 34, 33, 32, 49, 28, 6, 9, 26, 25, 42, 23, 41, 8, 22],
	2: [24, 31, 38, 37, 48, 11, 12, 14, 3, 4, 7, 1, 18, 27, 16, 13, 15, 40],
	3: [47, 5, 29, 19, 17, 44, 45],
	4: [36],
	32770: [39],
	32769: [30],
	32768: [46],
	65536: [43]
};

export function pmsRoomTypeIdFromRealRoomNumber(realRoomNumber: number) {
	const pmsRoomTypeId = Object.keys(pmsRoomTypeIdToRealRooms).find(roomTypeId => {
		const rooms = pmsRoomTypeIdToRealRooms[roomTypeId];
		return !!rooms.find(room => room === realRoomNumber);
	});
	if (!pmsRoomTypeId) {
		console.warn('Pms room typeId not found from ', realRoomNumber);
	}
	return pmsRoomTypeId;
}
