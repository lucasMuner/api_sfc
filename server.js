const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
     origin: '*',
  },
});
const port = 3000; 
app.use(cors());
app.use(express.json());


// Conectar ao MongoDB
const uri = "mongodb+srv://roottop:NXzero321@sfc.ems7t7s.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
}

connectToMongoDB();

// Rota para buscar dados do MongoDB
app.get('/dados', async (req, res) => {
  try {
    const database = client.db('test');
    const movies = database.collection('test');
    const dados = await movies.findOne(); 
    res.json(dados);
  } catch (err) {
    console.error('Erro ao buscar dados do MongoDB:', err);
    res.status(500).json({ error: 'Erro ao buscar dados do MongoDB' });
  }
});

/*app.put('/atualizar-dado', async (req, res) => {
  try {
    const setTemperatura = req.params.setPointTemperatura; // Obtenha o valor de temperatura dos parâmetros da URL
    const novoValor = req.body.novoValor;// Substitua isso pelo novo valor que você deseja definir
    
    console.log(setTemperatura);
    console.log(novoValor);
    // Conecte-se ao banco de dados
    

    const database = client.db('test');
    const collection = database.collection('test');

    // Atualize o dado no MongoDB usando o valor da temperatura fornecido na URL
    await collection.updateOne(
      { setPointTemperatura: setTemperatura }, // Filtre pelo valor antigo da temperatura
      { $set: { setPointTemperatura: novoValor } } // Defina o novo valor da temperatura
    );

    res.status(200).json({ mensagem: 'Dado atualizado com sucesso' });
  } catch (error) {
    console.error('Ocorreu um erro ao atualizar o dado:', error);
    res.status(500).json({ erro: 'Ocorreu um erro ao atualizar o dado' });
  }
});*/

// ...
app.put('/atualizar-dado', async (req, res) => {
  try {
    const newSetPoints = req.body; // Obtenha os novos valores dos campos de set points do corpo da solicitação

    const database = client.db('test');
    const collection = database.collection('test');

    // Atualize o documento no MongoDB usando o ID fornecido
    await collection.updateOne(
      { _id: new ObjectId("6519ff35e98731875d3c7e89") }, // Filtre pelo ID do set point
      { $set: newSetPoints } // Defina os novos valores dos campos de set points
    );

    res.status(200).json({ mensagem: 'Dados atualizados com sucesso' });
  } catch (error) {
    console.error('Ocorreu um erro ao atualizar os dados:', error);
    res.status(500).json({ erro: 'Ocorreu um erro ao atualizar os dados' });
  }
});
// ...



/*app.post('/atualizar-dado/:id', async (req, res) => {
  try {
    const id = req.params.id; // ID do documento a ser atualizado
    const novosValores = req.body; // Novos valores a serem definidos
    console.log(id);

    const database = client.db('test');
    const collection = database.collection('test');

    // Atualize o documento no MongoDB usando o ID fornecido na URL
    const filter = { _id: ObjectID(id) };
    const updateDoc = {
      $set: novosValores
    };
    await collection.updateOne(filter, updateDoc);

    res.status(200).json({ mensagem: 'Documento atualizado com sucesso' });
  } catch (error) {
    console.error('Ocorreu um erro ao atualizar o documento:', error);
    res.status(500).json({ erro: 'Ocorreu um erro ao atualizar o documento' });
  }
});*/

// Iniciar a conexão com o MongoDB


io.on('connection', (socket) => {
  console.log('Cliente WebSocket conectado');

  const database = client.db('test');
  const movies = database.collection('test');
  const changeStream = movies.watch();

  changeStream.on('change', async (event) => {
    // Quando houver uma alteração, busque novamente os dados
    const allData = await movies.find().toArray();
    console.log("Evendo de mudança acionado!");
    console.log('Dados atualizados:', allData);


    // Emita todos os dados atualizados para este cliente conectado
    socket.emit('dadosAtualizados', allData);
  });

  // Ouça eventos de desconexão
  socket.on('disconnect', () => {
    console.log('Cliente WebSocket desconectado');
  });
});

server.listen(port, () => {
  console.log(`Servidor Express em execução na porta ${port}`);
});
  