/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Daily } from '../models/Daily';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DailyService {
    /**
     * Get Daily
     * @returns Daily Successful Response
     * @throws ApiError
     */
    public static dailyGetDaily({
        datum,
    }: {
        datum: string,
    }): CancelablePromise<Daily> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/daily/{datum}',
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
     * Get Dailies In Date Range
     * @returns Daily Successful Response
     * @throws ApiError
     */
    public static dailyGetDailiesInDateRange({
        startDate,
        endDate,
    }: {
        startDate?: (string | null),
        endDate?: (string | null),
    }): CancelablePromise<Array<Daily>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/daily/range/',
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
     * Get Last Dailies
     * @returns Daily Successful Response
     * @throws ApiError
     */
    public static dailyGetLastDailies({
        number = 5,
        endDate = '2024-02-28',
    }: {
        number?: number,
        endDate?: string,
    }): CancelablePromise<Array<Daily>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/daily/last/',
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
     * Post Daily
     * @returns any Successful Response
     * @throws ApiError
     */
    public static dailyPostDaily({
        requestBody,
    }: {
        requestBody: (Daily | string),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/daily/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Daily
     * @returns any Successful Response
     * @throws ApiError
     */
    public static dailyDeleteDaily({
        date,
    }: {
        date: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/daily/{date}',
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
