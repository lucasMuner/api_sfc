/*const socket = io('https://api-sfc.vercel.app'); 

socket.on('connect', () => {
  console.log('Conectado ao servidor WebSocket');
});

socket.on('dadosAtualizados', (dados) => {
  console.log('Dados atualizados recebidos:', dados[0]); // Acesse o primeiro item do array

  // Atualize a interface do usuário com os dados recebidos
  document.querySelector("#umidade").textContent = `Umidade: ${dados[0].umidade}`;
  document.querySelector("#temperatura").textContent = `Temperatura: ${dados[0].temperatura}`;
  document.querySelector("#luminosidade").textContent = `Luminosidade: ${dados[0].luminosidade}`;
  document.querySelector("#setPointTemp").textContent = `Set-Point de Temperatura: ${dados[0].setPointTemperatura}`;
  document.querySelector("#setPointUmi").textContent = `Set-Point de Umidade: ${dados[0].SetPointUmidade}`;
  document.querySelector("#setPointLumi").textContent = `Set-Point de Luminosidade: ${dados[0].setPointLuminosidade}`;
});*/

function fetchDataDataBase(){
  fetch('https://api-sfc.vercel.app/dados')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Os dados da rota /dados serão exibidos no console
    document.querySelector("#umidade").textContent = `Umidade: ${data.umidade}`;
    document.querySelector("#temperatura").textContent = `Temperatura: ${data.temperatura}`;
    document.querySelector("#luminosidade").textContent = `Luminosidade: ${data.luminosidade}`;
    document.querySelector("#setPointTemp").textContent = `SP Temperatura: ${data.setPointTemperatura}`;
    
    const form = document.querySelector("form");

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Obtenha os novos valores dos campos de input
    const setPointTempInput = document.getElementById("setPointTempInput");

    const newSetPoints = {
      setPointTemperatura: setPointTempInput.value,
      // Adicione outros set points conforme necessário
    };

    // Faça a solicitação fetch para atualizar o banco de dados com os novos valores
    fetch(`https://api-sfc.vercel.app/atualizar-set`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSetPoints),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Falha na atualização');
      }
    })
    .then(data => {
      console.log(data.mensagem); // Deve imprimir "Dado atualizado com sucesso" se a atualização for bem-sucedida
      setPointTempInput.value = '';
    })
    .catch(error => {
      console.error(error); // Trate erros aqui, se necessário
    });
  });


    

      
    
  })
  .catch(error => {
    console.error('Erro na requisição:', error);
  });

}

fetchDataDataBase();

setInterval(fetchDataDataBase, 10000);