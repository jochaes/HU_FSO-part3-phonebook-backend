//command to run this script 
// node mongo.js <password>  => Returns Phonebook 
// node mongo.js <password> <name> <phone number> => Insert a new person to phonebook

const mongoose = require('mongoose')

//Check if password is present 
let args = process.argv


const personSchema = new mongoose.Schema({
  name:String,
  number:String,
})

const Person = mongoose.model('Person', personSchema)

const connect = () =>{
  const password = args[2]
  const url = `mongodb+srv://fullstack:${password}@fsopart3.xpgsfdn.mongodb.net/phonebookapplication?retryWrites=true&w=majority`
  mongoose.set('strictQuery', false)
  mongoose.connect(url)
}


const savePerson = (name, number) => {
  connect()

  const newPerson =  new Person({
    name: name,
    number:number,
  })

  newPerson.save().then(
    result => {
      console.log(`added ${name} ${number} to phonebook`)
      mongoose.connection.close()
    }
  )
}

const printPhonebook = () =>{
  connect()
  console.log("phonebook:");
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    })
    mongoose.connection.close()
  }
  )

}


if(args.length < 3){
  console.log("Give password as argument");
  process.exit(1)
}else if( args.length === 3) {
  //console.log("Showing phonebook");
  printPhonebook()
}else if(args.length === 5){
  //console.log("New entry to phonebook");
  savePerson(args[3], args[4])
}else{
  console.log("Incorrect Arguments, try again.");
  process.exit(1)
}