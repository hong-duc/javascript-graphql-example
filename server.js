var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');



var MessageType = new graphql.GraphQLObjectType({
    name: 'Message',
    description: 'a message',
    fields: {
        name: {
            type: graphql.GraphQLString
        },
        quote: {
            type: graphql.GraphQLString
        }
    }
});

var PersonType = new graphql.GraphQLObjectType({
    name: 'Person',
    description: 'a person',
    fields: () => {
        return {
            name: {
                type: graphql.GraphQLString
            },
            age: {
                type: graphql.GraphQLInt
            },
            job: {
                type: EnumJob
            },
            friends: {
                type: new graphql.GraphQLList(PersonType)
            }
        }
    }
})

var EnumJob = new graphql.GraphQLEnumType({
    name: 'Job',
    description: 'jobs of a person',
    values: {
        MANAGER: { value: 0 },
        PROGRAMMING: { value: 1 },
        CODER: { value: 2 }
    }
});

var InterFaceAnimal = new graphql.GraphQLInterfaceType({
    name: 'Animal',
    description: 'interface animal',
    fields: {
        name: {
            type: graphql.GraphQLString
        }
    },
    resolveType: (value, info) => {
        if (value.type === 'Cat') {
            return CatType;
        }

        if (value.type === 'Dog') {
            return DogType;
        }
    }
});

var CatType = new graphql.GraphQLObjectType({
    name: 'Cat',
    fields: {
        name: {
            type: graphql.GraphQLString
        },
        sayMeo: {
            type: graphql.GraphQLString
        }
    },
    interfaces: [InterFaceAnimal]
})

var DogType = new graphql.GraphQLObjectType({
    name: 'Dog',
    fields: {
        name: {
            type: graphql.GraphQLString
        },
        bark: {
            type: graphql.GraphQLString
        }
    },
    interfaces: [InterFaceAnimal]
})


var QueryType = new graphql.GraphQLObjectType({
    name: 'query',
    fields: {
        message: {
            type: MessageType,
            resolve: () => {
                return message;
            }
        },
        person: {
            type: PersonType,
            resolve: () => {
                return person;
            }
        },
        getAnimal: {
            type: InterFaceAnimal,
            resolve: (root, {id}) => {
                return listAnimal[id];
            },
            args: {
                id: {
                    type: graphql.GraphQLInt
                }
            }
        }
    }
})

var message = {
    name: 'message of the day',
    quote: 'hello world'
};
var job = {
    MANAGER: { value: 0 },
    PROGRAMMING: { value: 1 },
    CODER: { value: 2 }
};

// hàm để trả về dữ liệu cho type person
var person = {
    name: () => {
        return 'Duc';
    },
    age: () => {
        return 20;
    },
    job: () => {
        return 0;
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
    type: 'Cat',
    name: () => {
        return 'a cat';
    },
    sayMeo: () => {
        return 'miao';
    }
}

var dog = {
    type: 'Dog',
    name: 'a dog',
    bark: 'woof, woof'
}

var listAnimal = [cat, dog];
// tạo ra 1 cái schema, sử dụng ngôn ngữ schema
var schema = graphql.buildSchema(`
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





var app = express();

// tạo 1 graphql server trên địa chỉ http://localhost:4000/graphql
app.use('/graphql', graphqlHTTP({
    schema: new graphql.GraphQLSchema({
        query: QueryType,
        types: [PersonType, InterFaceAnimal, CatType, DogType]
    }),
    graphiql: true
}));

app.listen(4000, 'localhost', () => {
    console.log('server stared on port 4000')
});


