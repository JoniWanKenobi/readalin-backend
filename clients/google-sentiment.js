const axios = require('axios');

class GoogleSentimentClient {
  constructor () {}

  postAnnotate (doc) {
    const apiKey = 'AIzaSyAgivu1kjx5HGRutwSjNBkBYq137lYRt9k';
    const url = 'https://language.googleapis.com/v1/documents:annotateText?key=' + apiKey;
    const body = {
      document: {
        type: 'PLAIN_TEXT',
        content: doc
      },
      encodingType: 'UTF8',
      features: {
        classifyText: true,
        extractDocumentSentiment: true,
        extractEntities: true,
        extractEntitySentiment: true,
        extractSyntax: false
      }
    };
    return axios.post(url, body)
      .then(response => response.data);
  }
}

module.exports = GoogleSentimentClient;
