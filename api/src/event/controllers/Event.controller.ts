import { Permissions } from "../../core/decorators/auth.decorator.js";
import { Controller } from "../../core/decorators/controller.decorator.js";
import { Inject } from "../../core/decorators/inject.decorator.js";
import { Delete, Get, Post, Put } from "../../core/decorators/route.decorator.js";
import Validator from "../../core/utils/Validator.js";
import { InvalidFormatError } from "../../core/errors/InvalidFormat.error.js";
import { PERMISSIONS } from "../constants/authorities.js";
import EventDTO from "../dtos/Event.dto.js";
import EventService from "../services/Event.service.js";
import ParkingDTO from "../../parking/dtos/Parking.dto.js";

@Controller('/events')
export class EventController {

    constructor(
        @Inject(EventService)
        private eventService: EventService
    ) { }

    @Get('/')
    @Permissions([PERMISSIONS.EVENT.READ])
    async findAll(request, response) {
        const events = await this.eventService.findAll()

        return response.status(200).json(events.map(event => new EventDTO(event)))
    }

    @Get('/:eventName')
    @Permissions([PERMISSIONS.EVENT.READ])
    async findByEventName(request, response) {
        const { eventName } = request.params || {}

        Validator.required({ eventName })

        const event = await this.eventService.findByName(eventName)

        return response.status(200).json(new EventDTO(event))
    }

    @Get('/:eventId/parkings')
    @Permissions([PERMISSIONS.EVENT.READ])
    async findParkingsByEvent(request, response) {
        const { eventId } = request.params || {}

        Validator.required({ eventId })

        const event = await this.eventService.findByIdWithParkings(eventId)

        return response.status(200).json((event.parkings || []).map(p => new ParkingDTO(p)))
    }

    @Post('/')
    @Permissions([PERMISSIONS.EVENT.CREATE])
    async create(request, response) {
        const { name, description, location, date, dateTime, eventStatus, maxCapacity, hasParking } = request.body

        Validator
            .required({ name, description, location, date, dateTime, maxCapacity })
            .isDate({ date })
            .isNumeric({ maxCapacity })

        if (Number(maxCapacity) <= 0) {
            throw new InvalidFormatError('maxCapacity debe ser mayor a 0')
        }

        const eventDate = new Date(date)
        if (eventDate <= new Date()) {
            throw new InvalidFormatError('La fecha del evento debe ser futura')
        }

        const event = await this.eventService.create({ name, description, location, date, dateTime, eventStatus, maxCapacity, hasParking })

        return response.status(201).json(new EventDTO(event))
    }

    @Put('/:id')
    @Permissions([PERMISSIONS.EVENT.UPDATE])
    async update(request, response) {
        const { id } = request.params
        const { name, description, location, date, dateTime, eventStatus, maxCapacity, hasParking } = request.body

        Validator.required({ id })

        if (date) {
            Validator.isDate({ date })
            const eventDate = new Date(date)
            if (eventDate <= new Date()) {
                throw new InvalidFormatError('La fecha del evento debe ser futura')
            }
        }

        if (maxCapacity !== undefined) {
            Validator.isNumeric({ maxCapacity })
            if (Number(maxCapacity) <= 0) {
                throw new InvalidFormatError('maxCapacity debe ser mayor a 0')
            }
        }

        const event = await this.eventService.update(id, { name, description, location, date, dateTime, eventStatus, maxCapacity, hasParking })

        return response.status(200).json(new EventDTO(event))
    }

    @Delete('/:id')
    @Permissions([PERMISSIONS.EVENT.DELETE])
    async delete(request, response) {
        const { id } = request.params

        Validator.required({ id })

        await this.eventService.delete(id)

        return response.status(204).send()
    }

}
export default EventController