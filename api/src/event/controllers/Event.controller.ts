import { Permissions } from "../../core/decorators/auth.decorator.js";
import { Controller } from "../../core/decorators/controller.decorator.js";
import { Inject } from "../../core/decorators/inject.decorator.js";
import { Delete, Get, Post, Put } from "../../core/decorators/route.decorator.js";
import Validator from "../../core/utils/Validator.js";
import { PERMISSIONS } from "../constants/authorities.js";
import EventDTO from "../dtos/Event.dto.js";
import EventService from "../services/Event.service.js";

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

    @Post('/')
    @Permissions([PERMISSIONS.EVENT.CREATE])
    async create(request, response) {
        const { name, description, date, dateTime, eventStatus, maxCapacity, hasParking, parkingSlots} = request.body

        Validator.required({ name, description, date, dateTime, eventStatus, maxCapacity, hasParking, parkingSlots })

        const event = await this.eventService.create({ name, description, date, dateTime, eventStatus, maxCapacity, hasParking, parkingSlots })

        return response.status(201).json(new EventDTO(event))
    }   

    @Put('/:eventname')
    @Permissions([PERMISSIONS.EVENT.UPDATE])
    async update(request, response) {
        const { eventname } = request.params
        const { name, description, date, dateTime, eventStatus, maxCapacity, hasParking, parkingSlots } = request.body

        Validator
        .required({ eventname })
        .required({ name, description, date, dateTime, eventStatus, maxCapacity, hasParking, parkingSlots })

        const event = await this.eventService.update(eventname, { name, description, date, dateTime, eventStatus, maxCapacity, hasParking, parkingSlots })

        return response.status(200).json(new EventDTO(event))
    }

    @Delete('/:eventname')
    @Permissions([PERMISSIONS.EVENT.DELETE])
    async delete(request, response) {
        const { eventname } = request.params

        Validator.required({ eventname })

        await this.eventService.delete(eventname)

        return response.status(204).send()  
    }

}
export default EventController