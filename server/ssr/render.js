const fs = require('fs');

fs.readFile('./components/page.html', 'utf8', (err, html) => {
  if (err) throw err;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const content = doc.querySelector('body').innerHTML;

  fs.writeFile('./generated.html', `
    <html>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../styles/portal.css">
        <link rel="icon" type="image/x-icon" href="../madrasalogo.png">
        <title>Staff Portal</title>
      </head>
      <body>
      <ul class="navList">
      <li><div class="logo navItem"></div></li>
      <li><h2 class="navItem" style="margin-top: 10px" >MBNJ</h2></li>
      <li style="float: right;">
          <div class="dropdown">
              <button class="dropbtn navItem" id="userName">MS
                <i class="fa fa-caret-down"></i>
              </button>
              <div class="dropdown-content">
                  <a>Moiz Sabir</a>
                  <a href="./login.html" onclick="logout()">Logout</a>
              </div>
            </div> 
      </li>
  </ul>
  <div class="alert alert-Nonactive" id="alertBox">
      Form Submitted
  </div>
  <div class="spacer"></div>

  <div class="tab" id="tab-div">
      </div>
      <div id="tabs">
        ${content}
        </div>
      </body>
    </html>
  `, 'utf8', (err) => {
    if (err) throw err;
    console.log('The generated HTML file has been saved.');
  });
});
