/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Eintrag } from '../models/Eintrag';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EintragService {
    /**
     * Get Eintrag
     * @returns Eintrag Successful Response
     * @throws ApiError
     */
    public static eintragGetEintrag({
        datum,
    }: {
        datum: string,
    }): CancelablePromise<Eintrag> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/eintrag/{datum}',
            path: {
                'datum': datum,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Eintraege In Date Range
     * @returns Eintrag Successful Response
     * @throws ApiError
     */
    public static eintragGetEintraegeInDateRange({
        startDate,
        endDate,
    }: {
        startDate?: (string | null),
        endDate?: (string | null),
    }): CancelablePromise<Array<Eintrag>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/eintrag/range/',
            query: {
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Last Eintraege
     * @returns Eintrag Successful Response
     * @throws ApiError
     */
    public static eintragGetLastEintraege({
        number = 5,
        endDate = '2024-02-26',
    }: {
        number?: number,
        endDate?: string,
    }): CancelablePromise<Array<Eintrag>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/eintrag/last/',
            query: {
                'number': number,
                'end_date': endDate,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Post Eintrag
     * @returns any Successful Response
     * @throws ApiError
     */
    public static eintragPostEintrag({
        requestBody,
    }: {
        requestBody: (Eintrag | string),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/eintrag/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Eintrag
     * @returns any Successful Response
     * @throws ApiError
     */
    public static eintragDeleteEintrag({
        date,
    }: {
        date: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/eintrag/{date}',
            path: {
                'date': date,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
}
