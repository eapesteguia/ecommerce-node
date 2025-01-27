import { ticketsModel } from "./models/tickets.model.js";

export default class TicketManager {
  constructor() {}

  addTicket(data) {
    return ticketsModel.create(data);
  }

  getTicketById(tid) {
    return ticketsModel.findById(tid).populate("cartid"); // métodos de mongoose
  }
}
