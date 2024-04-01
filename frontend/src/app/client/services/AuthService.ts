/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_auth_login_for_access_token } from '../models/Body_auth_login_for_access_token';
import type { Token } from '../models/Token';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Login For Access Token
     * @returns Token Successful Response
     * @throws ApiError
     */
    public static authLoginForAccessToken({
        formData,
    }: {
        formData: Body_auth_login_for_access_token,
    }): CancelablePromise<Token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/token',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
}
