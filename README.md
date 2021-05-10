![virtual-museum-api](https://user-images.githubusercontent.com/32749673/117451723-c8fe3900-af3a-11eb-8b9d-026e4180993d.png)

The back-end API for my virtual museum built for my University final year degree project.

This API provides the back-end services for the [virtual-museum](https://github.com/ketnipz/virtual-museum) react application. It is built with node and uses the fastify web framework.

## Dependencies

- **PostgreSQL** - This API relies on a Postgres data source which must be configured in the application [config file](https://github.com/ketnipz/virtual-museum-api/blob/main/server.config.js).

## Installation

Installation progress is simple with NPM. Ensure node and NPM are installed before trying to install this project.

1. Clonse virtual-museum-api repository
```shell
$ git clone https://github.com/ketnipz/virtual-museum-api && cd virtual-museum-api
```

2. Install NPM dependencies
```shell
$ npm i 
```

3. Edit server configuration
```shell
vi server.config.js
```

4. Import data to data store using scrape.py
```shell
$ python scrape.py --postres-user postgress --postgress-password postgress
```

5. Run the server init file
```shell
$ node server.js
```

## Build Documentation
JSDoc is used throughout and HTML documentaion can be build in just a couple of easy steps.

1. Ensure JSDoc is installed
```shell
npm i -g jsdoc
```

2. Build documentation
```shell
cd virtual-museum-api && jsdoc -c jsdoc.conf.json
```

## Statement of Originality

This project is submitted as part requirement for the degree of Computer Science & Artificial Intelligence at the University of Sussex. It is the product of my own labour except where indicated in the project content.

This project may be freely copied and distributed provided the source is acknowledged.