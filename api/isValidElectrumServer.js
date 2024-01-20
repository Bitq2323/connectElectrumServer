const ElectrumClient = require('electrum-client');

exports.isValidElectrumServer = async (req, res) => {
    const server = req.body.server; // Assuming server details are sent in the body of POST request

    if (!server) {
        res.status(400).send('Server parameter is required');
        return;
    }

    const [hostname, port] = server.split(':');
    if (!hostname || !port) {
        res.status(400).send('Invalid server format. Format should be hostname:port');
        return;
    }

    const client = new ElectrumClient(parseInt(port, 10), hostname, 'tls');

    try {
        await client.connect();
        res.status(200).send({ isValid: true });
    } catch (error) {
        res.status(500).send({ isValid: false, error: error.message });
    } finally {
        try {
            if (client.status === 1) {
                await client.close(); // Ensure client is properly closed
            }
        } catch (closeError) {
            console.error('Error closing Electrum client:', closeError);
        }
    }
};
