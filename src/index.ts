import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';

const url = 'http://localhost:3000/post/1/views';
const filepath = './src/dev.db';
const body = {
    "title": "A Good Title",
    "content": "Here is a bunch of content. We should have used lorem ipsm",
    "authorEmail": "alice@prisma.io"
}

function createDbConn(){
	const db = new sqlite3.Database(filepath);
	return db;
}

function cbf(err: any, row: any){
	if (err) {
		console.error('THERE WAS A PROBLEM');
		return;
	}
	console.log(row.viewCount);
	return;
}

function getValues(db: sqlite3.Database) {
	db.get('SELECT * FROM Post'
					, [], cbf);
}

let d = createDbConn();
getValues(d);
d.close();

const res = await fetch(url, {
	method: 'put',
	headers: {'Content-Type':'application/json'}
});

console.log(res.status);

let d2 = createDbConn();
getValues(d2);
d2.close();
