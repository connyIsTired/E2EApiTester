import { StatusCode } from "./test";

export type SuiteResult = {
    testName: string;
    statusCode: number;
    success: boolean;
    errors: string[];
};
