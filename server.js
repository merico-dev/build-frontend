/* eslint-disable */
/* jshint ignore:start */
const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const fetch = require('node-fetch');
const packageJson = require('./package.json')
const config = require('./config/resolveConfig');
const https = require('https')
const { getUserAlias } = require('./src/utils/user/user');

// Load New Relic If Possible
try {
  require('newrelic');
  console.log('INFO: New relic was loaded', )
} catch (error) {
  console.error('ERROR: could not load new relic', error)
}

// TODO: Add to enum and update Docker files to include on pipeline (cache test)
const badgeImageSizes = {
  default: {
    width: 160,
    height: 91
  },
  big: {
    width: 360,
    height: 204
  }
}

// TODO: Add to utils and update Docker files to include on pipeline
async function checkImage (imageSrc) {
  return new Promise((resolve, reject) => {
    try {
      https.get(imageSrc, ({ statusCode }) => {
        if (!statusCode) return;

        if (statusCode === 200) {
          resolve(imageSrc)
        }

        if (statusCode !== 200) {
          reject(`HTTP response is ${statusCode}: for ${imageSrc}`)
        }
      }).on('error', () => {
        reject(`Erro trying to connect to server for ${imageSrc}`)
      }).on('timeout', () => {
        reject(`Server timeout for ${imageSrc}`)
      });
    } catch(e) {
      reject(e);
    }
  })
}

// redirect http to https always
app.use (function (req, res, next) {
  if(req.headers && req.headers.host && req.headers.host.match(/localhost/) !== null){
    return next()
  } else if (req.headers && req.headers.host && req.headers.host.match(/mericobuild/) !== null) {
    return res.redirect('https://merico.build' + req.url);
  } else if (req.secure || req.protocol === 'https' || req.get('x-forwarded-proto') === 'https') {
    // request was via https, so do no special handling
    return next();
  } else {
    // request was via http, so redirect to https
    return res.redirect('https://' + req.headers.host + req.url);
  }
});

app.use(express.static('dist'));

app.get('/badges/assertion/:id', async (req,res) => {
  try {
    const id = Number.parseInt(req.params.id);
    const assertionData = await fetch(`${config.apiUrl}/badge/${id}`)
      .then((response) => response.json())
      .then(data => data);
    let sharableImage = '';
    try {
      const bigImage = assertionData.imageUrl.replace('.png', `_${badgeImageSizes.big.width}x${badgeImageSizes.big.height}.png`);
      await checkImage(
        bigImage
      )
      sharableImage = bigImage
    } catch (e) {
      console.error('Unable to find bigger image', e);
      sharableImage = assertionData.imageUrl
    }

    const assertionLink = `${config.frontendUrl}/badges/assertion/${assertionData.id}`;
    const badgeTitle = assertionData.BadgeType
      ? `Merico Build - ${assertionData.BadgeType.title}`
      : 'Merico Build';
    const rendered = await ejs.renderFile(`${__dirname}/dist/index.ejs`, {
      title: badgeTitle,
      url: assertionLink,
      image: sharableImage,
      description: assertionData.description
    }, {delimiter: '?'});

    res.send(rendered);
  } catch (e) {
    console.error('Unable to use provided template', e);
    // in case we fail to handle the template we return the default html
    res.sendFile(path.join(`${__dirname}/dist/index.html`), {headers: req.headers});
  }
})

app.get('/profile/:id', async (req,res) => {
  try {
    const id = Number.parseInt(req.params.id)
    const profileData = await fetch(`${config.apiUrl}/publicProfile/${id}`)
      .then((response) => response.json())
      .then(data => data)
    const profileTitle = (
      (profileData && profileData.user)
        ? `${getUserAlias(profileData.user, '', true)} - Merico Build`
        : 'Merico Build'
    )
    const profileImage = (
      (profileData && profileData.user && profileData.user.photo)
        ? profileData.user.photo
        : ''
    )
    const rendered = await ejs.renderFile(`${__dirname}/dist/index.ejs`, {
      title: profileTitle,
      url: null,
      image: profileImage,
      description: 'Analytics to help with your life as a Developer'
    }, {delimiter: '?'});

    res.send(rendered);
  } catch (e) {
    console.error('Unable to use provided template', e)
    // in case we fail to handle the template we return the default html
    res.sendFile(path.join(`${__dirname}/dist/index.html`), {headers: req.headers})
  }
});

app.get('/version', (req, res)=>{
  let revision = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString().trim()

  let commitDetails = require('child_process')
  .execSync('git log -1')
  .toString().trim()

  return res.status(200).send({ latestCommit: revision, version: packageJson.version, commitDetails, env: process.env.NODE_ENV })
})

app.get('*', (req,res) =>{
  res.sendFile(path.join(`${__dirname}/dist/index.html`), {headers: req.headers});
});

let port = config.port || 3000

app.listen(port, () => console.log(`App listening on port: ${port}`));

/* jshint ignore:end */
