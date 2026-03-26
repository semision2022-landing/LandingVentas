const url = 'https://emision.co/wp-json/wc/v3/products';
const key = 'ck_3cc0a81d6843f187ff16fb239334b40db033f779';
const secret = 'cs_e5bc5f7b874c4ce67067d037011d1350f589ec03';
const auth = Buffer.from(key + ':' + secret).toString('base64');

fetch(url, {
  headers: {
    'Authorization': 'Basic ' + auth
  }
}).then(res => res.json())
  .then(data => {
    if (data.code) {
      console.error(data);
    } else {
      console.log('Success! Found ' + data.length + ' products.');
      console.log(data.map(p => ({ id: p.id, name: p.name, price: p.price })));
    }
  }).catch(err => console.error(err));
