export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
}

export type PublicPatient = Omit<Patient, "ssn">;
export type NewPatient = Omit<Patient, "id">; // When adding a new patient, no `id` yet.
