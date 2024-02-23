/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { UserIn } from '../models/UserIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Get Current Active User
     * @returns User Successful Response
     * @throws ApiError
     */
    public static userGetCurrentActiveUser(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/',
            errors: {
                404: `Not found`,
            },
        });
    }
    /**
     * Create User
     * @returns any Successful Response
     * @throws ApiError
     */
    public static userCreateUser({
        requestBody,
    }: {
        requestBody: UserIn,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * @returns any Successful Response
     * @throws ApiError
     */
    public static userDeleteUser(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/',
            errors: {
                404: `Not found`,
            },
        });
    }
}
