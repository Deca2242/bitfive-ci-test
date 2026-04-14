import { Column } from "../../core/orm/decorators/column.decorator.js";
import { Entity } from "../../core/orm/decorators/entity.decorator.js";
import { Id } from "../../core/orm/decorators/id.decorator.js";


@Entity('parkings')
export class Parking {

  @Id()
  id: string

  @Column({ type: 'string', nullable: false })
  eventId: string

  @Column({ type: 'string', nullable: false })
  slotCode: string

  @Column({ type: 'boolean', nullable: false, default: true })
  isAvailable: boolean

  status: string

  isActive: boolean

  isDeleted: boolean

  createdAt: Date

  createdBy: string

  updatedAt: Date

  updatedBy: string

  deletedAt: Date

  deletedBy: string
}

export default Parking