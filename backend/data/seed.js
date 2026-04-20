const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });
const Quest = require('../models/Quest');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codex-of-destiny';

const pythonQuests = [
  { zone: "python", title: "The Variable Viper", story: "Create a variable 'x' and assign it 5.", difficulty: 1, starterCode: "# Write your code here\n", testCases: [{ input: "x", expected: "5" }], hint: "x = 5", xpReward: 10, goldReward: 5, itemReward: "Health Potion" },
  { zone: "python", title: "Print the Spell", story: "Print 'Hello World'.", difficulty: 1, starterCode: "", testCases: [{ input: "", expected: "Hello World" }], hint: "print('Hello World')", xpReward: 10, goldReward: 5 },
  { zone: "python", title: "Adder's Bite", story: "Create variable 'y' = 10 and 'z' = x + y.", difficulty: 1, starterCode: "x = 5\n", testCases: [{ input: "z", expected: "15" }], hint: "y = 10\nz = x + y", xpReward: 15, goldReward: 5 },
  { zone: "python", title: "Stringing the Bow", story: "Create a string variable 'name' with 'Hero'.", difficulty: 1, starterCode: "", testCases: [{ input: "name", expected: "Hero" }], hint: "name = 'Hero'", xpReward: 10, goldReward: 5 },
  { zone: "python", title: "The Crossroads", story: "Write an if statement: if x is 5, set y to 1.", difficulty: 2, starterCode: "x = 5\ny = 0\n", testCases: [{ input: "y", expected: "1" }], hint: "if x == 5:\n  y = 1", xpReward: 20, goldReward: 10 },
  { zone: "python", title: "Loop of Eternity", story: "Create a for loop that adds 1 to y, 5 times.", difficulty: 2, starterCode: "y = 0\n", testCases: [{ input: "y", expected: "5" }], hint: "for i in range(5):\n  y += 1", xpReward: 20, goldReward: 10 },
  { zone: "python", title: "The Patient Wait", story: "Create a while loop that adds 1 to y until y is 5.", difficulty: 2, starterCode: "y = 0\n", testCases: [{ input: "y", expected: "5" }], hint: "while y < 5:\n  y += 1", xpReward: 20, goldReward: 10 },
  { zone: "python", title: "Function of Power", story: "Define a function 'add(a, b)' returning a+b.", difficulty: 3, starterCode: "", testCases: [{ input: "add(2,3)", expected: "5" }], hint: "def add(a, b):\n  return a + b", xpReward: 30, goldReward: 15, itemReward: "Mana Potion" },
  { zone: "python", title: "List of Ingredients", story: "Create a list 'lst' with 1, 2, 3.", difficulty: 2, starterCode: "", testCases: [{ input: "lst", expected: "[1, 2, 3]" }], hint: "lst = [1, 2, 3]", xpReward: 20, goldReward: 10 },
  { zone: "python", title: "Class of the Mage", story: "Create a class 'Dog' with a 'bark' method returning 'woof'.", difficulty: 3, starterCode: "", testCases: [{ input: "Dog().bark()", expected: "woof" }], hint: "class Dog:\n  def bark(self):\n    return 'woof'", xpReward: 40, goldReward: 20, itemReward: "Spellbook" }
];

