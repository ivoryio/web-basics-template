import { Salutation } from '../domain/Salutation';

export interface ISalutationRepository {
  retrieveAll(): Promise<Salutation[]>
  persist(salutation: Salutation): Promise<void>
}
