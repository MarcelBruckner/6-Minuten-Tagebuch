/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Weekly_Input } from '../models/Weekly_Input';
import type { Weekly_Output } from '../models/Weekly_Output';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WeeklyService {
    /**
     * Get Daily
     * @returns Weekly_Output Successful Response
     * @throws ApiError
     */
    public static weeklyGetDaily({
        datum,
    }: {
        datum: string,
    }): CancelablePromise<Weekly_Output> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/weekly/{datum}',
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
     * Get Weeklies In Date Range
     * @returns Weekly_Output Successful Response
     * @throws ApiError
     */
    public static weeklyGetWeekliesInDateRange({
        startDate,
        endDate,
    }: {
        startDate?: (string | null),
        endDate?: (string | null),
    }): CancelablePromise<Array<Weekly_Output>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/weekly/range/',
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
     * Get Last Weeklies
     * @returns Weekly_Output Successful Response
     * @throws ApiError
     */
    public static weeklyGetLastWeeklies({
        number = 5,
        endDate = '2024-02-27',
    }: {
        number?: number,
        endDate?: string,
    }): CancelablePromise<Array<Weekly_Output>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/weekly/last/',
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
     * Post Weekly
     * @returns any Successful Response
     * @throws ApiError
     */
    public static weeklyPostWeekly({
        requestBody,
    }: {
        requestBody: (Weekly_Input | string),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/weekly/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Weekly
     * @returns any Successful Response
     * @throws ApiError
     */
    public static weeklyDeleteWeekly({
        date,
    }: {
        date: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/weekly/{date}',
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
