import { AutoMap } from "@automapper/classes";
import { BaseDomainEntity } from "libs/common/domain/base-domain.entity";

export class AuditLogEntityProps
{
    @AutoMap()
    public userId: string

    @AutoMap()
    public message: string

    @AutoMap()
    public createdAt: Date

    @AutoMap()
    public updatedAt: Date
}
 
type CreateAuditLogEntityProps =  Pick<AuditLogEntityProps, "userId"| "message">
export class AuditLogEntity extends BaseDomainEntity 
{
    constructor(props: CreateAuditLogEntityProps) {
        super();
        this.props = 
        {
            ...props,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now())
        };
    }
    
    public props : AuditLogEntityProps 
}