import {Intakes} from "./intakes";

export interface User {
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  targetIntake?: number;
  proteinTarget?: number;
  carbohydratesTarget?: number;
  fatTarget?: number;
  intakes?: Intakes[];
}
