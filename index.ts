import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';
import { Suite } from './types/suite';
import { SuiteResult } from './types/SuiteResult';
import { promisify } from 'util';

const suite: Suite = {
	name: "Post Views",
	connection: {
		connectionString: "./dev.db"
	},
	tests: [
		{
			name: "Increment Post Views",
			preQuery: "UPDATE Post SET viewCount = 0 WHERE id = 1",
			verb: "PUT",
			url: "http://localhost:3000/post/1/views",
			expectedStatusCode: 200,
			validation: {
				postQuery: "SELECT * FROM Post WHERE id = 1",
				validators: [{
					fieldName: "viewCount",
					expectedValue: "1"
				}]
			}
		}
	]
}

async function run(suite: Suite) : Promise<SuiteResult[]> {
	const results: SuiteResult[] = [];
	const db = new sqlite3.Database(suite.connection.connectionString);
	const runAsync = promisify(db.run.bind(db));
	const getAsync = promisify(db.get.bind(db));

	for (const test of suite.tests) {
		const result: SuiteResult = {
			testName: test.name,
			statusCode: 0,
			success: false,
			errors: []
		};

		results.push(result);
		
		if (test.preQuery) {
			try {
				await runAsync(test.preQuery);
			} catch (err) {
				result.errors.push(`PRE QUERY ERROR: ${err.message}`);
				continue;
			}
		}
	
		try {
			const res = await fetch(test.url, {
				method: test.verb,
				headers: {'Content-Type':'application/json'}
			});

			result.statusCode = res.status;

			if (test.expectedStatusCode !== res.status) {
				result.errors.push(`Expected status code ${test.expectedStatusCode} but received ${res.status}`);
				continue;
			}
		} catch (err) {
			result.errors.push(`FETCH ERROR: ${err.message}`);
			continue;
		}

		if (test.validation) {
			let row: any;

			try {
				row = await getAsync(test.validation.postQuery);
			} catch (err) {
				result.errors.push(`POST QUERY ERROR: ${err.message}`);
				continue;
			}
			
			let validationFailed = false;

			for (const validator of test.validation.validators) {
				console.log("The row", row);
				if (row[validator.fieldName] != validator.expectedValue) {
					result.errors.push(`Expected ${validator.fieldName} to have equal ${validator.expectedValue} but received ${row[validator.fieldName]}`);
					validationFailed = true;
				}
			}

			result.success = !validationFailed;
		}
	}
	db.close();
	return results;
}

run(suite).then((results) => {
	for (const result of results) {
		console.log(result);
	}
});
