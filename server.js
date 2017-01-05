var express = require('express');
var graphqlHTTP = require('express-graphql');
var {buildSchema, printSchema, GraphQLInterfaceType, GraphQLObjectType, GraphQLString, GraphQLSchema} = require('graphql');

var car = new GraphQLObjectType({
    name: 'car',
    interfaces: machine,
    fields: () => {
        name: { type: GraphQLString }
    }
})

var machine = new GraphQLInterfaceType({
    name: 'machine',
    resolveType: (value, info) => {
        return car;
    },
    fields: () => {
        name: { type: GraphQLString }
    }
})

var queryType = new GraphQLObjectType({
    name: 'query',
    fields: {
        getCar: {
            type: car,
            resolve() {
                return { name: 'a car' };
            }
        }
    }
})

var schema = new GraphQLSchema({
    query: queryType
})

console.log(printSchema(schema))
var message = "hello world";
var job = ['MANAGER', 'PROGRAMMER', 'CODER'];

// hàm để trả về dữ liệu cho type person
var person = {
    name: () => {
        return 'Duc';
    },
    age: () => {
        return 20;
    },
    job: () => {
        return job[0];
    },
    friends: () => {
        return [person2, person3];
    }
};

var person2 = {
    name: () => {
        return 'An';
    },
    age: () => {
        return 19;
    },
    job: () => {
        return job[1];
    },
    friends: () => {
        return [person];
    }
}

var person3 = {
    name: () => {
        return 'Sang';
    },
    age: () => {
        return 21;
    },
    job: () => {
        return job[2];
    },
    friends: () => {
        return [];
    }
}

var listPerson = [person, person2, person3];

var cat = {
    name: () => {
        return 'a cat';
    },
    sayMeo: () => {
        return 'miao';
    },
    __resolveType
}

var dog = {
    name: 'a dog',
    bark: 'woof, woof'
}

var listAnimal = [cat, dog];
// tạo ra 1 cái schema, sử dụng ngôn ngữ schema
var schema = buildSchema(`
    type Query{
        person: Person,
        message: String,
        personById(id: Int!): Person,
        someAnimal(id: Int): Animal
    },
    type Person{
        name: String,
        age: Int,
        job: Job,
        friends: [Person]
    },
    enum Job{
        MANAGER,
        PROGRAMMER,
        CODER
    },
    interface Animal{
        name: String
    },
    type Cat implements Animal{
        name: String,
        sayMeo: String
    },
    type Dog implements Animal{
        name: String,
        bark: String
    }
`);




// hàm giải quyết cho mỗi câu hỏi
var root = {
    person: () => {
        return person;
    },
    message: () => {
        return message;
    },
    personById: ({id}) => {
        return listPerson[id];
    },
    someAnimal: ({id}) => {
        if (id) {
            return listAnimal[id];
        } else {
            return cat;
        }
    }
};

var app = express();

// tạo 1 graphql server trên địa chỉ http://localhost:4000/graphql
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: {
        
    }
}));

app.listen(4000, 'localhost', () => {
    console.log('server stared on port 4000')
});


