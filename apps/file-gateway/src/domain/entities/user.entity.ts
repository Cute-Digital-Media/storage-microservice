import { AutoMap } from "@automapper/classes";
import { BaseDomainEntity } from "libs/common/domain/base-domain.entity";

export class UserEntityProps
{
    @AutoMap()
    public email: string
}
 
export class UserEntity extends BaseDomainEntity 
{
    constructor(props: UserEntityProps) {
        super();
        this.props = props;
    }
    
    public props : UserEntityProps 
    
    public setUrl(url: string)
    {
        this.props.email = url; 
    }
}