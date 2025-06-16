import Ticket from "../models/Ticket.js";
const deleteTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  await Ticket.findByIdAndDelete(id);
  res.json({ message: 'Ticket deleted' });
};
export default deleteTicket;