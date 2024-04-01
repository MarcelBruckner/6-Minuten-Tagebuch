/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Wochenplanung } from './Wochenplanung';
import type { Wochenreflexion } from './Wochenreflexion';
export type Weekly = {
    woche: string;
    wochenreflexion?: Wochenreflexion;
    wochenplanung?: Wochenplanung;
    notizen?: string;
};

