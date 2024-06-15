import { Validator } from "./validator";

export type Validation = {
    postQuery: string;
    validators: Validator[];
}