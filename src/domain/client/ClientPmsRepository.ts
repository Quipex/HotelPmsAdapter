import { getRepository } from 'typeorm';
import { PmsClientEntity } from './ClientPmsModel';

export const saveClients = async (clients: PmsClientEntity[]): Promise<PmsClientEntity[]> => {
	const clientsRepo = getRepository(PmsClientEntity);
	return clientsRepo.save(clients);
};

export const searchClients = async (name: string): Promise<PmsClientEntity[]> => {
	const clientsRepo = getRepository(PmsClientEntity);
	return clientsRepo.query(`
		SELECT *
			FROM pms_clients_raw cl
			WHERE findByName(cl, $1) > 0.1
			ORDER BY (findByName(cl, $1)) DESC
	`, [name]);
};

export async function findClient(id: number): Promise<PmsClientEntity | undefined> {
	const clientsRepo = getRepository(PmsClientEntity);
	return clientsRepo.findOne(id);
}
