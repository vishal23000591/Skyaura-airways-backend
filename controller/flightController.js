const Flight = require('../models/Flight');

exports.addFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json({ message: 'Flight added successfully' });
  } catch (error) {
    console.error('Add flight error:', error);
    res.status(500).json({ error: 'Failed to add flight' });
  }
};

exports.getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    console.error('Fetch flight error:', error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
};
