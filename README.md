# Teng lab

Teng Lab focuses on understanding how human beings understand speech and appreciate music. 
This is the source code that sets up the lab's static website on https://labtengxb.github.io/. 

## How it works

This project uses:
- [Eleventy](https://www.11ty.dev/) to generate static files, packing with [Fylgja CSS](https://fylgja.dev/)
- [Github Actions](https://github.com/features/actions) to build the source and publish
- [GitHub Pages](https://pages.github.com/) to host the site

## Where to start

Assume you have basic Git/HTML/CSS/JavaScript skills and have Git, NPM on your computer.

1. Clone this repository. 
2. Get into the directory.
3. npm install the dependencies. 
4. Set environment variable NODE_ENV to production. 
5. Start a local server. Now you can modify the code and see your change locally.

```
$ git clone https://github.com/labtengxb/labtengxb.github.io.git
$ cd labtengxb.github.io
$ npm install
$ echo 'NODE_ENV=production' > .env
$ npx @11ty/eleventy --serve
```

## TODO
- [] better readme
- [] confirm lab domain
