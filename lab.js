const http = require('http');
const fs = require('fs');
const fastXmlParser = require('fast-xml-parser');

const server = http.createServer((req, res) => {
  // Зчитуємо XML-дані з файлу
  const xmlData = fs.readFileSync('data.xml', 'utf-8');
  
  const parser = new fastXmlParser.XMLParser();

  // Розбираємо XML-дані
  const parsedData = parser.parse(xmlData);

  if (parsedData && parsedData.indicators && parsedData.indicators.banksincexp) {
    // Фільтруємо та витягуємо конкретні категорії, "Доходи, усього" та "Витрати, усього"
    const selectedCategories = parsedData.indicators.banksincexp.filter(item =>
      item.txt === "Доходи, усього" || item.txt === "Витрати, усього"
    );

    const builder = new fastXmlParser.XMLBuilder({});

    const customXmlObj = {
      data: {
        indicators: selectedCategories.map(item => ({
          txt: item.txt,
          value: item.value
        }))
      }
    };

    const customXml = builder.build(customXmlObj);

    // Встановлюємо заголовки відповіді
    res.setHeader('Content-Type', 'application/xml');

    // Відправляємо власний XML у відповідь
    res.end(customXml);
  } else {
    res.statusCode = 500;
    res.end('Структура XML не відповідає очікуванням!');
  }
});

const port = 8000;
server.listen(port, () => {
  console.log(`Сервер працює на порту ${port}`);
});