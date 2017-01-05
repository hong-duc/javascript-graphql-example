var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');
var {message,
    cat,
    dog,
    job,
    listAnimal,
    listPerson,
    person,
    person2,
    person3} = require('./demoData');


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

var PetType = new graphql.GraphQLUnionType({
    name: 'Pet',
    types: [CatType, DogType],
    resolveType(value) {
        if (value.type === 'Cat') {
            return CatType;
        }
        if (value.type === 'Dog') {
            return DogType;
        }
    }
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
            },
            description: 'demo interfaceType'
        },
        getPet: {
            type: PetType,
            description: 'demo uniontype',
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

var MessageInputType = new graphql.GraphQLInputObjectType({
    name: 'MessageInput',
    fields: {
        name: {
            type: graphql.GraphQLString
        },
        quote: {
            type: graphql.GraphQLString
        }
    }
})

var MutationType = new graphql.GraphQLObjectType({
    name: 'mutation',
    fields: {
        updateMessage: {
            type: MessageType,
            args: {
                input: {
                    type: new graphql.GraphQLNonNull(MessageInputType)
                }
            },
            resolve(root, {input}) {
                message.name = input.name;
                message.quote = input.quote;
                return message;
            }
        }
    }

})


var app = express();

// tạo 1 graphql server trên địa chỉ http://localhost:4000/graphql
app.use('/graphql', graphqlHTTP({
    schema: new graphql.GraphQLSchema({
        query: QueryType,
        types: [PersonType, InterFaceAnimal, CatType, DogType, MessageInputType],
        mutation: MutationType
    }),
    graphiql: true
}));

app.listen(4000, 'localhost', () => {
    console.log('server stared on port 4000')
});