const jsQuests = [
  { zone: "javascript", title: "The Electric Spark", story: "Declare a let variable 'x' and assign 10.", difficulty: 1, starterCode: "", testCases: [{ input: "x", expected: 10 }], hint: "let x = 10;", xpReward: 10, goldReward: 5 },
  { zone: "javascript", title: "Console Whisper", story: "Assign 'Hello' to variable 'msg'.", difficulty: 1, starterCode: "", testCases: [{ input: "msg", expected: "Hello" }], hint: "let msg = 'Hello';", xpReward: 10, goldReward: 5 },
  { zone: "javascript", title: "Arithmetic Zap", story: "Create 'sum' equal to 5 + 5.", difficulty: 1, starterCode: "", testCases: [{ input: "sum", expected: 10 }], hint: "let sum = 5 + 5;", xpReward: 10, goldReward: 5 },
  { zone: "javascript", title: "String Constructor", story: "Create 'greeting' = 'Hi ' + 'there'.", difficulty: 1, starterCode: "", testCases: [{ input: "greeting", expected: "Hi there" }], hint: "let greeting = 'Hi ' + 'there';", xpReward: 10, goldReward: 5 },
  { zone: "javascript", title: "Gate of Truth", story: "If x is 10, set y to 2. Starter: let x=10; let y=0;", difficulty: 2, starterCode: "let x = 10;\nlet y = 0;\n", testCases: [{ input: "y", expected: 2 }], hint: "if (x === 10) y = 2;", xpReward: 20, goldReward: 10 },
  { zone: "javascript", title: "The Circuit Loop", story: "For loop from 0 to 4, adding i to 'total'. Starter: let total=0;", difficulty: 2, starterCode: "let total = 0;\n", testCases: [{ input: "total", expected: 10 }], hint: "for(let i=0; i<5; i++) total += i;", xpReward: 20, goldReward: 10 },
  { zone: "javascript", title: "Function Generator", story: "Function 'mul(a,b)' returns a*b.", difficulty: 3, starterCode: "", testCases: [{ input: "mul(3,4)", expected: 12 }], hint: "function mul(a,b) { return a*b; }", xpReward: 30, goldReward: 15 },
  { zone: "javascript", title: "Array of Energy", story: "Array 'arr' with 1, 2, 3.", difficulty: 2, starterCode: "", testCases: [{ input: "arr[1]", expected: 2 }], hint: "let arr = [1, 2, 3];", xpReward: 20, goldReward: 10 },
  { zone: "javascript", title: "Object Artifact", story: "Object 'obj' with key 'a' = 1.", difficulty: 2, starterCode: "", testCases: [{ input: "obj.a", expected: 1 }], hint: "let obj = {a: 1};", xpReward: 20, goldReward: 10 },
  { zone: "javascript", title: "DOM Manipulation", story: "Create a function 'getEl()' returning 'div'.", difficulty: 3, starterCode: "", testCases: [{ input: "getEl()", expected: "div" }], hint: "function getEl() { return 'div'; }", xpReward: 40, goldReward: 20, itemReward: "Thunder Staff" }
];

const cppQuests = [
  { zone: "cpp", title: "Iron Greetings", story: "Write 'Hello' string.", difficulty: 1, starterCode: "string msg = ", testCases: [{ input: "msg", expected: "Hello" }], hint: "string msg = \"Hello\";", xpReward: 10, goldReward: 5 },
  { zone: "cpp", title: "Iron Variables", story: "int x = 5;", difficulty: 1, starterCode: "", testCases: [{ input: "x", expected: "5" }], hint: "int x = 5;", xpReward: 10, goldReward: 5 },
  { zone: "cpp", title: "Cin and Cout", story: "cout << 10;", difficulty: 1, starterCode: "int y = ", testCases: [{ input: "y", expected: "10" }], hint: "int y = 10;", xpReward: 10, goldReward: 5 },
  { zone: "cpp", title: "Iron Arithmetic", story: "int z = 5 + 5;", difficulty: 1, starterCode: "", testCases: [{ input: "z", expected: "10" }], hint: "int z = 10;", xpReward: 10, goldReward: 5 },
  { zone: "cpp", title: "The Iron Gate", story: "if (x==5) y=1;", difficulty: 2, starterCode: "int x=5; int y=0;\n", testCases: [{ input: "y", expected: "1" }], hint: "if(x==5) y=1;", xpReward: 20, goldReward: 10 },
  { zone: "cpp", title: "Forging Loop", story: "for(int i=0;i<5;i++) y++;", difficulty: 2, starterCode: "int y=0;\n", testCases: [{ input: "y", expected: "5" }], hint: "for(int i=0;i<5;i++) y++;", xpReward: 20, goldReward: 10 },
  { zone: "cpp", title: "While Forging", story: "while(y<5) y++;", difficulty: 2, starterCode: "int y=0;\n", testCases: [{ input: "y", expected: "5" }], hint: "while(y<5) y++;", xpReward: 20, goldReward: 10 },
  { zone: "cpp", title: "Iron Function", story: "int sub(int a, int b) { return a-b; }", difficulty: 3, starterCode: "", testCases: [{ input: "sub(5,2)", expected: "3" }], hint: "int sub(int a, int b) { return a-b; }", xpReward: 30, goldReward: 15 },
  { zone: "cpp", title: "Iron Arrays", story: "int arr[3] = {1,2,3};", difficulty: 2, starterCode: "", testCases: [{ input: "arr[0]", expected: "1" }], hint: "int arr[3] = {1,2,3};", xpReward: 20, goldReward: 10 },
  { zone: "cpp", title: "Pointers of Destiny", story: "int* p = &x;", difficulty: 3, starterCode: "int x=5;\n", testCases: [{ input: "*p", expected: "5" }], hint: "int* p = &x;", xpReward: 40, goldReward: 20, itemReward: "Master Sword" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB for seeding...');
    
    await Quest.deleteMany({});
    console.log('Cleared existing quests');
    
    await Quest.insertMany([...pythonQuests, ...jsQuests, ...cppQuests]);
    console.log('Seeded 30 quests successfully!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
};

seedDB();
