import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';

const url = 'http://localhost:3000/post/1/views';
const filepath = './src/dev.db';
const body = {
    "title": "A Good Title",
    "content": "Here is a bunch of content. We should have used lorem ipsm",
    "authorEmail": "alice@prisma.io"
}
const EXPECTED_RESULT = 1;

type result = {
	initialDbVal: number;
	resultStatusCode: number;
	errorMessage: string | undefined;
	resultDbVal: number;
};

let resultObj: result = {
	initialDbVal: 0,
	resultStatusCode: 0,
	errorMessage: undefined,
	resultDbVal: 0
};

function createDbConn(){
	const db = new sqlite3.Database(filepath);
	return db;
}

function cbf(err: any, row: any){
	console.log(1, err, row);
	if (err) {
		resultObj.errorMessage = err.message;
		return;
	}
	resultObj.initialDbVal = row.viewCount;
	return;
}

function cbf2(err: any, row: any){
	console.log(2, err, row);
	if (err) {
		resultObj.errorMessage = err.message;
		return;
	}
	resultObj.resultDbVal = row.viewCount;
	return;
}

function getValues(db: sqlite3.Database) {
	db.get('SELECT * FROM Post'
					, [], cbf);
}

function getValues2(db: sqlite3.Database) {
	db.get('SELECT * FROM Post'
					, [], cbf2);
}

let d = createDbConn();
getValues(d);
d.close();

const res = await fetch(url, {
	method: 'put',
	headers: {'Content-Type':'application/json'}
});

resultObj.resultStatusCode = res.status;

let d2 = createDbConn();
getValues2(d2);
d2.close();

function checkResult(){
	setTimeout(() => {

	if (resultObj.errorMessage) {
		console.log('ERROR');
		return;
	}
	console.log(resultObj);
	let finalResult = resultObj.resultDbVal - resultObj.initialDbVal == EXPECTED_RESULT ?
		'SUCCESS' : 'FAIL';
	console.log(finalResult);
}, 100);
}

checkResult();
