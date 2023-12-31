const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const cors = require('cors');
const http = require('http');
//const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
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

app.put('/atualizar-set', async (req, res) => {
  try {
    const novoValor = req.body;

    console.log(novoValor);
    const database = client.db('test');
    const collection = database.collection('test');

    let set = {}

    if(novoValor.setPointTemperatura === ""){
        set = {
          $set: {
            lampadaLigada: novoValor.lampadaLigada,
          }
        }
    }else{
        set = {
          $set: {
            setPointTemperatura: novoValor.setPointTemperatura,
            lampadaLigada: novoValor.lampadaLigada,
          }
        }
    }

   await collection.updateOne(
      { _id: new ObjectId("6519ff35e98731875d3c7e89") },
      set
    );

   

      res.status(200).json({ mensagem: 'Set-Point alterado com sucesso' });

  } catch (error) {
    console.error('Ocorreu um erro ao atualizar o dado:', error);
    res.status(500).json({ erro: 'Ocorreu um erro ao atualizar o dado' });
  }
});


app.put('/atualizar-dado', async (req, res) => {
  try {
    const newSensorData = req.body; // Obtenha os novos valores de umidade, luminosidade e temperatura do corpo da solicitação

    const database = client.db('test');
    const collection = database.collection('test');

    // Atualize o documento no MongoDB usando o ID fornecido
    await collection.updateOne(
      { _id: new ObjectId("6519ff35e98731875d3c7e89") }, // Filtre pelo ID do documento que você deseja atualizar
      {
        $set: {
          umidade: newSensorData.umidade,
          luminosidade: newSensorData.luminosidade,
          temperatura: newSensorData.temperatura,
          resetarEsp: newSensorData.resetarEsp,
          lampadaLigada: newSensorData.lampadaLigada
        }
      }
    );
      res.status(200).json({ mensagem: 'Set-Point alterado com sucesso' });
  } catch (error) {
    console.error('Ocorreu um erro ao atualizar os dados dos sensores:', error);
    res.status(500).json({ erro: 'Ocorreu um erro ao atualizar os dados dos sensores' });
  }
});

server.listen(port, () => {
  console.log(`Servidor Express em execução na porta ${port}`);
});