import { Validation } from "./validation.js";

export type StatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500;

export type Test = {
    name: string;
    preQuery?: string;
    url: string;
    verb: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    expectedStatusCode: StatusCode;
    validation?: Validation;
};
