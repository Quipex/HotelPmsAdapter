const pmsIdToRoom: { [key: string]: number } = {
	23: 1,
	40: 2,
	24: 3,
	25: 4,
	32804: 5,
	41: 6,
	26: 7,
	42: 8,
	43: 9,
	44: 10,
	27: 11,
	28: 12,
	32801: 13,
	29: 14,
	30: 15,
	31: 16,
	32805: 17,
	32: 18,
	32806: 19,
	32795: 20,
	32796: 21,
	32797: 22,
	32798: 23,
	33: 24,
	32799: 25,
	32800: 26,
	34: 27,
	45: 28,
	32807: 29,
	32812: 30,
	35: 31,
	46: 32,
	47: 33,
	48: 34,
	49: 35,
	32802: 36,
	36: 37,
	37: 38,
	32813: 39,
	38: 40,
	50: 41,
	51: 42,
	32808: 43,
	32809: 44,
	32810: 45,
	32803: 46,
	32811: 47,
	39: 48,
	52: 49,
};

export function getRoom(pmsId: number): number | undefined {
	const realRoom = pmsIdToRoom[pmsId];
	if (!realRoom) {
		console.warn('Room number not found for ', pmsId);
	}
	return realRoom;
}

export function getRoomPmsId(roomId: number): number | undefined {
	return Number(Object.keys(pmsIdToRoom).find(pmsId => pmsIdToRoom[pmsId] === roomId));
}
