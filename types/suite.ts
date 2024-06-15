import { ConnectionDetails } from "./connectionDetails";
import { Test } from "./test";

export type Suite = {
    name: string;
    tests: Test[];
    connection: ConnectionDetails;
};