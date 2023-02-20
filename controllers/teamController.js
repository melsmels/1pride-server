import TeamMatches from '../models/TeamMatches.js'

export async function getMatches(req, res) {
    const matches = await TeamMatches.find();
    return res.json(matches);
}