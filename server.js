var express = require('express');
var graphqlHTTP = require('express-graphql');
var {buildSchema} = require('graphql');




// tạo ra 1 cái schema, sử dụng ngôn ngữ schema
var schema = buildSchema(`
    type Query{
        person: Person
    },
    type Person{
        name: String,
        age: Int
    }
`);

//ko phai mun kiem gi cung dc dau, phai tao moi co

var person = {
    name: () => {
        return 'Duc';
    },
    age: () => {
        return 20;
    }
};

// hàm giải quyết cho mỗi câu hỏi
var root = {
    person: () => {
        return person;
    }
};

var app = express();
app.use('/graphql',graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000,'localhost',() => {
    console.log('server stared')
});

