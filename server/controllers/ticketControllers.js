import Ticket from "../models/Ticket.js";
const updateTicketStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export default updateTicketStatus;