export default function handler(req, res) {
    res.status(200).json({ message: 'Handler is working', url: req.url });
}
