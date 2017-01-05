# javascript-graphql-example
một ví dụ về Graphql sử dụng trong javascript

## Các yêu cầu để có thể chạy được
1. phải có cài git https://git-scm.com/downloads
2. phải có nodejs https://nodejs.org/en/download/

## Schema của demo
```
schema {
  query: query
  mutation: mutation
}

# interface animal
interface Animal {
  name: String
}

type Cat implements Animal {
  name: String
  sayMeo: String
}

type Dog implements Animal {
  name: String
  bark: String
}

# jobs of a person
enum Job {
  MANAGER
  PROGRAMMING
  CODER
}

# a message
type Message {
  name: String
  quote: String
}

input MessageInput {
  name: String
  quote: String
}

type mutation {
  updateMessage(input: MessageInput!): Message
}

# a person
type Person {
  name: String
  age: Int
  job: Job
  friends: [Person]
}

union Pet = Cat | Dog

type query {
  message: Message
  person: Person

  # demo interfaceType
  getAnimal(id: Int): Animal

  # demo uniontype
  getPet(id: Int): Pet
}

```

## Cách sử dụng
chạy các lệnh sau đây để lấy nó về thử

1. `git clone https://github.com/hong-duc/javascript-graphql-example.git`
2. `cd javascript-graphql-example`
3. `npm install`
4. `node server.js` 
5. vào trình duyệt gõ địa chỉ http://localhost:4000/graphql