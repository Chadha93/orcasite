# Orcasite

This repo specifies the web backend and frontend for Orcasound's whale listening. The backend is an [Elixir](https://elixir-lang.org/) app using the [Phoenix framework](https://phoenixframework.org/). The phoenix app serves a React app.

## Requirements

Orcasite uses [PostGIS](http://postgis.net/) for location data inside of Postgres. To install on MacOS, run

`brew install postgis`

### Language

Language-level dependencies can be found under `.tool-versions`. As of this writing, they are:

```
erlang 21.0.4
elixir 1.7.1
nodejs 10.4.0
```

You can use a library like [`asdf`](https://github.com/asdf-vm/asdf) to manage your language dependencies.

## Installation

Once Erlang, Elixir, and Nodejs are installed and the repository has been cloned, install the project's dependencies with this command in the root directory:

`mix deps.get`

Set up the database with

`mix ecto.create`

and

`mix ecto.migrate`

Setting up the frontend requires `npm`. To set up the frontend:

`cd assets`

and

`npm install`

For the moment, there is only one feed to listen to. To create the feed in the database, start a console in the root directory:

`iex -S mix`

In the console, run:

```
attrs = %{location_point: Geo.WKT.decode!("SRID=4326;POINT(47.60621 -122.33207)"), name: "Orcasound Lab (Haro Strait)", node_name: "rpi_seattle", slug: "orcasound-lab"}

Orcasite.Radio.create_feed(attrs)
```

Finally, in another terminal, run the server with

`iex -S mix phx.server`

To open the client page locally, go to localhost:4000 in your browser

## Deployment

For the moment, this app is running in a heroku instance with `mix phx.server`. To access the console, run:

`heroku run POOL_SIZE=2 iex -S mix`

The `POOL_SIZE` config var is necessary due to the current Postgres db having 20 connections. You can read more [about it here](https://hexdocs.pm/phoenix/heroku.html#creating-environment-variables-in-heroku).
