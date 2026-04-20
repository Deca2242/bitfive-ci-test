import { Repository } from "../../core/decorators/decorators.js"
import BaseRepository from "../../core/orm/repository/Base.repository.js"
import Slot from "../entities/Slot.entity.js"

@Repository()
export class SlotRepository extends BaseRepository<Slot> {

    constructor() {
        super(Slot)
    }

}

export default SlotRepository
