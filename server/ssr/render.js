const fs = require('fs');

fs.readFile('./components/page.html', 'utf8', (err, html) => {
  if (err) throw err;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const content = doc.querySelector('body').innerHTML;

  fs.writeFile('./generated.html', `
    <html>
      <head>
        <title>Generated Page</title>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `, 'utf8', (err) => {
    if (err) throw err;
    console.log('The generated HTML file has been saved.');
  });
});
