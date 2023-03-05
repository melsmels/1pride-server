import axios from 'axios';
// express
import express from 'express';
// dotenv
import dotenv from 'dotenv';
// CORS
import cors from 'cors';
// DB Connection
import connectDB from './config/db.js';
// Routes
import userRoutes from './routes/userRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
// Models
import TeamMatches from './models/TeamMatches.js'

const app = express();
app.use(express.json());

// Dotenv
dotenv.config();

// Make the connection to MongoDB
connectDB();

// CORS
const whitelist = [process.env.CLIENT_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if(whitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('CORS Error'))
        }
    }
}

app.use(cors(corsOptions))

// Routing
app.use('/v1/users', userRoutes);
app.use('/v1/team', teamRoutes);

// Server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`Server running in port: ${PORT}`)
})

// GET TEAM MATCHES FROM RIOT API EVERY 1 MINUTE

setInterval(function() {
    console.log('fetching team matches')
    teamMatches();
}, 60 * 1000);

async function teamMatches() {
    // const { puuid } = req.body;
    const puuid = "6Fc34nrStJCQ_sgA-Ga12H7Q-SPCDUrorjsFOuFA8KQO02YteB7QLehXw9qe43ZrqEz6vnixjEPkWg";
	const { data: matchesIds } = await axios.request({
        method: 'GET',
        url: `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?type=ranked&start=0&count=20`,
        headers: {
            "X-Riot-Token": process.env.RIOT_KEY
        }
    })
    const urls = [];
    matchesIds.map(match => urls.push(`https://americas.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${process.env.RIOT_KEY}`));
    Promise.all(urls.map(url => axios(url).then(async data => {
        const dbmatches = await TeamMatches.find();
        let dbmatchesids = [];
        dbmatches.map(mapmatch => {
            dbmatchesids.push(mapmatch.metadata.matchId);
        })
        const match = data.data;
        if(!dbmatchesids.includes(match.metadata.matchId)) {
            const newMatch = new TeamMatches(match);
            await newMatch.save();
        }
    })))
}
