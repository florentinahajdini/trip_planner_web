let userToDo = []

class UserTodo {
    constructor(listtitle) {
        this.listtitle = listtitle;
    }
}

class Model {
    static ID = 1;

    constructor() {
        this.resources = new Map();
    }

    add(resource) {
        resource.id = Model.ID++;
        this.resources.set(resource.id, resource);
    }

    get(id) {
        this.checkId(id);
        return this.resources.get(id);
    }

    getAll() {
        return Array.from(this.resources.values());
    }

    checkId(id) {
        if (typeof id !== "number") {
            throw new Error(`Given id must be an number, but is a ${typeof id}`);
        }
    }

    create(resource) {
        this.add(resource);
        return resource;    
    }

    update(id, resource) {
        this.checkId(id);

        const target = this.resources.get(id);
        if (!target) {
            throw new Error(`Resource with ${id} does not exist and cannot be updated.`)
        }

        Object.assign(target, resource);

        return target;
    }

    delete = (id) => {
        this.checkId(id);
        return this.resources.delete(id);
    }
}

const model = new Model();

model.add(new UserTodo("Shopping"));

module.exports = model;


// let userToDo = 
//     {user1: {
//         list1: {
//             taskID: "1",
//             Title: "Shopping",
//             Text: "milk"
//         },
//         list2: {
//             taskID: "2",
//             Title: "Meet Family",
//             Text: "ounty"
//         },
//         list3: {
//             taskID: "3",
//             Title: "Sightseeing",
//             Text: "eiffel tower"
//         }
//     }};