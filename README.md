.yaml example:

name: PostViewTests
connection: 
  connectionString: "some simple SQLite connection string for now"
tests:
  - name: test_1
    prequery: "SOME SORT OF SQL STATEMENT"
    verb: PUT
    expectedStatusCode: 200
    validation: "SOME SQL STATEMENT"
    validators:
    - fieldName: "some table column"
      expectedValue: some value
