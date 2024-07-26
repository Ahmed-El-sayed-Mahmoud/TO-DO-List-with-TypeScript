 function Logger(msg:string){
return function (constructor:Function) {
  console.log(msg,constructor)
}
}

@Logger("Loggging message Error")
class Department{
    private name:string;
    private employees:string[];
    constructor(n:string)
    {
        this.name=n;
        this.employees=[];
    }
}
function add(n1: number, n2: number, callback: (str: string) => void): number {
    callback("kmosdf");
    return n1 + n2;
}

console.log(add(1, 4, (message) => {
    console.log("Callback received message:", message);
}));
function xc (obj:{age:number,name:string|number})
{

}
let people:string[]=[];
people.push("asfs");
console.log(people[0])
let person ={age:30,name:"ahmed"}
person.age;
person.age=5;
console.log(person.age)
enum Role {
"ADMIN","USER"
}
console.log(Role.ADMIN);



/* function add(n1: number, n2: number): number;
function add(n1: string, n2: string): string;

function add(n1: any, n2: any): any {
    if (typeof n1 === "string" && typeof n2 === "string") {
        return n1.toString() + n2.toString();
    } else if (typeof n1 === "number" && typeof n2 === "number") {
        return n1 + n2;
    } 
} */
const promise:Promise<string>=new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve("hiiiiiiii from promise")
    }, 2000);
})

function merge<T extends number, Q extends number>(num1: T, num2: Q){
    return num1+num2;
}

const uy=merge(5,4);

function ExtractAndConvert<T extends object,Q extends keyof T>(x:T,y:Q)
{
    return x[y];
}


