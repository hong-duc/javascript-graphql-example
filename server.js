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


/**
 type Message {
  name: String
  quote: String
}
 */
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


/**
type Person {
  name: String
  age: Int
  job: Job
  friends: [Person]
}
 */
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

/**
enum Job {
  MANAGER
  PROGRAMMING
  CODER
}
 */
var EnumJob = new graphql.GraphQLEnumType({
    name: 'Job',
    description: 'jobs of a person',
    values: {
        MANAGER: { value: 0 },
        PROGRAMMING: { value: 1 },
        CODER: { value: 2 }
    }
});

/**
interface Animal {
  name: String
}
 */
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

/**
 type Cat implements Animal {
  name: String
  sayMeo: String
}
 */
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

/**
type Dog implements Animal {
  name: String
  bark: String
}
 */
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

/**
union Pet = Cat | Dog
 */
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

/*
type query {
  message: Message
  person: Person

  # demo interfaceType
  getAnimal(id: Int): Animal

  # demo uniontype
  getPet(id: Int): Pet
}
 */
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

/*
input MessageInput {
  name: String
  quote: String
}
 */
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

/*
type mutation {
  updateMessage(input: MessageInput!): Message
}
 */
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



var schema = new graphql.GraphQLSchema({
    query: QueryType,
    types: [PersonType, InterFaceAnimal, CatType, DogType, MessageInputType],
    mutation: MutationType
});


var app = express();

// tạo 1 graphql server trên địa chỉ http://localhost:4000/graphql
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(4000, 'localhost', () => {
    console.log('server stared on port 4000')
});


