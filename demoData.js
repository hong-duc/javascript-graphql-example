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

module.exports = {
    message,
    job,
    person,
    person2,
    person3,
    listPerson,
    cat,
    dog,
    listAnimal
}