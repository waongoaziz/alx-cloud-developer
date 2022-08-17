import express, { Router, Request, Response, json } from 'express'
import bodyParser from 'body-parser'

import { Car, cars as cars_list } from './cars'
;(async () => {
	let cars: Car[] = cars_list

	//Create an express application
	const app = express()
	//default port to listen
	const port = 8082

	//use middleware so post bodies
	//are accessable as req.body.{{variable}}
	app.use(bodyParser.json())

	// Root URI call
	app.get('/', (req: Request, res: Response) => {
		res.status(200).send('Welcome to the Cloud!')
	})

	// Get a greeting to a specific person
	// to demonstrate routing parameters
	// > try it {{host}}/persons/:the_name
	app.get('/persons/:name', (req: Request, res: Response) => {
		let { name } = req.params

		if (!name) {
			return res.status(400).send(`name is required`)
		}

		return res.status(200).send(`Welcome to the Cloud, ${name}!`)
	})

	// Get a greeting to a specific person to demonstrate req.query
	// > try it {{host}}/persons?name=the_name
	app.get('/persons/', (req: Request, res: Response) => {
		let { name } = req.query

		if (!name) {
			return res.status(400).send(`name is required`)
		}

		return res.status(200).send(`Welcome to the Cloud, ${name}!`)
	})

	// Post a greeting to a specific person
	// to demonstrate req.body
	// > try it by posting {"name": "the_name" } as
	// an application/json body to {{host}}/persons
	app.post('/persons', async (req: Request, res: Response) => {
		const { name } = req.body

		if (!name) {
			return res.status(400).send(`name is required`)
		}

		return res.status(200).send(`Welcome to the Cloud, ${name}!`)
	})

	// @TODO Add an endpoint to GET a list of cars
	// it should be filterable by make with a query paramater
	app.get('/cars', (req: Request, res: Response) => {
		return res.status(200).send({
			data: { ...cars },
		})
	})
	// @TODO Add an endpoint to get a specific car
	app.get('/cars/:id', (req: Request, res: Response) => {
		const { id } = req.params

		let car = cars.find((c) => {
			console.log('c', id)

			return c.id === +id
		})

		console.log('car', car)

		if (car) {
			return res.status(200).send(car)
		} else {
			return res.status(404).send('Car not found')
		}
	})
	// it should require id
	// it should fail gracefully if no matching car is found

	/// @TODO Add an endpoint to post a new car to our list
	// it should require id, type, model, and cost
	app.post('/cars', (req: Request, res: Response) => {
		let errors = []
		const body = req.body

		if (!body.type) {
			errors.push({ type: 'Type should be provided' })
		}

		if (!body.model) {
			errors.push({ model: 'model should be provided' })
		}

		if (!body.cost) {
			errors.push({ cost: 'cost should be provided' })
		}

		if (errors.length != 0) {
			return res.status(400).send(errors)
		} else {
			const newCar = {
				id: cars.length,
				...body,
			}
			console.log('succ', newCar)

			return res.status(204).send(newCar)
		}
	})

	// Start the Server
	app.listen(port, () => {
		console.log(`server running http://localhost:${port}`)
		console.log(`press CTRL+C to stop server`)
	})
})()
