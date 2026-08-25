import { resolve } from "path";
import { Interface } from "readline";

const a : number = 1;
const b : string = 'abanoub';
const array : number[] = [1, 2, 3, 4, 5];
const isBoolean : boolean = true;
const alot : (string | number|  boolean)[] = [1, 'abanoub', true];
const w = ()=>{
    console.log('hello');
}
// w();
// const x : (x: string, y: number ) => number = (x, y ) =>{
//     return x + y;
// }
// console.log(a, b, array, isBoolean, alot, x('hello', 1));
// interface Person = {
//     name: string;
//     age: number;

// }
// let x : Person ;
// x = {
//     name: 'abanoub',
//     age: 29,
// }
// console.log(x);

enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    GUEST = 'GUEST',
}
let y : Role = Role.ADMIN;
console.log(y);

function getRole(role: Role): string {
    return role;
}
console.log(getRole(Role.ADMIN));

function getRole2(role: Role): string {
    return role;
}

interface Person {
    name: string;
    age: number;
    email: string;
}

type PersonWithoutEmail = Omit<Person, 'email'>;
const examplePerson: PersonWithoutEmail = { name: 'Abanoub', age: 29 };
console.log(examplePerson);

new Promoise((resolve, reject)=>{

})