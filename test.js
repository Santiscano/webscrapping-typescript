const puppeteer = require('puppeteer');
const fs = require('fs');

async function run () {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox'],
    defaultViewport: {width: 1920, height: 1080}
  });
  const page = await browser.newPage();
  await page.goto('https://www.google.com/search?q=bitcoin');
  console.log('abrimos google');
  await sleep(300);

  // await page.screenshot({path: 'screenshot.png'}); // captura de pantalla
  const html = await page.content();
  console.log('generamos foto y html');
  // fs.writeFileSync('source.htm', html); // genera html

  browser.close();
  console.log('browser cerrado con exito');
}
run();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
