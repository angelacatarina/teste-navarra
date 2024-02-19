const express = require('express');
const app = express();
const port = 5000;
const axios = require('axios');
const fs = require('fs');

const arrayJSON = JSON.parse(fs.readFileSync('my_json.json', 'utf-8'));

// Middleware para analisar JSON
app.use(express.json());

// Ponto 1
app.get('/', (req, res) => {
  res.status(200).send('OK!');
});

// Inicio o servidor 
app.listen(port, () => {
    console.log(`Servidor está ativo em http://localhost:${port}`);
  });

// Ponto 2
app.post('/process_queue', (req, res) => {
  try {
    const data = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid input. Expecting a JSON array.' });
    }

    
    //  Número total de elementos no array
    const totalElements = data.length;

    return res.json({ totalElements });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Ponto 3
app.post('/process_queue_sorted', async (req, res) => {
  try {
    const data = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid input. Expecting a JSON array.' });
    }

    // Ordenar
    const sortedData = data.sort((a, b) => {
    
      const qtyDiff = b.quantidade - a.quantidade;

      // Melhor condição de pagamento
      const paymentOrder = { DIN: 1, 30: 2, R60: 3, 90: 4, 120: 5 };
      const paymentDiff = paymentOrder[a.condicao_pagamento] - paymentOrder[b.condicao_pagamento];

      // Prioridade designação "PORT" 
      const portDiff = (a.designacao === 'PORT' ? 1 : 0) - (b.designacao === 'PORT' ? 1 : 0);

     
      const weightedDiff = 0.5 * qtyDiff + 0.3 * paymentDiff + 0.2 * portDiff;

      return weightedDiff;
    });

    // Adicionar "previsao_consumo" 
    sortedData.forEach((element) => {
      element.previsao_consumo = element.quantidade * 5;
    });

    return res.json({ sortedData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Teste

/* 
axios.post('http://localhost:5000/process_queue', arrayJSON)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error.response.data);
  });
  */


/*
axios.post('http://localhost:5000/process_queue_sorted', arrayJSON)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error.response.data);
  });
*/

// Ponto 4

app.get('/consume_api', async (req, res) => {
    try {
    
      const response = await axios.get('https://pastebin.pl/view/raw/8fced5f8');
  
     
      const apiData = response.data;
  
    
      return res.json({ apiData });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: 'Erro!' });
    }
  });

