const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

//funcões do controller: index, show, store, update, destroy

module.exports = {

    async index(request, response) {
        const devs = await Dev.find()

        return response.json(devs)
    },

    //criar dev
    async store(request, response) {
        // console.log(request.body)
        const { github_username, techs, latitude, longitude } = request.body

        let dev = await Dev.findOne({ github_username })

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

            const { name = login, avatar_url, bio } = apiResponse.data

            // console.log(name, avatar_url, bio, github_username)

            const techsArray = parseStringAsArray(techs)

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })

            //Filtar as conexões que estão no max 10km de distância  
            //e que o novo dev tenha ao menos uma das techs pesquisadas
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            )
            // console.log(sendSocketMessageTo)
            sendMessage(sendSocketMessageTo, 'new-dev', dev)
        }
        return response.json(dev)
    },

    //alterar dados (nome, avatar, bio e localização e techs -> exceto username)
    async update() {

    },

    //excluir dev do database
    async destroy() {

    },

}