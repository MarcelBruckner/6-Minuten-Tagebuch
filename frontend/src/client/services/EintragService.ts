/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EintragModel } from '../models/EintragModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EintragService {
    /**
     * Geteintrag
     * @returns EintragModel Successful Response
     * @throws ApiError
     */
    public static eintragGetEintrag({
        datum,
    }: {
        datum: string,
    }): CancelablePromise<EintragModel> {
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
     * Posteintrag
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static eintragPostEintrag({
        requestBody,
    }: {
        requestBody: EintragModel,
    }): CancelablePromise<boolean> {
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
}
