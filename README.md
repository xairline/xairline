

![CI](https://github.com/xairline/xairline/actions/workflows/main.yml/badge.svg?branch=master)
![Deployment](https://github.com/xairline/xairline/actions/workflows/heroku.yml/badge.svg?branch=master)
![Release](https://github.com/xairline/xairline/actions/workflows/release.yml/badge.svg)
![CodeQL](https://github.com/xairline/xairline/workflows/CodeQL/badge.svg)
# X airline

This project started around 2015 and I have rewrite this many times as my own learning journey. There are a lot of anti-best-practice code here that I did in the early days. 

The UI is by far the worst cause I am really new to frontend development and it is alreayd a miracle that I made it work!

That said, feel free to correct me on anything. Part of this project is to allow me to know frontend which is never my comfront zone.

# Development Setup

## Electron App
X airline is an electron app that communicates with x-plane over UDP. In a nutshell, electron app is basically a chrome brower that serves your "site". This enables us to use web tech stack to write cross platform applications. For more details on how to debug electron app, please check their website
### Prerequisite 

- [Nodejs](https://nodejs.org/en/download/) 14.x
    
    This also installs npm which is required for yarn install
- [Yarn](https://yarnpkg.com/getting-started/install)

### Install dependencies
```
yarn
```
> Note: It is recommended to run this each time you pull from upstream

### Start Development Application
#### Render process
```
yarn nx run web:build --watch
```
#### Main process
```
yarn nx run xairline:serve
```
This will launch the app
## Server
TBD