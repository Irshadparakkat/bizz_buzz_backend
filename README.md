# bizz-buzz

### Project setup

#### Clone project

`git clone git@github.com:Techrender-ai/bizz-buzz-backend.git`

#### Setup Database

`docker run --name biss-buzz -p 5432:5432  -e POSTGRES_PASSWORD=password -d postgres`

#### creane .env

`cp apps/service-main/src/.env.example apps/service-main/src/.env`

#### install dependencies

`nvm use v20`

`npm i -g @nestjs/cli`

`npm ci`

#### run project

`nest start service-main`
