const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async index(request, response) {
        const { latitude, longitude, techs } = request.query

        const techsArray = parseStringAsArray(techs)

        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000,
                }
            }
        })
        return response.json({ devs })
    }
}

//testando api
// console.log(request.query)
// return response.json({ devs: [] })

// $in and $near -> mongoDB operator
// $maxDistanc -> mongoDB operator -> 10.000 = 10km