const express =  require('express') //The aplication imports Node's built in web server module
const app = express()
app.use(express.json())


let data = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


app.get('/', 
  (request, response)=>{
    console.log("get index");
    response.send('<h1>Phonebook Backend</h1>')
  }
)

app.get('/api/persons', (request, response)=>{
  console.log("Get all persons");
  response.send(data)
})


const PORT = 3001
app.listen(PORT,
  () => {
    console.log(`Server running on port ${PORT}`);
  }  
)
